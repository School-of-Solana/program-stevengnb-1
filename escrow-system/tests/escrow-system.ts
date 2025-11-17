import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EscrowSystem } from "../target/types/escrow_system";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("escrow-system", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.EscrowSystem as Program<EscrowSystem>;

  const alice = anchor.web3.Keypair.generate();
  const bob = anchor.web3.Keypair.generate();
  const charlie = anchor.web3.Keypair.generate();

  const escrowId1 = new anchor.BN(1);
  const escrowId2 = new anchor.BN(2);
  const escrowId3 = new anchor.BN(3);
  const amount = new anchor.BN(0.5 * LAMPORTS_PER_SOL);

  before(async () => {
    await airdrop(provider.connection, alice.publicKey);
    await airdrop(provider.connection, bob.publicKey);
    await airdrop(provider.connection, charlie.publicKey);
  });

  describe("Initialize Escrow", () => {
    it("Should successfully create escrow with valid parameters", async () => {
      const [escrowPda, bump] = getEscrowAddress(
        alice.publicKey,
        escrowId1,
        program.programId
      );

      await program.methods
        .initialize(amount, escrowId1)
        .accounts({
          creator: alice.publicKey,
          recipient: bob.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([alice])
        .rpc();

      await checkEscrow(
        program,
        escrowPda,
        alice.publicKey,
        bob.publicKey,
        amount,
        escrowId1,
        { pending: {} },
        bump
      );
    });

    it("Should fail when initializing with zero amount", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId2,
        program.programId
      );

      let shouldFail = "This should fail";
      try {
        await program.methods
          .initialize(new anchor.BN(0), escrowId2)
          .accounts({
            creator: alice.publicKey,
            recipient: bob.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([alice])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(
          err.error.errorCode.code,
          "InvalidAmount",
          "Expected 'InvalidAmount' error for zero amount"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Escrow initialization should have failed with zero amount"
      );
    });

    it("Should fail when creating duplicate escrow with same ID", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId1,
        program.programId
      );

      let shouldFail = "This should fail";
      try {
        await program.methods
          .initialize(amount, escrowId1)
          .accounts({
            creator: alice.publicKey,
            recipient: charlie.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([alice])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        assert.isTrue(
          error.message.includes("already in use"),
          "Expected 'already in use' error for duplicate escrow ID"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Should not be able to create duplicate escrow with same ID"
      );
    });

    it("Should allow same creator to create multiple escrows with different IDs", async () => {
      const [escrowPda, bump] = getEscrowAddress(
        alice.publicKey,
        escrowId2,
        program.programId
      );

      await program.methods
        .initialize(amount, escrowId2)
        .accounts({
          creator: alice.publicKey,
          recipient: charlie.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([alice])
        .rpc();

      await checkEscrow(
        program,
        escrowPda,
        alice.publicKey,
        charlie.publicKey,
        amount,
        escrowId2,
        { pending: {} },
        bump
      );
    });

    it("Should allow different users to create escrows with same ID", async () => {
      const [escrowPda, bump] = getEscrowAddress(
        bob.publicKey,
        escrowId1,
        program.programId
      );

      await program.methods
        .initialize(amount, escrowId1)
        .accounts({
          creator: bob.publicKey,
          recipient: alice.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bob])
        .rpc();

      await checkEscrow(
        program,
        escrowPda,
        bob.publicKey,
        alice.publicKey,
        amount,
        escrowId1,
        { pending: {} },
        bump
      );
    });
  });

  describe("Approve Escrow", () => {
    it("Should successfully approve pending escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId1,
        program.programId
      );

      await program.methods
        .approve()
        .accounts({
          creator: alice.publicKey,
          escrow: escrowPda,
        })
        .signers([alice])
        .rpc();

      const escrowAccount = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(
        escrowAccount.state,
        { approved: {} },
        "Escrow state should be Approved"
      );
    });

    it("Should fail when non-creator tries to approve", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId2,
        program.programId
      );

      let shouldFail = "This should fail";
      try {
        await program.methods
          .approve()
          .accounts({
            creator: bob.publicKey,
            escrow: escrowPda,
          })
          .signers([bob])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        assert.isTrue(
          error.message.includes("constraint") ||
            error.message.includes("has_one"),
          "Expected constraint error when non-creator tries to approve"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Non-creator should not be able to approve escrow"
      );
    });

    it("Should fail when approving already approved escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId1,
        program.programId
      );

      let shouldFail = "This should fail";
      try {
        await program.methods
          .approve()
          .accounts({
            creator: alice.publicKey,
            escrow: escrowPda,
          })
          .signers([alice])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(
          err.error.errorCode.code,
          "InvalidStateForApproval",
          "Expected 'InvalidStateForApproval' error"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Should not be able to approve already approved escrow"
      );
    });
  });

  describe("Claim Escrow", () => {
    it("Should fail when claiming pending (non-approved) escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId2,
        program.programId
      );

      let shouldFail = "This should fail";
      try {
        await program.methods
          .claim()
          .accounts({
            recipient: charlie.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([charlie])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(
          err.error.errorCode.code,
          "InvalidStateForClaim",
          "Expected 'InvalidStateForClaim' error for pending escrow"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Should not be able to claim pending escrow"
      );
    });

    it("Should successfully claim approved escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId1,
        program.programId
      );

      const bobBalanceBefore = await provider.connection.getBalance(
        bob.publicKey
      );

      await program.methods
        .claim()
        .accounts({
          recipient: bob.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bob])
        .rpc();

      const bobBalanceAfter = await provider.connection.getBalance(
        bob.publicKey
      );

      assert.isTrue(
        bobBalanceAfter > bobBalanceBefore,
        "Recipient should receive funds"
      );

      const escrowAccount = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(
        escrowAccount.state,
        { claimed: {} },
        "Escrow state should be Claimed"
      );
    });

    it("Should fail when non-recipient tries to claim", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId2,
        program.programId
      );

      await program.methods
        .approve()
        .accounts({
          creator: alice.publicKey,
          escrow: escrowPda,
        })
        .signers([alice])
        .rpc();

      let shouldFail = "This should fail";
      try {
        await program.methods
          .claim()
          .accounts({
            recipient: bob.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        assert.isTrue(
          error.message.includes("constraint") ||
            error.message.includes("has_one"),
          "Expected constraint error when non-recipient tries to claim"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Non-recipient should not be able to claim escrow"
      );
    });

    it("Should fail when trying to claim already claimed escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId1,
        program.programId
      );

      let shouldFail = "This should fail";
      try {
        await program.methods
          .claim()
          .accounts({
            recipient: bob.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(
          err.error.errorCode.code,
          "InvalidStateForClaim",
          "Expected 'InvalidStateForClaim' error for already claimed escrow"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Should not be able to claim already claimed escrow"
      );
    });

    it("Should successfully claim second approved escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId2,
        program.programId
      );

      const charlieBalanceBefore = await provider.connection.getBalance(
        charlie.publicKey
      );

      await program.methods
        .claim()
        .accounts({
          recipient: charlie.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([charlie])
        .rpc();

      const charlieBalanceAfter = await provider.connection.getBalance(
        charlie.publicKey
      );

      assert.isTrue(
        charlieBalanceAfter > charlieBalanceBefore,
        "Recipient should receive funds"
      );

      const escrowAccount = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(
        escrowAccount.state,
        { claimed: {} },
        "Escrow state should be Claimed"
      );
    });
  });

  describe("Cancel Escrow", () => {
    it("Should successfully cancel pending escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        bob.publicKey,
        escrowId1,
        program.programId
      );

      const bobBalanceBefore = await provider.connection.getBalance(
        bob.publicKey
      );

      await program.methods
        .cancel()
        .accounts({
          creator: bob.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bob])
        .rpc();

      const bobBalanceAfter = await provider.connection.getBalance(
        bob.publicKey
      );

      assert.isTrue(
        bobBalanceAfter > bobBalanceBefore,
        "Creator should receive refund"
      );

      const escrowAccount = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(
        escrowAccount.state,
        { cancelled: {} },
        "Escrow state should be Cancelled"
      );
    });

    it("Should fail when non-creator tries to cancel", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId3,
        program.programId
      );

      await program.methods
        .initialize(amount, escrowId3)
        .accounts({
          creator: alice.publicKey,
          recipient: bob.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([alice])
        .rpc();

      let shouldFail = "This should fail";
      try {
        await program.methods
          .cancel()
          .accounts({
            creator: bob.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        assert.isTrue(
          error.message.includes("constraint") ||
            error.message.includes("has_one"),
          "Expected constraint error when non-creator tries to cancel"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Non-creator should not be able to cancel escrow"
      );
    });

    it("Should fail when canceling approved escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId3,
        program.programId
      );

      await program.methods
        .approve()
        .accounts({
          creator: alice.publicKey,
          escrow: escrowPda,
        })
        .signers([alice])
        .rpc();

      let shouldFail = "This should fail";
      try {
        await program.methods
          .cancel()
          .accounts({
            creator: alice.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([alice])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(
          err.error.errorCode.code,
          "InvalidStateForCancellation",
          "Expected 'InvalidStateForCancellation' error for approved escrow"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Should not be able to cancel approved escrow"
      );
    });

    it("Should fail when trying to cancel already cancelled escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        bob.publicKey,
        escrowId1,
        program.programId
      );

      let shouldFail = "This should fail";
      try {
        await program.methods
          .cancel()
          .accounts({
            creator: bob.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([bob])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(
          err.error.errorCode.code,
          "InvalidStateForCancellation",
          "Expected 'InvalidStateForCancellation' error for already cancelled escrow"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Should not be able to cancel already cancelled escrow"
      );
    });

    it("Should fail when trying to cancel claimed escrow", async () => {
      const [escrowPda] = getEscrowAddress(
        alice.publicKey,
        escrowId3,
        program.programId
      );

      await program.methods
        .claim()
        .accounts({
          recipient: bob.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([bob])
        .rpc();

      let shouldFail = "This should fail";
      try {
        await program.methods
          .cancel()
          .accounts({
            creator: alice.publicKey,
            escrow: escrowPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([alice])
          .rpc();
      } catch (error) {
        shouldFail = "Failed";
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(
          err.error.errorCode.code,
          "InvalidStateForCancellation",
          "Expected 'InvalidStateForCancellation' error for claimed escrow"
        );
      }
      assert.strictEqual(
        shouldFail,
        "Failed",
        "Should not be able to cancel claimed escrow"
      );
    });
  });

  describe("Edge Cases and State Management", () => {
    it("Should maintain correct state transitions: Pending -> Approved -> Claimed", async () => {
      const [escrowPda, bump] = getEscrowAddress(
        charlie.publicKey,
        escrowId1,
        program.programId
      );

      await program.methods
        .initialize(amount, escrowId1)
        .accounts({
          creator: charlie.publicKey,
          recipient: alice.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([charlie])
        .rpc();

      await checkEscrow(
        program,
        escrowPda,
        charlie.publicKey,
        alice.publicKey,
        amount,
        escrowId1,
        { pending: {} },
        bump
      );

      await program.methods
        .approve()
        .accounts({
          creator: charlie.publicKey,
          escrow: escrowPda,
        })
        .signers([charlie])
        .rpc();

      let escrowData = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(escrowData.state, { approved: {} });

      await program.methods
        .claim()
        .accounts({
          recipient: alice.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([alice])
        .rpc();

      escrowData = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(escrowData.state, { claimed: {} });
    });

    it("Should maintain correct state transitions: Pending -> Cancelled", async () => {
      const [escrowPda, bump] = getEscrowAddress(
        charlie.publicKey,
        escrowId2,
        program.programId
      );

      await program.methods
        .initialize(amount, escrowId2)
        .accounts({
          creator: charlie.publicKey,
          recipient: bob.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([charlie])
        .rpc();

      await checkEscrow(
        program,
        escrowPda,
        charlie.publicKey,
        bob.publicKey,
        amount,
        escrowId2,
        { pending: {} },
        bump
      );

      await program.methods
        .cancel()
        .accounts({
          creator: charlie.publicKey,
          escrow: escrowPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([charlie])
        .rpc();

      const escrowData = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(escrowData.state, { cancelled: {} });
    });

    it("Should keep escrow account alive after claim (not close account)", async () => {
      const [escrowPda] = getEscrowAddress(
        charlie.publicKey,
        escrowId1,
        program.programId
      );

      const escrowData = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(
        escrowData.state,
        { claimed: {} },
        "Escrow account should still exist with Claimed state"
      );
    });

    it("Should keep escrow account alive after cancel (not close account)", async () => {
      const [escrowPda] = getEscrowAddress(
        charlie.publicKey,
        escrowId2,
        program.programId
      );

      const escrowData = await program.account.escrow.fetch(escrowPda);
      assert.deepEqual(
        escrowData.state,
        { cancelled: {} },
        "Escrow account should still exist with Cancelled state"
      );
    });
  });
});

async function airdrop(
  connection: any,
  address: any,
  amount = 2 * LAMPORTS_PER_SOL
) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    "confirmed"
  );
}

function getEscrowAddress(
  creator: PublicKey,
  escrowId: anchor.BN,
  programId: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("escrow"),
      creator.toBuffer(),
      escrowId.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
}

async function checkEscrow(
  program: Program<EscrowSystem>,
  escrow: PublicKey,
  creator?: PublicKey,
  recipient?: PublicKey,
  amount?: anchor.BN,
  escrowId?: anchor.BN,
  state?: any,
  bump?: number
) {
  const escrowData = await program.account.escrow.fetch(escrow);

  if (creator) {
    assert.strictEqual(
      escrowData.creator.toString(),
      creator.toString(),
      `Escrow creator should be ${creator.toString()}`
    );
  }
  if (recipient) {
    assert.strictEqual(
      escrowData.recipient.toString(),
      recipient.toString(),
      `Escrow recipient should be ${recipient.toString()}`
    );
  }
  if (amount) {
    assert.strictEqual(
      escrowData.amount.toString(),
      amount.toString(),
      `Escrow amount should be ${amount.toString()}`
    );
  }
  if (escrowId) {
    assert.strictEqual(
      escrowData.escrowId.toString(),
      escrowId.toString(),
      `Escrow ID should be ${escrowId.toString()}`
    );
  }
  if (state) {
    assert.deepEqual(
      escrowData.state,
      state,
      `Escrow state should be ${JSON.stringify(state)}`
    );
  }
  if (bump !== undefined) {
    assert.strictEqual(
      escrowData.bump,
      bump,
      `Escrow bump should be ${bump}`
    );
  }
}

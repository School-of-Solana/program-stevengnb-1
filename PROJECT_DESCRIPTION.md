# Project Description

**Deployed Frontend URL:** VERCEL URL

**Solana Program ID:** FBkdzDicx5cyJoTQ1NrM9BPhFkhwFk4a1WRbvGGNYMqY

## Project Overview

### Description

A secure payment service on Solana that protects both buyers and sellers. You deposit SOL for a job or purchase, and it's locked until you approve the work. Then the seller gets paid. The seller knows the money is there, and you stay in control until you're satisfied.

### Key Features

- **Create Escrow**: Lock SOL for a specific recipient with custom amount and escrow ID
- **Approve Escrow**: Creator approves after verifying work/delivery
- **Claim Funds**: Recipient withdraws SOL after creator approval
- **Cancel Escrow**: Creator cancels and reclaims funds from unapproved escrows
- **View Escrows**: See all escrows you created or can claim with their current status

### How to Use the dApp

1. **Connect Wallet** - Connect your Solana wallet
2. **Create Escrow** - Enter recipient's wallet address, amount in SOL, unique escrow ID, and click "Create"
3. **View Escrows** - Check your created escrows or escrows waiting for you to claim
4. **Approve Work** - Once recipient delivers, click "Approve" on your created escrow
5. **Claim Funds** - If you're the recipient and escrow is approved, click "Claim" to receive SOL
6. **Cancel** - If work wasn't delivered, click "Cancel" on pending escrows to get refund

## Program Architecture

The dApp uses a state-machine architecture with one account type and four instructions. Each escrow transitions through states (Pending → Approved → Claimed or Cancelled), ensuring funds are only released when conditions are met.

### PDA Usage

**PDAs Used:**
- **Escrow PDA**: Derived from seeds `["escrow", creator_pubkey, escrow_id_bytes]` - ensures each escrow has a unique address and prevents conflicts. The escrow ID allows the same creator to have multiple active escrows with different recipients or for different purposes.

### Program Instructions

**Instructions Implemented:**

- **Initialize**: Creates a new escrow and transfers SOL from creator to escrow PDA. Sets initial state to `Pending`.

- **Approve**: Creator marks the escrow as approved after verifying work/delivery. Changes state from `Pending` to `Approved`. Only the creator can call this.

- **Claim**: Recipient withdraws SOL from approved escrow and closes the account. Can only be called when state is `Approved` and only by the designated recipient.

- **Cancel**: Creator reclaims SOL from pending escrow and closes the account. Can only be called when state is `Pending` (before approval) and only by the creator.

### Account Structure
```rust
#[account]
pub struct Escrow {
    pub creator: Pubkey,      // Wallet that created and funded the escrow
    pub recipient: Pubkey,    // Wallet that can claim funds after approval
    pub amount: u64,          // Amount of lamports held in escrow
    pub escrow_id: u64,       // Unique ID for this escrow
    pub state: EscrowState,   // Current state: Pending or Approved
    pub created_at: i64,      // Unix timestamp when created
    pub bump: u8,             // PDA bump seed
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum EscrowState {
    Pending,   // Waiting for creator approval
    Approved,  // Creator approved, recipient can claim
}
```

## Testing

### Test Coverage

**Happy Path Tests:**

- **Initialize Escrow**: Successfully creates escrow with Pending state and transfers SOL from creator
- **Approve Escrow**: Creator successfully approves escrow, changing state to Approved
- **Claim Escrow**: Recipient successfully claims SOL from approved escrow and closes account
- **Cancel Escrow**: Creator successfully cancels pending escrow, reclaims SOL, and closes account

**Unhappy Path Tests:**

- **Initialize with Zero Amount**: Fails when trying to create escrow with 0 SOL
- **Approve by Non-Creator**: Fails when recipient tries to approve their own escrow
- **Claim Pending Escrow**: Fails when recipient tries to claim before creator approves
- **Claim by Wrong User**: Fails when non-recipient tries to claim an approved escrow
- **Cancel by Non-Creator**: Fails when recipient tries to cancel escrow
- **Cancel Approved Escrow**: Fails when creator tries to cancel after already approving

### Running Tests
```bash
yarn install    # install dependencies
anchor build    # build program
anchor test     # run all tests
```

### Additional Notes for Evaluators

This is my first Solana program! The biggest learning curve was understanding state management and how to properly validate state transitions. I initially tried to implement this without states, but realized that would create security issues where recipients could claim before work was verified.

Understanding PDAs and how they differ from regular keypairs took time. The account constraints (`has_one = creator`, `constraint = escrow.state == EscrowState::Pending`) were confusing at first but made sense once I understood Anchor validates these automatically.

Testing state transitions was challenging - I had to learn how to properly set up test scenarios for each state and verify that invalid transitions fail with the correct errors.

The escrow_id parameter allows flexibility for creators to have multiple simultaneous escrows, which seems practical for freelancers or merchants handling multiple clients/orders.

**Design Trade-offs and Limitations:**

The approval mechanism creates an inherent trust assumption that goes against pure decentralization principles. The recipient must trust that the creator will approve the escrow after work is delivered. This introduces several risks:

- **Approval Risk**: Creator could refuse to approve even after recipient completes the work, effectively holding funds hostage
- **Centralized Control**: The creator has unilateral power to approve or cancel, making this more "creator-controlled" than truly "trustless"
- **No Dispute Resolution**: There's no on-chain mechanism to resolve disagreements - if the creator claims work wasn't done but recipient disagrees, there's no arbitration
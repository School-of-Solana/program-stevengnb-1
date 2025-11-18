# Project Description

**Deployed Frontend URL:** https://guard-sol.vercel.app/

**Solana Program ID:** FBkdzDicx5cyJoTQ1NrM9BPhFkhwFk4a1WRbvGGNYMqY

## Project Overview

### Description

A secure payment service on Solana that protects both buyers and sellers. You deposit SOL for a job or purchase, and it's locked until you approve the work. Then the seller gets paid. The seller knows the money is there, and you stay in control until you're satisfied.

### Key Features

- **Create Escrow**: Lock SOL for a specific recipient with custom amount and escrow ID
- **Approve Escrow**: Creator approves after verifying work/delivery
- **Claim Funds**: Recipient withdraws SOL after creator approval (account remains with Claimed state)
- **Cancel Escrow**: Creator cancels and reclaims funds from pending escrows (account remains with Cancelled state)
- **View Escrows**: See all escrows you created or can claim with their current status

### How to Use the dApp

1. **Connect Wallet** - Connect your Solana wallet
2. **Create Escrow** - Enter recipient's wallet address, amount in SOL, unique escrow ID, and click "Create"
3. **My Escrows** - Check your created escrows
4. **Approve Work** - Once recipient delivers, click "Approve" on your created escrow
5. **Claimable Escrow** - Check escrows where you're the recipient and if the escrow is approved, click "Claim" to receive SOL
6. **Cancel** - If work wasn't delivered, click "Cancel" on pending escrows to get refund

## Program Architecture

The dApp uses a state-machine architecture with one account type and four instructions. Each escrow transitions through states (Pending → Approved → Claimed, or Pending → Cancelled), ensuring funds are only released when conditions are met. Accounts remain alive after completion to maintain transaction history.

### PDA Usage

**PDAs Used:**
- **Escrow PDA**: Derived from seeds `["escrow", creator_pubkey, escrow_id_bytes]` - ensures each escrow has a unique address and prevents conflicts. The escrow ID allows the same creator to have multiple active escrows with different recipients or for different purposes.

### Program Instructions

**Instructions Implemented:**

- **Initialize**: Creates a new escrow and transfers SOL from creator to escrow PDA. Sets initial state to `Pending`.

- **Approve**: Creator marks the escrow as approved after verifying work/delivery. Changes state from `Pending` to `Approved`. Only the creator can call this.

- **Claim**: Recipient withdraws SOL from approved escrow and updates state to `Claimed`. Can only be called when state is `Approved` and only by the designated recipient. Account remains alive for transaction history.

- **Cancel**: Creator reclaims SOL from pending escrow and updates state to `Cancelled`. Can only be called when state is `Pending` (before approval or other terminal states) and only by the creator. Account remains alive for transaction history.

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
    Pending,    // Waiting for creator approval
    Approved,   // Creator approved, recipient can claim
    Claimed,    // Recipient has claimed the funds
    Cancelled,  // Creator has cancelled and reclaimed funds
}
```

## Testing

### Test Coverage (24 Tests Total)

**Initialize Escrow Tests (5 tests):**

- ✅ Should successfully create escrow with valid parameters
- ✅ Should fail when initializing with zero amount
- ✅ Should fail when creating duplicate escrow with same ID
- ✅ Should allow same creator to create multiple escrows with different IDs
- ✅ Should allow different users to create escrows with same ID

**Approve Escrow Tests (3 tests):**

- ✅ Should successfully approve pending escrow
- ✅ Should fail when non-creator tries to approve
- ✅ Should fail when approving already approved escrow

**Claim Escrow Tests (4 tests):**

- ✅ Should fail when claiming pending (non-approved) escrow
- ✅ Should successfully claim approved escrow
- ✅ Should fail when non-recipient tries to claim
- ✅ Should fail when trying to claim already claimed escrow

**Cancel Escrow Tests (6 tests):**

- ✅ Should successfully cancel pending escrow
- ✅ Should fail when non-creator tries to cancel
- ✅ Should fail when canceling approved escrow
- ✅ Should fail when trying to cancel already cancelled escrow
- ✅ Should fail when trying to cancel claimed escrow

**Edge Cases and State Management Tests (6 tests):**

- ✅ Should maintain correct state transitions: Pending → Approved → Claimed
- ✅ Should maintain correct state transitions: Pending → Cancelled
- ✅ Should keep escrow account alive after claim (not close account)
- ✅ Should keep escrow account alive after cancel (not close account)
- ✅ Should successfully claim second approved escrow
- ✅ Should successfully cancel pending escrow (additional coverage)

### Running Tests
```bash
cd escrow-system
yarn install    # install dependencies
anchor build    # build program
anchor test     # run all 24 tests
```

Expected output: All 24 tests should pass, covering happy paths, error cases, edge cases, and state management.

### Additional Notes for Evaluators

**Design Decisions:**

- **Account Persistence**: Escrow accounts remain alive after claim/cancel operations (with `Claimed` or `Cancelled` state) instead of being closed. This preserves transaction history on-chain for audit purposes and dispute resolution.

- **Four-State Model**: The implementation uses four states (`Pending`, `Approved`, `Claimed`, `Cancelled`) rather than two, providing clear terminal states and preventing operations on completed escrows.

**Trust Assumptions:**

The approval mechanism creates an inherent trust assumption that goes against pure decentralization principles. The recipient must trust that the creator will approve the escrow after work is delivered. This introduces several risks:

- **Approval Risk**: Creator could refuse to approve even after recipient completes the work, effectively holding funds hostage
- **Centralized Control**: The creator has unilateral power to approve or cancel, making this more "creator-controlled" than truly "trustless"
- **No Dispute Resolution**: There's no on-chain mechanism to resolve disagreements - if the creator claims work wasn't done but recipient disagrees, there's no arbitration
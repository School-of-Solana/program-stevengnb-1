use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, PartialEq, Clone, InitSpace)]
pub enum EscrowState {
    Pending,
    Approved,
    Cancelled,
    Claimed
}

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub creator: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub escrow_id: u64,
    pub state: EscrowState,
    pub created_at: i64,
    pub bump: u8
}
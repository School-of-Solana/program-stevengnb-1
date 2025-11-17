use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Escrow must be in Pending state to approve")]
    InvalidStateForApproval,
    #[msg("Escrow must be in Pending state to cancel")]
    InvalidStateForCancellation,
    #[msg("Escrow must be in Approved state to claim")]
    InvalidStateForClaim,
    #[msg("Invalid user to claim escrow")]
    InvalidUserForClaim,
    #[msg("Invalid user to cancel escrow")]
    InvalidUserForCancellation
}
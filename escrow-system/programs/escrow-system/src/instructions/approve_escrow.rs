use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::EscrowError;

pub fn approve_escrow(
    ctx: Context<Approve>
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;

    if escrow.state != EscrowState::Pending {
        return Err(EscrowError::InvalidStateForApproval.into());
    } 

    escrow.state = EscrowState::Approved;

    Ok(())
}

#[derive(Accounts)]
pub struct Approve<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"escrow",
            creator.key().as_ref(),
            escrow.escrow_id.to_le_bytes().as_ref()
        ],
        has_one = creator,
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,
}

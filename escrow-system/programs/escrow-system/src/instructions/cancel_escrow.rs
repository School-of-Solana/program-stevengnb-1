use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::EscrowError;

pub fn cancel_escrow(
    ctx: Context<Cancel>
) -> Result<()> {
    if ctx.accounts.escrow.state != EscrowState::Pending {
        return Err(EscrowError::InvalidStateForCancellation.into());
    };

    let amount = ctx.accounts.escrow.amount;

    // Transfer lamports from escrow PDA back to creator
    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.creator.to_account_info().try_borrow_mut_lamports()? += amount;

    ctx.accounts.escrow.state = EscrowState::Cancelled;

    Ok(())
}

#[derive(Accounts)]
pub struct Cancel<'info> {
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

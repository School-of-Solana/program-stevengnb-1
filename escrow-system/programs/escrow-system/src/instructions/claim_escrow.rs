use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::EscrowError;

pub fn claim_escrow(
    ctx: Context<Claim>
) -> Result<()> {
    if ctx.accounts.escrow.state != EscrowState::Approved {
        return Err(EscrowError::InvalidStateForClaim.into());
    };

    let amount = ctx.accounts.escrow.amount;

    // Transfer lamports from escrow PDA to recipient
    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += amount;

    ctx.accounts.escrow.state = EscrowState::Claimed;

    Ok(())
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub recipient: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"escrow",
            escrow.creator.as_ref(),
            escrow.escrow_id.to_le_bytes().as_ref()
        ],
        bump = escrow.bump,
        has_one = recipient
    )]
    pub escrow: Account<'info, Escrow>,
}


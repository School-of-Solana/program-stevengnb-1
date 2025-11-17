use anchor_lang::prelude::*;
use anchor_lang::system_program;

use crate::states::*;
use crate::errors::EscrowError;

pub fn initialize_escrow(
    ctx: Context<Initialize>,
    amount: u64,
    escrow_id: u64
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    let clock = Clock::get()?;

    if amount == 0 {
        return Err(EscrowError::InvalidAmount.into());
    }

    escrow.creator = ctx.accounts.creator.key();
    escrow.recipient = ctx.accounts.recipient.key();
    escrow.amount = amount;
    escrow.escrow_id = escrow_id;
    escrow.state = EscrowState::Pending;
    escrow.created_at = clock.unix_timestamp;
    escrow.bump = ctx.bumps.escrow;

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.creator.to_account_info(),
                to: ctx.accounts.escrow.to_account_info(),
            }
        ),
        amount
    )?;

    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: u64, escrow_id: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK: This account is only used to store the recipient's public key
    pub recipient: AccountInfo<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [
            b"escrow",
            creator.key().as_ref(),
            escrow_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

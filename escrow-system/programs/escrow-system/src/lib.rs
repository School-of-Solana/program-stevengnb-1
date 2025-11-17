#![allow(unexpected_cfgs)]

use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("FBkdzDicx5cyJoTQ1NrM9BPhFkhwFk4a1WRbvGGNYMqY");

#[program]
pub mod escrow_system {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64, escrow_id: u64) -> Result<()> {
        initialize_escrow(ctx, amount, escrow_id)
    }

    pub fn approve(ctx: Context<Approve>) -> Result<()> {
        approve_escrow(ctx)
    }

    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        cancel_escrow(ctx)
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        claim_escrow(ctx)
    }
}
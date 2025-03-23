#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

declare_id!("4hPt4QcF4ozzPFaT15BRVak27TLdxXQM2rwtaWdJ8oUn");

#[program]
pub mod aeroscan {
    use super::*;

    pub fn create_air_quality_record(
        ctx: Context<CreateAirQualityRecord>,
        timestamp: i64,
        aqi: u8,
        pinata_cid: String,
    ) -> Result<()> {
        let record = &mut ctx.accounts.air_quality_record;
        record.timestamp = timestamp;
        record.aqi = aqi;
        record.pinata_cid = pinata_cid;
        record.owner = ctx.accounts.signer.key();

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(timestamp: i64)]
pub struct CreateAirQualityRecord<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        space = 8 + AirQualityRecord::INIT_SPACE,
        payer = signer,
        seeds = [b"air_quality_record", signer.key().as_ref(), &timestamp.to_le_bytes()],
        bump
    )]
    pub air_quality_record: Account<'info, AirQualityRecord>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct AirQualityRecord {
    // Timestamp of the record
    pub timestamp: i64,

    // Air Quality Index
    pub aqi: u8,

    // Pinata CID
    #[max_len(46)]
    pub pinata_cid: String,

    // Owner of the record (Wallet that created it)
    pub owner: Pubkey,
}

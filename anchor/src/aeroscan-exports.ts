import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import AeroscanIDL from "../target/idl/aeroscan.json";
import type { Aeroscan } from "../target/types/aeroscan";

export { Aeroscan, AeroscanIDL };

export const AEROSCAN_PROGRAM_ID = new PublicKey(AeroscanIDL.address);

export function getAeroscanProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...AeroscanIDL, address: address ? address : AeroscanIDL.address } as Aeroscan, provider);
}

export function getAeroscanProgramID() {
  return new PublicKey(AEROSCAN_PROGRAM_ID);
}
import useAeroscan from "@/hooks/useAeroscan";
import { Program } from "@coral-xyz/anchor";
import { Aeroscan } from "@project/anchor";
import { Transaction } from "@solana/web3.js";
import { BN } from "bn.js";

interface Reading {
  temperature: number;
  humidity: number;
  sensorReading: number;
  timestamp: number;
}

interface TransactionData {
  sensorId: string;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  },
  readings: Reading[]
}

export default async function createTransaction(data: TransactionData, aeroscanProgram: Program<Aeroscan>) {
  const tx = new Transaction();

  for (const reading of data.readings) {
    const createRecordIx = await aeroscanProgram?.methods
      .createAirQualityRecord(new BN(reading.timestamp), reading.sensorReading, "")
      .instruction();
    tx.add(createRecordIx);
  }

  return tx;
}
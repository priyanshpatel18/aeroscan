import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Aeroscan } from "anchor/target/types/aeroscan";
const IDL = require("../../target/idl/aeroscan.json");

const aeroscanAddress = new PublicKey("4hPt4QcF4ozzPFaT15BRVak27TLdxXQM2rwtaWdJ8oUn");

describe("AeroScan Program", () => {
  let context;
  let provider: BankrunProvider;
  let program: anchor.Program<Aeroscan>;

  beforeAll(async () => {
    context = await startAnchor("", [{ name: "aeroscan", programId: aeroscanAddress }], []);
    provider = new BankrunProvider(context);
    program = new anchor.Program<Aeroscan>(IDL, provider);
  });

  it("Creates an air quality record successfully", async () => {
    const timestamp = new anchor.BN(Math.floor(Date.now() / 1000));
    const aqi = 42;
    const pinataCid = "QmTestCID123";

    await program.methods.createAirQualityRecord(timestamp, aqi, pinataCid).rpc();

    const [recordAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("air_quality_record"),
        provider.wallet.publicKey.toBuffer(),
        timestamp.toArrayLike(Buffer, "le", 8),
      ],
      aeroscanAddress
    );

    const record = await program.account.airQualityRecord.fetch(recordAddress);

    expect(record.aqi).toEqual(aqi);
    expect(record.pinataCid).toEqual(pinataCid);
    expect(record.owner.toString()).toEqual(provider.wallet.publicKey.toString());
  });

  it("Fails if a duplicate air quality record is created at the same timestamp", async () => {
    const timestamp = new anchor.BN(Math.floor(Date.now() / 1000));
    const aqi = 50;
    const pinataCid = "QmAnotherCID456";

    await program.methods.createAirQualityRecord(timestamp, aqi, pinataCid).rpc();

    try {
      await program.methods.createAirQualityRecord(timestamp, 55, "QmShouldFail").rpc();
      throw new Error("Should have failed");
    } catch (err) {
      if (err instanceof Error) expect(err.message).toContain("already in use");
    }
  });
});

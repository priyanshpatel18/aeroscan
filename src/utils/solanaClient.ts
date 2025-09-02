import * as anchor from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
const bs58 = require("bs58").default;

const PROGRAM_ID = new PublicKey("aero8wSmn3uAj5g5jYq92Rd2SQv2MtGxu1ZXfysfFHX");

const RPC_URL = process.env.HELIUS_RPC_URL ?? "https://api.devnet.solana.com";

// Two separate connections
// 1) Standard Solana RPC (for IDL + account fetching)
const solanaConnection = new Connection(RPC_URL, "confirmed");

// 2) Magicblock RPC (for sending txs)
const magicblockConnection = new Connection("https://devnet.magicblock.app/", {
  wsEndpoint: "wss://devnet.magicblock.app/",
});

// Service wallet
const secretKey = bs58.decode(process.env.PRIVATE_KEY || "");
const serviceKeypair = Keypair.fromSecretKey(secretKey);

// Providers
const solanaProvider = new anchor.AnchorProvider(
  solanaConnection,
  new NodeWallet(serviceKeypair),
  { preflightCommitment: "processed" }
);

const magicblockProvider = new anchor.AnchorProvider(
  magicblockConnection,
  new NodeWallet(serviceKeypair),
  { preflightCommitment: "processed" }
);

// Cached Program client
let program: anchor.Program | null = null;

const [SENSOR_READING_PDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("sensor_reading"), solanaProvider.wallet.publicKey.toBuffer()],
  PROGRAM_ID
);

async function getProgramClient(): Promise<anchor.Program> {
  if (!program) {
    const idl = await anchor.Program.fetchIdl(PROGRAM_ID, solanaProvider);
    if (!idl) throw new Error("IDL not found for program");

    program = new anchor.Program(idl, solanaProvider);
    console.log("aeroscan client initialized!!");
  }
  return program;
}

export async function updateReading(
  pm25: number,
  pm10: number,
  temperature: number,
  humidity: number,
  aqi: number
): Promise<string> {
  const program = await getProgramClient();

  const tx = await program.methods
    .updateReading(solanaProvider.wallet.publicKey, pm25, pm10, temperature, humidity, aqi)
    .accounts({
      sensorReading: SENSOR_READING_PDA,
    })
    .transaction();

  const {
    value: { blockhash, lastValidBlockHeight },
  } = await solanaConnection.getLatestBlockhashAndContext();

  tx.recentBlockhash = blockhash;
  tx.feePayer = solanaProvider.wallet.publicKey;

  tx.sign((solanaProvider.wallet as anchor.Wallet).payer);

  const signature = await solanaConnection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
  });

  await solanaConnection.confirmTransaction(
    { blockhash, lastValidBlockHeight, signature },
    "processed"
  );
  return signature;
}
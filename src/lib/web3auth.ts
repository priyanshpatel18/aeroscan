import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

// Get this from .env file
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3",
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
  logo: "https://images.toruswallet.io/solana.svg"
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

export { decodeToken };
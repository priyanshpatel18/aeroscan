"use client";

import { useAeroscan } from "@/hooks/useAeroscan";
import createTransaction from "@/lib/createTransaction";
import { decodeToken, web3auth } from "@/lib/web3auth";
import { TransactionData, web3SessionExpiredError } from "@/types";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export function useWeb3Integration(idToken: string | undefined) {
  const { aeroscanProgram } = useAeroscan();
  const connection = new Connection("https://api.devnet.solana.com");
  const [isWeb3AuthReady, setIsWeb3AuthReady] = useState(false);
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);

  useEffect(() => {
    async function initializeWeb3Auth() {
      try {
        // Ensure Web3Auth is initialized
        if (web3auth.status !== "ready") {
          await web3auth.init();

          if (web3auth.provider) {
            const wallet = new SolanaWallet(web3auth.provider);
            setSolanaWallet(wallet);

            console.log(await getPublicKey());
          }
        }

        if (idToken) {
          const { payload } = decodeToken(idToken);

          const provider = await web3auth.connect({
            verifier: "aeroscan-identifier",
            verifierId: (payload as any).email,
            idToken,
          });

          web3auth.provider = provider;

          if (web3auth.provider) {
            const wallet = new SolanaWallet(web3auth.provider);
            console.log("Solana Wallet:", wallet);
            setSolanaWallet(wallet);
          }

          console.log(await getPublicKey());

          setIsWeb3AuthReady(true);
        }
      } catch (error) {
        if (error instanceof Error && idToken) {
          if (error.message.includes(web3SessionExpiredError)) {
            signIn("google");
          }
        }
        setIsWeb3AuthReady(false);
      }
    }

    initializeWeb3Auth();
  }, [idToken]);

  const getPublicKey = async () => {
    let wallet: SolanaWallet;

    if (!solanaWallet) {
      if (web3auth.provider) {
        wallet = new SolanaWallet(web3auth.provider);
        setSolanaWallet(wallet);

        const accounts = await wallet.requestAccounts();
        console.log(accounts);

        if (!accounts || accounts.length === 0) {

        }

        console.log("Public Key:", accounts[0]);
        return new PublicKey(accounts[0]);
      }
    } else {
      wallet = solanaWallet;
    }
  };

  const signTransaction = async (transaction: Transaction) => {
    if (!solanaWallet) {
      throw new Error("Solana wallet not initialized");
    }

    try {
      // Ensure transaction has required fields
      const pubKey = await getPublicKey();
      const { blockhash } = await connection.getLatestBlockhash();

      transaction.feePayer = pubKey;
      transaction.recentBlockhash = blockhash;

      // Sign transaction
      const signedTransaction = await solanaWallet.signTransaction(transaction);

      if (!signedTransaction) {
        throw new Error("Transaction signing failed");
      }

      console.log("Signed Transaction:", signedTransaction);
      return signedTransaction;
    } catch (error) {
      console.error("Transaction Signing Error:", error);

      // Attempt to reinitialize wallet
      try {
        if (!idToken) {
          throw new Error("ID token not found");
        }

        const { payload } = decodeToken(idToken);

        await web3auth.logout();
        await web3auth.connect({
          verifier: "aeroscan-identifier",
          verifierId: (payload as any).email,
          idToken,
        });

        if (web3auth.provider) {
          const newWallet = new SolanaWallet(web3auth.provider);
          setSolanaWallet(newWallet);
        }
      } catch (reconnectError) {
        console.error("Wallet Reconnection Failed:", reconnectError);
      }

      throw error;
    }
  };

  const createAndSignTransaction = useCallback(async (data: TransactionData) => {
    try {
      console.log(data);
      const transaction = await createTransaction(data, aeroscanProgram);

      // Validate transaction before signing
      if (!transaction.instructions || transaction.instructions.length === 0) {
        throw new Error("Invalid transaction: No instructions");
      }

      console.log("Transaction created:", transaction);
      return await signTransaction(transaction);
    } catch (error) {
      console.error("Transaction Creation/Signing Error:", error);
      throw error;
    }
  }, [aeroscanProgram, signTransaction]);

  return {
    createAndSignTransaction,
    signTransaction,
    isWeb3AuthReady
  };
}
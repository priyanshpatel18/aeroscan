"use client";

import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { AnchorWallet, ConnectionProvider, useConnection, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkPermission() {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

      if (permissionStatus.state === "granted") {
        setLocationGranted(true);
      } else if (permissionStatus.state === "denied") {
        setLocationGranted(false);
      } else {
        navigator.geolocation.getCurrentPosition(
          () => setLocationGranted(true),
          () => setLocationGranted(false)
        );
      }
    }

    checkPermission();
  }, []);

  if (locationGranted === null) {
    return <p className="text-center mt-10">Requesting location access...</p>;
  }

  if (!locationGranted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-lg font-semibold text-red-600">
          Location Permission Denied
        </p>
        <p className="text-sm text-gray-600">
          Please allow location access in your browser settings.
        </p>
      </div>
    );
  }

  return (
    <ReactQueryProvider>
      <SolanaProvider>
        <SessionProvider>
          {children}
        </SessionProvider>
      </SolanaProvider>
    </ReactQueryProvider>
  );
}

function SolanaProvider({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}


export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}
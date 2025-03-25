"use client";

import UserInfo from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decodeToken, web3auth } from "@/lib/web3auth";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SensorForm({ session }: { session: Session | null }) {
  const [verifyInput, setVerifyInput] = useState("");
  const [provider, setProvider] = useState<any>(null);
  const [publicAddress, setPublicAddress] = useState<string>("NONE");
  const [loading, setLoading] = useState<boolean>(false);

  const [sensorId, setSensorId] = useState<string>("");
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    if (session) {
      const init = async () => {
        try {
          if (web3auth.status === "not_ready") {
            await web3auth.init();
          }
          if (web3auth.status === "connected") {
            const provider = web3auth.provider;

            if (provider) {
              const solanaWallet = new SolanaWallet(provider);
              const accounts = await solanaWallet.requestAccounts();
              if (accounts && accounts.length > 0)
                setPublicAddress(accounts[0]);
              setProvider(provider);
            }
          }
        } catch (error) {
          console.error("Error initializing & connecting to web3auth:", error);
          setProvider(null);
          setPublicAddress("");
        }
      };
      init();
    }
  }, [session]);

  // Verify Sensor ID
  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!verifyInput) {
      toast.error("Please enter a value to verify Sensor ID.");
      return;
    }
    if (!session) {
      toast.error("Please sign in to verify Sensor ID.");
      return;
    }

    try {
      setLoading(true);
      console.log();

      const res = await fetch("/api/sensor/verify-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: verifyInput, email: session.user?.email }),
      });

      const { isValid, message } = await res.json();
      if (message === "EMAIL_NOT_VERIFIED") {
        toast.error("Sensor does not belong to your account.");
        return;
      }

      if (isValid) {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }
        if (web3auth.status === "connected") {
          const provider = web3auth.provider;

          if (provider) {
            const solanaWallet = new SolanaWallet(provider);
            const accounts = await solanaWallet.requestAccounts();
            setPublicAddress(accounts[0]);
            setProvider(provider);
            toast.success("Sensor is already verified.");
          }
        } else {
          const idToken = session.idToken as string;
          if (!idToken) {
            toast.error("Invalid session token.");
            return;
          }
          const { payload } = decodeToken(idToken);
          const provider = await web3auth.connect({
            verifier: "aeroscan-identifier",
            verifierId: (payload as any).email,
            idToken,
          });
          if (!provider) {
            toast.error("Failed to connect to web3auth.");
            return;
          }
          setProvider(provider);
          const solanaWallet = new SolanaWallet(provider);
          const accounts = await solanaWallet.requestAccounts();

          setPublicAddress(accounts[0]);
          setProvider(provider);
          toast.success("Sensor ID verified successfully.");
        }
      } else {
        toast.error("Sensor ID is invalid.");
      }
    } catch (error) {
      console.error("Error verifying Sensor ID:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <UserInfo session={session} />

      <Button
        className="mt-4 w-40 cursor-pointer"
        onClick={() => {
          if (!session) signIn("google");
          else signOut();
        }}
        disabled={loading}
      >
        {session ? "Sign Out" : "Sign In"}
      </Button>

      <form onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch("/api/sensor/create-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sensorId }),
        })

        const { hash } = await res.json();
        console.log(hash);

        setHash(hash);
      }} className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Generate Sensor Hash</h2>
        <Input
          type="text"
          value={sensorId}
          onChange={(e) => setSensorId(e.target.value)}
          placeholder="Enter value to generate"
          className="mb-3"
        />
        <Button className="w-full" disabled={loading}>Generate</Button>
        {hash && (
          <div className="mt-4 w-full">
            <h3 className="text-lg font-semibold"
            >
              Generated Hash
            </h3>
            <p
              className="truncate cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(hash);
                toast.success("Copied to clipboard");
              }}>
              {hash}
            </p>
          </div>
        )}
      </form>

      <form onSubmit={handleVerify} className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Verify Sensor ID</h2>
        <Input
          type="text"
          value={verifyInput}
          onChange={(e) => setVerifyInput(e.target.value)}
          placeholder="Enter value to verify"
          className="mb-3"
        />
        <Button className="w-full" disabled={loading}>Verify</Button>
      </form>

      <div>
        Public Address: {publicAddress}
      </div>
    </div >
  );
}

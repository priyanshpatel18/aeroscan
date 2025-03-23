"use client";

import SignOut from "@/components/auth/signout-button";
import Loading from "@/components/loading";
import { web3auth } from "@/lib/web3auth";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";

type UserInfoProps = {
  session: Session | null;
};

export default function UserInfo({ session }: UserInfoProps) {
  const [provider, setProvider] = useState<any>(null);
  const [publicAddress, setPublicAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }

        if (web3auth.status === "connected") {
          const provider = web3auth.provider; // Solana
          setProvider(provider);

          const accounts = await await provider?.request({
            method: "solana_requestAccounts",
          });

          if (accounts && (accounts as any).length > 0) {
            setPublicAddress((accounts as any)[0]);
          }
        } else if (session?.idToken) {
          // const { payload } = decodeToken(session.idToken);
          // const provider = await web3auth.connect({
          //   verifier: "aeroscan-identifier",
          //   verifierId: (payload as any).email,
          //   idToken: session.idToken,
          // });
          // setProvider(provider);
        }
      } catch (error) {
        console.error("Error initializing & connecting to web3auth:", error);
        setProvider(null);
        setPublicAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      init();
    }
  }, [session, provider]);

  if (!session) return null;

  return (
    <div className="bg-white dark:bg-zinc-800/30 shadow-lg rounded-lg p-8 max-w-md w-full mx-auto mt-10">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : (
        publicAddress && (
          <div className="flex flex-col items-center space-y-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile picture"
                width={140}
                height={140}
                className="rounded-full border-4 border-blue-500"
                priority
              />
            )}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {session.user?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center">{session.user?.email}</p>
            <p className="text-gray-600 dark:text-gray-300 text-center">{publicAddress}</p>
            <SignOut />
          </div>
        )
      )}
    </div>
  );
}
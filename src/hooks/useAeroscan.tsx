import { useAnchorProvider } from "@/components/Providers";
import { useStore } from "@/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAeroscanProgram, getAeroscanProgramID } from "anchor/src/aeroscan-exports";
import { BN } from "bn.js";
import { useMemo } from "react";
import { toast } from "sonner";

export interface Poll {
  pollId: number;
  pollQuestion: string;
  pollStart: number;
  pollEnd: number;
  pollCandidates: { candidateId: number; name: string }[];
  pollVotes: number;
  authority: PublicKey;
}

export interface Candidate {
  candidateId: number;
  name: string;
  votes?: number;
}

export default function useAeroscan() {
  const provider = useAnchorProvider();
  const aeroscanProgramId = useMemo(() => getAeroscanProgramID(), [])
  const aeroscanProgram = useMemo(() => getAeroscanProgram(provider), [provider])
  const { setLoading } = useStore();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();


  const airQualityRecords = useQuery({
    queryKey: ["airQualityRecords"],
    queryFn: async () => {
      setLoading(true);
      if (!aeroscanProgram) return [];
      return await aeroscanProgram.account.airQualityRecord.all();
    },
    enabled: !!aeroscanProgram,
  });

  const createAirQualityRecord = useMutation({
    mutationFn: async ({ timestamp, aqi, pinataCid }: { timestamp: number; aqi: number; pinataCid: string }) => {
      if (!aeroscanProgram || !publicKey) throw new Error("Wallet not connected");
      setLoading(true);

      const tx = await aeroscanProgram.methods
        .createAirQualityRecord(new BN(timestamp), aqi, pinataCid)
        .rpc();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airQualityRecords"] });
      setLoading(false);
    },
    onError: (error) => {
      toast.error(`Transaction failed: ${error.message}`);
      setLoading(false);
    },
  });

  const createBatchAirQualityRecord = useMutation({
    mutationFn: async ({ timestamp, aqi, pinataCid }: { timestamp: number; aqi: number; pinataCid: string }) => {
      if (!aeroscanProgram || !publicKey) throw new Error("Wallet not connected");
      setLoading(true);

      const tx = await aeroscanProgram.methods
        .createAirQualityRecord(new BN(timestamp), aqi, pinataCid)
        .rpc();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airQualityRecords"] });
      setLoading(false);
    },
    onError: (error) => {
      toast.error(`Transaction failed: ${error.message}`);
      setLoading(false);
    },
  });

  return {
    aeroscanProgram,
    airQualityRecords,
    createAirQualityRecord,
    aeroscanProgramId
  }
}
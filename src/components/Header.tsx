import { decodeToken, web3auth } from "@/lib/web3auth";
import { SolanaWallet } from "@web3auth/solana-provider";
import { motion } from "framer-motion";
import { CloudIcon, MapPinIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface HeaderProps {
  city?: string;
  isConnected: boolean;
  fetchedSensorId: string | null;
}

export default function Header({ city, isConnected, fetchedSensorId }: HeaderProps) {
  const [sensorId, setSensorId] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const [timer, setTimer] = useState<number | null>(null);
  const [publicAddress, setPublicAddress] = useState<string>("NONE");
  const [provider, setProvider] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedSensorId = localStorage.getItem("sensorId");
    if (storedSensorId) {
      setSensorId(storedSensorId);
    }
  }, []);

  async function handleSensorDeploy(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sensorId.trim()) return toast.error("Please enter a sensor ID.");

    try {
      setLoading(true);
      const email = session.data?.user?.email;
      if (!email) return toast.error("Please sign in to verify Sensor ID.");

      const res = await fetch("/api/sensor/verify-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: sensorId, email }),
      });

      const { isValid, message } = await res.json();
      if (message === "EMAIL_NOT_VERIFIED") {
        toast.error("Sensor does not belong to your account.");
        return;
      }

      let address: string | null = null;
      if (isValid) {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }
        if (web3auth.status === "connected") {
          const provider = web3auth.provider;

          if (provider) {
            const solanaWallet = new SolanaWallet(provider);
            const accounts = await solanaWallet.requestAccounts();

            if (accounts && accounts.length > 0)
              address = accounts[0];
            setProvider(provider);
            toast.success("Sensor is already verified.");
            setIsDialogOpen(false);
          }
        } else {
          const idToken = session.data?.idToken as string;
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

          if (accounts && accounts.length > 0)
            address = accounts[0];
          setProvider(provider);
          toast.success("Sensor ID verified successfully.");
          setIsDialogOpen(false);
        }

        if (address) {
          setPublicAddress(address);
          localStorage.setItem("sensorId", sensorId);
        } else {
          setTimer(3);
          toast.success(`Verify yourself again. Redirecting in 3 seconds...`);
        }
      } else {
        toast.error("Invalid sensor ID.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Effect to handle countdown
  useEffect(() => {
    if (timer === null) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(interval);
    } else {
    }
    signIn("google");
  }, [timer]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <header className="border-b bg-gradient-to-r from-background/90 to-background/95 sticky top-0 z-10 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <CloudIcon className="h-8 w-8 text-primary mr-2" />
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                aeroscan
              </h1>
            </div>
            {city && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 cursor-pointer"
              >
                <MapPinIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{city}</span>
              </motion.div>
            )}
          </motion.div>

          <div className="flex items-center gap-4">
            {!fetchedSensorId && (
              <Button className="cursor-pointer" asChild>
                <DialogTrigger>
                  Deploy Sensor
                </DialogTrigger>
              </Button>
            )}

            <Button className="cursor-pointer" onClick={() => {
              if (session.data?.user) {
                signOut();
              } else {
                signIn("google")
              }
            }}>
              {session.data?.user ? "Sign Out" : "Sign In"}
            </Button>

            <Badge
              variant={isConnected ? "default" : "destructive"}
              className={`hidden sm:flex animate-pulse ${isConnected && "bg-green-600"}`}
            >
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </div>
        </div>
      </header>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deploy Your Sensor</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSensorDeploy}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sensorID">Sensor ID</Label>
            <Input
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              type="text"
              placeholder="Enter Sensor ID"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useAirQualityData } from "@/hooks/useAirQualityData";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function Home({ session }: Props) {
  const { city } = useGeolocation();
  const {
    sensorData,
    latestReading,
    stats,
    isLoading,
    isConnected,
    sensorId
  } = useAirQualityData(session);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 to-background">
      <Header
        city={city}
        isConnected={isConnected}
        fetchedSensorId={sensorId}
      />

      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <LoadingIndicator message="Connecting to sensor data stream..." />
        ) : (
          <Dashboard
            sensorData={sensorData}
            latestReading={latestReading}
            stats={stats}
            sensorId={sensorId}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useSocket } from "@/hooks/useSocket";
import { SensorData, SensorStats } from "@/types";
import { CREATE_TRANSACTION, INITIAL_DATA, SENSOR_DATA, USER_AUTH } from "@/types/message";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useWeb3Integration } from "./useWeb3Integration";

export function useAirQualityData(session: Session | null) {
  const { socket, isConnected } = useSocket();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestReading, setLatestReading] = useState<SensorData | null>(null);
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [sensorId, setSensorId] = useState<string | null>(null);
  const { createAndSignTransaction } = useWeb3Integration(session?.idToken);

  // Fetch and verify sensor ID
  useEffect(() => {
    async function getSensorId() {
      const storedSensorId = localStorage.getItem("sensorId");
      const email = session?.user?.email;

      if (email && storedSensorId) {
        try {
          const res = await fetch("/api/sensor/verify-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: storedSensorId, email }),
          });

          const { isValid, sensor } = await res.json();
          if (isValid) {
            setSensorId(sensor.sensorId);
          }
        } catch (error) {
          console.error("Failed to verify sensor ID:", error);
        }
      }
    }

    getSensorId();
  }, [session]);

  // Handle WebSocket connection and messages
  useEffect(() => {
    if (!socket) return;

    if (isConnected) {
      // Add slight delay for UI purposes
      setTimeout(() => setIsLoading(false), 1000);

      // Authenticate user
      if (session?.user?.email) {
        socket.send(JSON.stringify({
          type: USER_AUTH,
          userId: session.user.id,
          email: session.user.email
        }));
      }
    }

    const handleMessage = async (message: MessageEvent) => {
      try {
        const messageData = JSON.parse(message.data);

        switch (messageData.type) {
          case INITIAL_DATA:
            const initialData: SensorData[] = messageData.data;
            const stats: SensorStats = messageData.stats;
            setStats(stats);

            setSensorData(initialData);
            if (initialData.length > 0) {
              setLatestReading(initialData[initialData.length - 1]);
            }
            break;

          case SENSOR_DATA:
            const newSensorData: SensorData = messageData.data;
            console.log("New sensor data:", newSensorData);

            if (messageData.stats) {
              setStats(messageData.stats);
            }

            setSensorData((prevData) => [...prevData, newSensorData]);
            setLatestReading(newSensorData);
            setIsLoading(false);
            break;

          case CREATE_TRANSACTION:
            console.log("Transaction data:", messageData.data);

            await createAndSignTransaction(messageData.data);
            break;
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, isConnected, session, createAndSignTransaction]);

  return {
    sensorData,
    latestReading,
    stats,
    isLoading,
    isConnected,
    sensorId
  };
}

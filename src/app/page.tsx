"use client";

import Header from "@/components/Header";
import { RecentReadings } from "@/components/RecentReadings";
import { SensorDataChart } from "@/components/SensorDataChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAeroscan from "@/hooks/useAeroscan";
import { useSocket } from "@/hooks/useSocket";
import createTransaction from "@/lib/createTransaction";
import { SensorData, SensorStats } from "@/types";
import { CREATE_TRANSACTION, INITIAL_DATA, SENSOR_DATA, USER_AUTH } from "@/types/message";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3Icon,
  BellIcon,
  CloudIcon,
  InfoIcon
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { socket, isConnected } = useSocket();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestReading, setLatestReading] = useState<SensorData | null>(null);
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [sensorId, setSensorId] = useState<string | null>(null);
  const session = useSession();
  const { aeroscanProgram } = useAeroscan();

  async function getSensorId() {
    const storedSensorId = localStorage.getItem("sensorId");

    const email = session.data?.user?.email;
    if (email && storedSensorId) {
      const res = await fetch("/api/sensor/verify-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: storedSensorId, email: session.data?.user?.email }),
      });

      const { isValid, sensor } = await res.json();
      if (isValid) {
        setSensorId(sensor.sensorId);
      }
    }
  }

  useEffect(() => {
    getSensorId();
  }, [session]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch("/api/get-city", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: latitude, lon: longitude }),
        });

        const data = await res.json();
        if (data.city) setCity(data.city);
      } catch (error) {
        console.error("Failed to fetch city:", error);
      }
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    if (isConnected) {
      setTimeout(() => setIsLoading(false), 1000);

      // Send authentication data when connected
      if (session.data?.user?.email) {
        socket.send(JSON.stringify({
          type: USER_AUTH,
          userId: session.data.user.id,
          email: session.data.user.email
        }));
      }
    }

    const handleMessage = (message: MessageEvent) => {
      try {
        const messageData = JSON.parse(message.data);

        if (messageData.type === INITIAL_DATA) {
          const initialData: SensorData[] = messageData.data;
          const stats: SensorStats = messageData.stats;
          setStats(stats);

          setSensorData(initialData);
          if (initialData.length > 0) {
            setLatestReading(initialData[initialData.length - 1]);
          }
        }

        if (messageData.type === SENSOR_DATA) {
          const newSensorData: SensorData = messageData.data;
          if (messageData.stats) {
            setStats(messageData.stats);
          }

          setSensorData((prevData) => [...prevData, newSensorData]);
          setLatestReading(newSensorData);
          setIsLoading(false);
        }

        if (messageData.type === CREATE_TRANSACTION) {
          const transaction = createTransaction(messageData.data, aeroscanProgram);


        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, isConnected, session.data]);

  // Determine alert status based on latest reading
  const getAlertStatus = () => {
    if (!latestReading) return "normal";
    if (latestReading.sensorReading > 100) return "high";
    if (latestReading.sensorReading > 75) return "medium";
    return "normal";
  };

  const alertStatus = getAlertStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 to-background">
      <Header city={city} isConnected={isConnected} fetchedSensorId={sensorId} />

      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <CloudIcon className="w-12 h-12 text-primary" />
            </motion.div>
            <p className="mt-4 text-muted-foreground">Connecting to sensor data stream...</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-2 flex gap-2 items-baseline">
                <span>Air Quality Dashboard</span>
                <span
                  className="text-muted-foreground text-lg  bg-primary/10 px-1 rounded border border-primary/20 cursor-pointer"
                >
                  {sensorId}
                </span>
              </h2>
              <p className="text-muted-foreground">
                Real-time air quality data from sensors
                {sensorData.length > 0 && (
                  <span className="ml-2 text-sm">
                    ({sensorData.length} readings collected)
                  </span>
                )}
              </p>
            </motion.div>

            {/* Sensor data summary cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              {latestReading ? (
                [
                  {
                    label: "Temperature",
                    value: `${latestReading.temperature.toFixed(1)}°C`,
                    icon: <BarChart3Icon className="w-4 h-4" />
                  },
                  {
                    label: "Humidity",
                    value: `${latestReading.humidity.toFixed(1)}%`,
                    icon: <CloudIcon className="w-4 h-4" />
                  },
                  {
                    label: "Air Quality",
                    value: `${latestReading.sensorReading.toFixed(1)}`,
                    icon: <InfoIcon className="w-4 h-4" />
                  }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              {stat.icon}
                              {stat.label}
                            </p>
                            <AnimatePresence mode="wait">
                              <motion.p
                                key={stat.value}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl font-bold"
                              >
                                {stat.value}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                          <div className={`rounded-full w-3 h-3 ${i === 2 && latestReading.sensorReading > 100 ? "bg-destructive" :
                            i === 2 && latestReading.sensorReading > 75 ? "bg-orange-400" : "bg-emerald-500"
                            }`}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="col-span-3">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Waiting for first sensor reading...</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sensor Readings</CardTitle>
                      <CardDescription>Real-time air quality timeline</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                      {sensorData.length > 30 ? (
                        <SensorDataChart data={sensorData} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Awaiting sufficient data for chart...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Statistics</CardTitle>
                      <CardDescription>Breakdown of sensor metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {stats ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { label: "Min Temp", value: `${stats.minTemp?.toFixed(1)}°C` },
                            { label: "Max Temp", value: `${stats.maxTemp?.toFixed(1)}°C` },
                            { label: "Avg Temp", value: `${stats.avgTemp?.toFixed(1)}°C` },
                            { label: "Min Humidity", value: `${stats.minHumidity?.toFixed(1)}%` },
                            { label: "Max Humidity", value: `${stats.maxHumidity?.toFixed(1)}%` },
                            { label: "Data Points", value: stats.dataPoints.toString() }
                          ].map((stat, i) => (
                            <div key={i} className="bg-muted/50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <span>{stat.label}</span>
                              </div>
                              <div className="text-lg font-semibold">{stat.value}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-muted-foreground">Collecting data for statistics...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Alerts</CardTitle>
                      <CardDescription>Warning systems for abnormal readings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {!latestReading ? (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground">Awaiting sensor data...</p>
                          </div>
                        ) : alertStatus === "high" ? (
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                            className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <BellIcon className="w-5 h-5 text-destructive mt-0.5" />
                              <div>
                                <h4 className="font-medium text-destructive mb-1">High Reading Alert</h4>
                                <p className="text-sm text-destructive/80">
                                  Sensor reading of {latestReading.sensorReading.toFixed(1)} exceeds safe levels.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ) : alertStatus === "medium" ? (
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                            className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <BellIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-orange-500 mb-1">Elevated Reading Alert</h4>
                                <p className="text-sm text-orange-500/80">
                                  Sensor reading of {latestReading.sensorReading.toFixed(1)} is approaching concerning levels.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                            className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-3">
                              <InfoIcon className="w-5 h-5 text-emerald-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-emerald-500 mb-1">All Systems Normal</h4>
                                <p className="text-sm text-emerald-500/80">
                                  Current reading of {latestReading.sensorReading.toFixed(1)} is within normal range.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Readings</CardTitle>
                      <CardDescription>Latest data from sensors</CardDescription>
                    </div>
                    {latestReading && (
                      <Badge variant="outline">
                        Last update: {new Date(latestReading.timestamp).toLocaleTimeString()}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <RecentReadings data={sensorData} />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Readings
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </>
        )}
      </main>

      <footer className="border-t mt-12 py-6 px-4 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CloudIcon className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium">aeroscan</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Real-time air quality monitoring dashboard
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
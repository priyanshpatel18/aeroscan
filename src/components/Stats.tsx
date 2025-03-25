import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SensorDataChart } from "./SensorDataChart";
import { motion } from "framer-motion";
import { SensorData, SensorStats } from "@/types";
import { BellIcon, InfoIcon } from "lucide-react";

interface IProps {
  sensorData: SensorData[];
  stats: SensorStats | null;
  latestReading: SensorData | null;
}

export default function Stats({ sensorData, stats, latestReading }: IProps) {
  const getAlertStatus = () => {
    if (!latestReading) return "normal";
    if (latestReading.sensorReading > 100) return "high";
    if (latestReading.sensorReading > 75) return "medium";
    return "normal";
  };

  const alertStatus = getAlertStatus();

  return (
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

  )
}

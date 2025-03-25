"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { SensorData } from "@/types";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Clock, Droplets, Thermometer, Waves } from "lucide-react";

interface RecentReadingsProps {
  latestReading: SensorData | null;
  data: SensorData[];
}

export function RecentReadings({ latestReading, data }: RecentReadingsProps) {
  // Filter to last 5 readings
  const recentReadings = data.slice(-5).reverse();
  
  // Calculate trends for latest reading
  const calculateTrend = (current: number, previous: number) => {
    const diff = current - previous;
    return {
      value: diff.toFixed(1),
      direction: diff >= 0 ? "up" : "down"
    };
  };
  
  const getTrends = () => {
    if (recentReadings.length < 2) return null;
    
    const current = recentReadings[0];
    const previous = recentReadings[1];
    
    return {
      temperature: calculateTrend(current.temperature, previous.temperature),
      humidity: calculateTrend(current.humidity, previous.humidity),
      sensorReading: calculateTrend(current.sensorReading, previous.sensorReading)
    };
  };
  
  const trends = getTrends();
  
  // Format time since last reading
  const getTimeSince = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
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
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock size={14} />
                Last update: {getTimeSince(latestReading.timestamp)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {latestReading ? (
            <div className="space-y-6">
              {/* Current readings */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Thermometer size={16} />
                    <span>Temperature</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold">{latestReading.temperature.toFixed(1)}°C</span>
                    {trends && (
                      <div className={`flex items-center text-sm ${trends.temperature.direction === "up" ? "text-red-500" : "text-blue-500"}`}>
                        {trends.temperature.direction === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span>{trends.temperature.value}°</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Droplets size={16} />
                    <span>Humidity</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold">{latestReading.humidity.toFixed(1)}%</span>
                    {trends && (
                      <div className={`flex items-center text-sm ${trends.humidity.direction === "up" ? "text-blue-500" : "text-amber-500"}`}>
                        {trends.humidity.direction === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span>{trends.humidity.value}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Waves size={16} />
                    <span>Reading</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold">{latestReading.sensorReading.toFixed(1)}</span>
                    {trends && (
                      <div className={`flex items-center text-sm ${trends.sensorReading.direction === "up" ? "text-green-500" : "text-red-500"}`}>
                        {trends.sensorReading.direction === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span>{trends.sensorReading.value}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Previous readings */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="py-2 px-4 text-left font-medium">Time</th>
                      <th className="py-2 px-4 text-right font-medium">Temp</th>
                      <th className="py-2 px-4 text-right font-medium">Humidity</th>
                      <th className="py-2 px-4 text-right font-medium">Reading</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentReadings.slice(1).map((reading, index) => (
                      <tr key={reading.timestamp} className="hover:bg-slate-50">
                        <td className="py-2 px-4 text-left">{new Date(reading.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="py-2 px-4 text-right">{reading.temperature.toFixed(1)}°C</td>
                        <td className="py-2 px-4 text-right">{reading.humidity.toFixed(1)}%</td>
                        <td className="py-2 px-4 text-right">{reading.sensorReading.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Sensor info */}
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                <div>Sensor ID: {latestReading.sensorId}</div>
                <div className="flex items-center gap-1">
                  <span>Location:</span>
                  <span>{latestReading.location.lat.toFixed(4)}, {latestReading.location.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500">
              No sensor readings available
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            View All Readings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
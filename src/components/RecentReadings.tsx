"use client";

import React from "react";
import { SensorData } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3Icon, CloudIcon, InfoIcon } from "lucide-react";

interface RecentReadingsProps {
  data: SensorData[];
}

export function RecentReadings({ data }: RecentReadingsProps) {
  // Show only the most recent 5 readings, in reverse chronological order
  const recentData = [...data]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  // Helper function to determine status badge based on sensor reading
  const getStatusBadge = (reading: number) => {
    if (reading > 100) {
      return <Badge variant="destructive">High</Badge>;
    } else if (reading > 75) {
      return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Elevated</Badge>;
    } else {
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Normal</Badge>;
    }
  };

  // Format timestamp to a readable time string
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (recentData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No readings available yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Time</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <BarChart3Icon className="w-4 h-4" />
                <span>Temperature</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <CloudIcon className="w-4 h-4" />
                <span>Humidity</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <InfoIcon className="w-4 h-4" />
                <span>Air Quality</span>
              </div>
            </TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentData.map((reading) => (
            <TableRow key={reading.timestamp}>
              <TableCell className="font-mono text-sm">
                {formatTime(reading.timestamp)}
              </TableCell>
              <TableCell>
                {reading.temperature.toFixed(1)}°C
              </TableCell>
              <TableCell>
                {reading.humidity.toFixed(1)}%
              </TableCell>
              <TableCell>
                {reading.sensorReading.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                {getStatusBadge(reading.sensorReading)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
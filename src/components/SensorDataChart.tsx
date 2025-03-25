"use client";
import { SensorData } from "@/types";
import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function SensorDataChart({ data }: { data: SensorData[] }) {
  const formattedData = useMemo(() => {
    return [...data]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item) => ({
        ...item,
        time: new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: "#333" }}
          tickMargin={5}
          padding={{ left: 5, right: 5 }}
        />
        <YAxis tick={{ fontSize: 10, fill: "#333" }} width={40} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderColor: "#ddd",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "8px 12px",
            color: "#333",
          }}
          labelStyle={{ color: "#000", fontWeight: "600", marginBottom: "4px" }}
          formatter={(value: number, name: string) => {
            if (name === "Temperature (°C)") return [`${value.toFixed(1)}°C`, name];
            if (name === "Humidity (%)") return [`${value.toFixed(1)}%`, name];
            if (name === "Sensor Value") return [`Value: ${value}`, name];
            return [value.toFixed(1), name];
          }}
          labelFormatter={(label) => `Time: ${label}`}
          animationDuration={300}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px", color: "#333" }} />

        <Area
          type="monotone"
          dataKey="sensorValue"
          stroke="#ff1493"
          fill="rgba(255, 20, 147, 0.4)"
          strokeWidth={2}
          name="Sensor Value"
        />
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="#ff4500"
          fill="rgba(255, 69, 0, 0.4)"
          strokeWidth={2}
          name="Temperature (°C)"
        />
        <Area
          type="monotone"
          dataKey="humidity"
          stroke="#1e90ff"
          fill="rgba(30, 144, 255, 0.4)"
          strokeWidth={2}
          name="Humidity (%)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
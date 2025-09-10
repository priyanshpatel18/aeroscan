"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface Reading {
  timestamp: number
  temperature: number
  humidity: number
  pm25: number
  pm10: number
  aqi: number
}

interface TemperatureChartProps {
  history: Reading[]
  timeRangeMinutes?: number
}

function aggregateByMinute(history: Reading[]) {
  const groups: Record<number, { sum: number; count: number }> = {}

  history.forEach(r => {
    const minute = Math.floor(r.timestamp / 60000) * 60000 // round to nearest minute
    if (!groups[minute]) {
      groups[minute] = { sum: 0, count: 0 }
    }
    groups[minute].sum += r.temperature
    groups[minute].count += 1
  })

  return Object.entries(groups)
    .map(([minute, { sum, count }]) => ({
      timestamp: Number(minute),
      temperature: Math.round((sum / count) * 10) / 10, // round to 1 decimal
      time: new Date(Number(minute)).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
}

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "#3b82f6",
  },
}

export function TemperatureChart({ history, timeRangeMinutes = 1440 }: TemperatureChartProps) {
  // Filter data based on time range
  const now = Date.now()
  const cutoffTime = now - (timeRangeMinutes * 60 * 1000)
  const filteredHistory = history.filter(reading => reading.timestamp >= cutoffTime)
  
  const chartData = aggregateByMinute(filteredHistory)

  return (
    <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
          tick={{ fontSize: 10 }}
          minTickGap={20}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => `${value}°C`}
          width={35}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="temperature"
          type="natural"
          fill="#3b82f6"
          fillOpacity={0.4}
          stroke="#3b82f6"
        />
      </AreaChart>
    </ChartContainer>
  )
}

"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LineChart } from "@tremor/react"
import { montserrat } from "@/fonts"

interface HistoryPoint {
  time: string
  AQI: number
}

interface DashboardData {
  pm25?: number
  pm10?: number
  temperature?: number
  humidity?: number
  aqi?: number
  history?: HistoryPoint[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    pm25: undefined,
    pm10: undefined,
    temperature: undefined,
    humidity: undefined,
    aqi: undefined,
    history: [],
  })

  // Later: you’ll call your custom websocket hook here,
  // and update state with setData()

  const getAQIStatus = (aqi?: number) => {
    if (aqi == null) return { label: "--", color: "bg-gray-400" }
    if (aqi <= 50) return { label: "Good", color: "bg-green-500" }
    if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500" }
    if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "bg-orange-500" }
    if (aqi <= 200) return { label: "Unhealthy", color: "bg-red-500" }
    if (aqi <= 300) return { label: "Very Unhealthy", color: "bg-purple-500" }
    return { label: "Hazardous", color: "bg-rose-700" }
  }

  const aqiStatus = getAQIStatus(data.aqi)

  return (
    <div className="p-6 space-y-6">
      <h1 className={`text-2xl font-bold text-primary ${montserrat.className}`}>Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className={`${montserrat.className}`}>PM2.5</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.pm25 ?? "--"} µg/m³
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={`${montserrat.className}`}>PM10</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.pm10 ?? "--"} µg/m³
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={`${montserrat.className}`}>Temperature</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.temperature ?? "--"} °C
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={`${montserrat.className}`}>Humidity</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {data.humidity ?? "--"} %
          </CardContent>
        </Card>
      </div>

      {/* AQI */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className={`${montserrat.className}`}>Air Quality Index (AQI)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className={`w-4 h-4 rounded-full ${aqiStatus.color}`} />
          <p className="text-lg font-medium">
            {data.aqi ?? "--"} ({aqiStatus.label})
          </p>
        </CardContent>
      </Card>

      {/* Trends */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className={`${montserrat.className}`}>24-Hour AQI Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {data.history && data.history.length > 0 ? (
            <LineChart
              className="h-80"
              data={data.history}
              index="time"
              categories={["AQI"]}
              colors={["blue"]}
              yAxisWidth={40}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">
              No historical data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

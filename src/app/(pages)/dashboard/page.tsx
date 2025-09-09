"use client"

import { HumidityChart } from "@/components/charts/HumidityChart"
import { TemperatureChart } from "@/components/charts/TemperatureChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { montserrat } from "@/fonts"
import { useSocket } from "@/hooks/useSocket"
import { MessageType } from "@/messages"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Reading {
  timestamp: number
  temperature: number
  humidity: number
  pm25: number
  pm10: number
  aqi: number
}

interface DashboardData {
  temperature?: number
  humidity?: number
  history?: Reading[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ history: [] })
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      const messageData = JSON.parse(event.data)
      switch (messageData.type) {
        case MessageType.WELCOME:
          toast.success(messageData.payload.message)
          setData({
            temperature: messageData.payload.history.length > 0 ? messageData.payload.history[messageData.payload.history.length - 1].temperature : null,
            humidity: messageData.payload.history.length > 0 ? messageData.payload.history[messageData.payload.history.length - 1].humidity : null,
            history: messageData.payload.history
          });
          break
        case MessageType.UPDATE_DATA:
          console.log(messageData.payload);

          setData(messageData.payload)
          break
      }
    }

    socket.addEventListener("message", handleMessage)
    return () => socket.removeEventListener("message", handleMessage)
  }, [socket])

  return (
    <div className="p-6 space-y-6 mb-16">
      <h1 className={`text-2xl font-bold text-primary ${montserrat.className}`}>Dashboard</h1>

      {/* Current readings */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className={montserrat.className}>Temperature</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {data.temperature ?? "--"} °C
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={montserrat.className}>Humidity</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {data.humidity ?? "--"} %
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className={montserrat.className}>24-Hour Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            {data.history && data.history.length > 0 ? (
              <TemperatureChart history={data.history} />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No historical data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className={montserrat.className}>24-Hour Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            {data.history && data.history.length > 0 ? (
              <HumidityChart history={data.history} />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No historical data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

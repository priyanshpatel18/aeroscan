"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { montserrat } from "@/fonts"
import { LineChart } from "@tremor/react"
import { AlertTriangle, Download } from "lucide-react"

const trendData = [
  { month: "Jan", AQI: 42, WeatherIndex: 60 },
  { month: "Feb", AQI: 48, WeatherIndex: 58 },
  { month: "Mar", AQI: 51, WeatherIndex: 55 },
  { month: "Apr", AQI: 60, WeatherIndex: 65 },
  { month: "May", AQI: 70, WeatherIndex: 72 },
  { month: "Jun", AQI: 65, WeatherIndex: 68 },
]

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold text-primary ${montserrat.className}`}>Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 rounded-lg border border-dashed bg-muted/50 text-muted-foreground">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <p className="text-sm font-medium">
          This analytics page is currently <span className="font-semibold text-foreground">under construction</span>.
          Some features may be incomplete.
        </p>
      </div>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Long-Term Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            className="h-80"
            data={trendData}
            index="month"
            categories={["AQI", "WeatherIndex"]}
            colors={["blue", "green"]}
            yAxisWidth={40}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Respiratory Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Slightly elevated risk during May–June due to rising AQI.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Cardiovascular Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stable overall, but caution advised during high pollution days.
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>General Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Limit outdoor activity when AQI exceeds 60. Consider air purifiers indoors.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Weather & Air Quality Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Higher temperatures and stagnant weather conditions correlate with increased AQI levels.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

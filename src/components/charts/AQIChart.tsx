"use client"

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from "chart.js"
import 'chartjs-adapter-date-fns'
import dynamic from "next/dynamic"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
)

const LineChart = dynamic(
  () => import("react-chartjs-2").then(mod => mod.Line),
  { ssr: false }
)

interface Reading {
  timestamp: number
  temperature: number
  humidity: number
  pm25: number
  pm10: number
  aqi: number
}

interface AQIChartProps {
  history: Reading[]
}

export function AQIChart({ history }: AQIChartProps) {
  // Get AQI color based on value for dynamic chart coloring
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return { bg: "rgba(34, 197, 94, 0.1)", border: "rgb(34, 197, 94)" }
    if (aqi <= 100) return { bg: "rgba(234, 179, 8, 0.1)", border: "rgb(234, 179, 8)" }
    if (aqi <= 150) return { bg: "rgba(249, 115, 22, 0.1)", border: "rgb(249, 115, 22)" }
    if (aqi <= 200) return { bg: "rgba(239, 68, 68, 0.1)", border: "rgb(239, 68, 68)" }
    if (aqi <= 300) return { bg: "rgba(168, 85, 247, 0.1)", border: "rgb(168, 85, 247)" }
    return { bg: "rgba(190, 18, 60, 0.1)", border: "rgb(190, 18, 60)" }
  }

  const currentAQI = history.length > 0 ? history[history.length - 1].aqi : 50
  const colors = getAQIColor(currentAQI)

  const chartData = {
    datasets: [
      {
        label: "AQI",
        data: history.map(r => ({ x: r.timestamp, y: r.aqi })),
        fill: true,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: colors.border,
        pointBorderColor: "var(--background)",
      }
    ]
  }

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index"
    },
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "var(--popover)",
        bodyColor: "var(--popover-foreground)",
        borderColor: "var(--border)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return new Date(context[0].parsed.x).toLocaleString()
          },
          label: function(context) {
            const aqi = context.parsed.y
            let status = "Good"
            if (aqi > 50) status = "Moderate"
            if (aqi > 100) status = "Unhealthy for Sensitive Groups"
            if (aqi > 150) status = "Unhealthy"
            if (aqi > 200) status = "Very Unhealthy"
            if (aqi > 300) status = "Hazardous"
            return `AQI: ${aqi} (${status})`
          }
        }
      }
    },
    scales: {
      x: {
        type: "time",
        time: { 
          unit: "hour", 
          tooltipFormat: "PPpp",
          displayFormats: {
            hour: "HH:mm"
          }
        },
        ticks: { 
          color: "var(--muted-foreground)",
          maxTicksLimit: 8,
          font: {
            size: 11
          }
        },
        grid: { 
          display: false
        },
        border: {
          color: "var(--border)"
        }
      },
      y: {
        beginAtZero: true,
        ticks: { 
          color: "var(--muted-foreground)",
          callback: function(value) {
            return value + " AQI"
          },
          font: {
            size: 11
          }
        },
        grid: { 
          display: false
        },
        border: {
          color: "var(--border)"
        }
      }
    }
  }

  return (
    <div className="w-full">
      <div className="h-64 sm:h-72 md:h-80 lg:h-96 w-full">
        <LineChart data={chartData} options={chartOptions} />
      </div>
      
      {/* Optional: AQI reference legend */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-muted-foreground">0-50 Good</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-muted-foreground">51-100 Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-muted-foreground">101-150 Unhealthy*</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-muted-foreground">151-200 Unhealthy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-muted-foreground">201-300 Very Unhealthy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-rose-700"></div>
          <span className="text-muted-foreground">300+ Hazardous</span>
        </div>
      </div>
    </div>
  )
}

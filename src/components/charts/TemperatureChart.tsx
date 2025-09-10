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

interface TemperatureChartProps {
  history: Reading[]
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

  return Object.entries(groups).map(([minute, { sum, count }]) => ({
    x: Number(minute),
    y: sum / count
  }))
}

export function TemperatureChart({ history }: TemperatureChartProps) {
  const averagedData = aggregateByMinute(history)

  const chartData = {
    datasets: [
      {
        label: "Temperature (°C)",
        data: averagedData,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        tension: 0.6,
        pointRadius: 1,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "rgb(59, 130, 246)",
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
      legend: { display: false },
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
          title: function (context) {
            return new Date(context[0].parsed.x).toLocaleString()
          },
          label: function (context) {
            return `Temperature: ${context.parsed.y} °C`
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
          font: { size: 11 }
        },
        grid: { display: false },
        border: { color: "var(--border)" }
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "var(--muted-foreground)",
          callback: function (value) {
            return value + "°C"
          },
          font: { size: 11 }
        },
        grid: { display: false },
        border: { color: "var(--border)" }
      }
    }
  }

  return (
    <div className="w-full">
      <div className="h-64 sm:h-72 md:h-80 lg:h-96 w-full">
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

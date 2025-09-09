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

interface HumidityChartProps {
  history: Reading[]
}

export function HumidityChart({ history }: HumidityChartProps) {
  const chartData = {
    datasets: [
      {
        label: "Humidity (%)",
        data: history.map(r => ({ x: r.timestamp, y: r.humidity })),
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.1)", // teal-500 with opacity
        borderColor: "rgb(16, 185, 129)", // teal-500
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgb(16, 185, 129)",
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
          title: function(context) {
            return new Date(context[0].parsed.x).toLocaleString()
          },
          label: function(context) {
            return `Humidity: ${context.parsed.y} %`
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
          displayFormats: { hour: "HH:mm" }
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
        beginAtZero: true,
        max: 100, // humidity goes up to 100%
        ticks: {
          color: "var(--muted-foreground)",
          callback: function(value) {
            return value + "%"
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

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { SensorData } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3Icon, CloudIcon, InfoIcon } from "lucide-react";

interface IProps {
  latestReading: SensorData | null;
}

export default function LiveReading({ latestReading }: IProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      {latestReading ? (
        [
          {
            label: "Temperature",
            value: `${latestReading.temperature.toFixed(1)}°C`,
            icon: <BarChart3Icon className="w-4 h-4" />
          },
          {
            label: "Humidity",
            value: `${latestReading.humidity.toFixed(1)}%`,
            icon: <CloudIcon className="w-4 h-4" />
          },
          {
            label: "Air Quality",
            value: `${latestReading.sensorReading.toFixed(1)}`,
            icon: <InfoIcon className="w-4 h-4" />
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      {stat.icon}
                      {stat.label}
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={stat.value}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl font-bold"
                      >
                        {stat.value}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className={`rounded-full w-3 h-3 ${i === 2 && latestReading.sensorReading > 100 ? "bg-destructive" :
                    i === 2 && latestReading.sensorReading > 75 ? "bg-orange-400" : "bg-emerald-500"
                    }`}></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      ) : (
        <Card className="col-span-3">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Waiting for first sensor reading...</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

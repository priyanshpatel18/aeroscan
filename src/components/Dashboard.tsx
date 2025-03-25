import LiveReading from "@/components/LiveReading";
import { RecentReadings } from "@/components/RecentReadings";
import Stats from "@/components/Stats";
import { SensorData, SensorStats } from "@/types";
import { motion } from "framer-motion";
import { MapPin, Wifi } from "lucide-react";
import { Session } from "next-auth";

interface DashboardProps {
  sensorData: SensorData[];
  latestReading: SensorData | null;
  stats: SensorStats | null;
  sensorId: string | null;
}

export default function Dashboard({
  sensorData,
  latestReading,
  stats,
  sensorId,
}: DashboardProps) {
  const getGoogleMapsLink = (lat: number, lng: number) =>
    `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex justify-between items-baseline">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <h2 className="text-xl font-bold flex items-baseline">
                  <span>Air Quality Dashboard</span>
                  {sensorId && (
                    <span className="text-xs sm:text-lg text-muted-foreground bg-primary/10 px-1 rounded border border-primary/20 cursor-pointer lg:ml-2">
                      {sensorId}
                    </span>
                  )}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-0 flex items-center flex-wrap">
                Real-time air quality data from sensors
                {sensorData.length > 0 && (
                  <span className="ml-2 text-xs bg-primary/10 px-1 rounded">
                    ({sensorData.length} readings collected)
                  </span>
                )}
              </p>
            </div>
          </div>

          {latestReading?.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary" />
              <a
                href={getGoogleMapsLink(
                  latestReading.location.lat,
                  latestReading.location.lng
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <span>
                  {latestReading.location.lat.toFixed(4)}°,
                  {latestReading.location.lng.toFixed(4)}°
                </span>
                <Wifi size={14} className="text-green-500" />
              </a>
            </div>
          )}
        </div>
      </motion.div>

      <LiveReading latestReading={latestReading} />
      <Stats sensorData={sensorData} stats={stats} latestReading={latestReading} />
      <RecentReadings latestReading={latestReading} data={sensorData} />
    </>
  );
}
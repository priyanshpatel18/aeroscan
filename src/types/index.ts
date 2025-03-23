export interface SensorData {
  temperature: number;
  humidity: number;
  sensorReading: number;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  timestamp: number;
  sensorId: string;
}

export interface SensorStats {
  minTemp: number | null;
  maxTemp: number | null;
  avgTemp: number | null;
  minHumidity: number | null;
  maxHumidity: number | null;
  avgHumidity: number | null;
  minSensorReading: number | null;
  maxSensorReading: number | null;
  avgSensorReading: number | null;
  dataPoints: number;
}
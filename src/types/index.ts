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

export const web3SessionExpiredError = "Error occurred while verifying params timesigned is more than 60 seconds ago"

interface Reading {
  temperature: number;
  humidity: number;
  sensorReading: number;
  timestamp: number;
}

export interface TransactionData {
  sensorId: string;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  },
  readings: Reading[]
}
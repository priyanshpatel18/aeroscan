
<div align="center"> <img src="public/logo-1.png" alt="aeroscan" width="20%"> <h1>aeroscan</h1> 

A personal air quality monitoring system that provides real-time environmental data through IoT sensors and cloud visualization.

  <a class="header-badge" target="_blank" href="https://twitter.com/priyansh_ptl18"> <img alt="Twitter" src="https://img.shields.io/badge/@priyansh_ptl18-000000?style=for-the-badge&logo=x&logoColor=white"> </a>
</div>

## Overview

**Aeroscan** is an open-source air quality monitoring system powered by an ESP32 microcontroller. It measures PM2.5, PM1.0, and PM10 particulate matter levels using a **PMS7003 sensor**, along with temperature and humidity data from a **DHT22 sensor**. The system calculates the **Air Quality Index (AQI)** based on US EPA standards and streams real-time data to a cloud endpoint for visualization and analysis.

This is a lightweight, breadboard prototype designed for experimentation with IoT, environmental sensing, and data analytics — no production overhead, just pure functionality.

## System Architecture

The Aeroscan ecosystem consists of four main components:

### **Web Dashboard** (This Repository)
Next.js-based web application for data visualization and system management.

### **WebSocket Server** 
Real-time data streaming and client communication.
- Repository: [aeroscan-ws](https://github.com/priyanshpatel18/aeroscan-ws)

### **Communication Protocol**
Custom protocol for ESP32-to-cloud data transmission.
- Repository: [aeroscan-protocol](https://github.com/priyanshpatel18/aeroscan-protocol)

### **ESP32 Firmware**
Microcontroller code for sensor data collection and processing.
- Repository: [aeroscan-esp32](https://github.com/priyanshpatel18/aeroscan-esp32)

## Features

- **Real-time Air Quality Monitoring**: Live PM2.5, PM1.0, and PM10 measurements
- **Environmental Sensing**: Temperature and humidity tracking via DHT22
- **AQI Calculation**: Automatic Air Quality Index computation using US EPA standards
- **Live Data Visualization**: Interactive charts and real-time dashboards
- **Cloud Integration**: Seamless data uploading and storage
- **IoT Connectivity**: Wi-Fi enabled ESP32 for wireless data transmission
- **Open Source**: Fully open prototype for experimentation and learning

## Hardware Requirements

### Core Components
- **ESP32** microcontroller (Wi-Fi enabled)
- **PMS7003** particulate matter sensor
- **DHT22** temperature and humidity sensor
- Breadboard and jumper wires
- Power supply (USB or external)

### Sensor Specifications
- **PMS7003**: Measures PM1.0, PM2.5, and PM10 with ±10µg/m³ accuracy
- **DHT22**: Temperature range -40°C to 80°C, humidity 0-100% RH

## Software Stack

### Frontend (This Repository)
- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **@tremor/react** - Data visualization
- **WebSocket Client** - Real-time data consumption

### Backend Services
- **WebSocket Server** - Real-time data streaming
- **Custom Protocol** - ESP32 communication
- **Cloud Storage** - Data persistence and analytics

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/priyanshpatel18/aeroscan.git
cd aeroscan
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aeroscan?schema=public"
NEXT_PUBLIC_WS_URL="ws://localhost:5555"
PRIVATE_KEY="your-private-key-here"
HELIUS_RPC_URL="https://rpc.helius.xyz/?api-key=your-api-key"
MC_TOKEN="your-mc-token-here"
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Related Repositories

| Repository                                                                | Description                                              | Technology         |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------ |
| [aeroscan-ws](https://github.com/priyanshpatel18/aeroscan-ws)             | WebSocket server for real-time data streaming            | Node.js, WebSocket |
| [aeroscan-protocol](https://github.com/priyanshpatel18/aeroscan-protocol) | Communication protocol for ESP32-cloud data transmission | Custom Protocol    |
| [aeroscan-esp32](https://github.com/priyanshpatel18/aeroscan-esp32)       | ESP32 firmware for sensor data collection                | C++, Arduino IDE   |

## Detailed Blog

- [Aeroscan: IoT Air Quality Monitoring with ESP32 and Next.js](https://aeroscan-blog.priyanshpatel.com)

## AQI Calculation

The system implements US EPA Air Quality Index standards:

| AQI Range | Air Quality             | PM2.5 (µg/m³) | Health Impact                            |
| --------- | ----------------------- | ------------- | ---------------------------------------- |
| 0-50      | Good                    | 0-12          | Minimal impact                           |
| 51-100    | Moderate                | 12.1-35.4     | Acceptable for most                      |
| 101-150   | Unhealthy for Sensitive | 35.5-55.4     | Sensitive groups may experience symptoms |
| 151-200   | Unhealthy               | 55.5-150.4    | Everyone may experience symptoms         |
| 201-300   | Very Unhealthy          | 150.5-250.4   | Health warnings                          |
| 301+      | Hazardous               | 250.5+        | Emergency conditions                     |

## Development

### Project Structure
```
aeroscan/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   ├── hooks/        # Custom React hooks
│   └── types/        # TypeScript definitions
├── public/           # Static assets
└── docs/            # Documentation
```

## Deployment

### Prerequisites
1. Set up and deploy the [WebSocket server](https://github.com/priyanshpatel18/aeroscan-ws)
2. Configure your ESP32 with the [firmware](https://github.com/priyanshpatel18/aeroscan-esp32)
3. Ensure the [communication protocol](https://github.com/priyanshpatel18/aeroscan-protocol) is properly implemented

### Deploy to Vercel
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
```env
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aeroscan?schema=public
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- US EPA for AQI calculation standards
- PMS7003 and DHT22 sensor documentation
- ESP32 community and Arduino ecosystem

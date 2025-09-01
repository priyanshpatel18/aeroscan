"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { montserrat } from "@/fonts";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="container mx-auto max-w-4xl space-y-16 my-16">
        <section className="space-y-6 text-center">
          <h1 className={`text-4xl lg:text-5xl font-bold text-primary ${montserrat.className}`}>
            About Aeroscan
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Aeroscan is a personal air quality monitoring system powered by the
            ESP32 microcontroller. It combines low-cost sensors with open-source
            software to provide real-time environmental insights, enabling
            experimentation with IoT, air quality sensing, and data analytics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Our Mission</h2>
          <p className="text-base text-muted-foreground">
            To democratize air quality monitoring by making affordable,
            open-source tools that empower individuals and communities to better
            understand their environment. Aeroscan aims to provide a simple
            prototype that sparks innovation in sustainable technology and
            citizen-driven science.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-medium">ESP32 Microcontroller</h3>
                <p className="text-sm text-muted-foreground">
                  Acts as the core processor, handling sensor data acquisition,
                  AQI calculations, and Wi-Fi cloud communication.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-medium">PMS7003 Sensor</h3>
                <p className="text-sm text-muted-foreground">
                  Measures particulate matter (PM1.0, PM2.5, PM10) with high
                  sensitivity using laser scattering technology.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-medium">DHT22 Sensor</h3>
                <p className="text-sm text-muted-foreground">
                  Provides temperature and humidity data, adding environmental
                  context to particulate matter readings.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-medium">Cloud Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Streams real-time data to a cloud endpoint for logging,
                  visualization, and future analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Data Accuracy & Calibration</h2>
          <p className="text-base text-muted-foreground">
            Aeroscan is designed as an experimental prototype. While the
            PMS7003 and DHT22 sensors offer reliable low-cost performance, they
            are not calibrated against certified laboratory-grade instruments.
            Readings provide a baseline for personal awareness and research, but
            should not be used as regulatory-grade measurements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Get Involved</h2>
          <p className="text-base text-muted-foreground">
            Aeroscan is open-source and welcomes contributions from developers,
            hardware enthusiasts, and environmental researchers. Whether it’s
            improving the codebase, enhancing visualization tools, or sharing
            calibration techniques, your input is valuable.
          </p>

          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link
                href="https://github.com/priyanshpatel18/aeroscan"
                target="_blank"
              >
                Contribute on GitHub
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
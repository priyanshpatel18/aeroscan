"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { montserrat } from "@/fonts";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col p-6 mb-16">
      <div className="container mx-auto max-w-4xl space-y-16 my-16">
        <section className="space-y-6 text-center">
          <h1 className={`text-4xl lg:text-5xl font-bold text-primary ${montserrat.className}`}>
            About Aeroscan
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Aeroscan is a personal environmental monitoring system powered by
            the ESP32 microcontroller. It focuses on real-time{" "}
            <span className="font-semibold">temperature</span> and{" "}
            <span className="font-semibold">humidity</span> insights, enabling
            experimentation with IoT, climate sensing, and data analytics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Our Mission</h2>
          <p className="text-base text-muted-foreground">
            To democratize environmental monitoring by making affordable,
            open-source tools that empower individuals and communities to better
            understand their surroundings. Aeroscan aims to spark innovation in
            sustainable technology and citizen-driven science.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-medium">ESP32 Microcontroller</h3>
                <p className="text-sm text-muted-foreground">
                  Acts as the core processor, handling sensor data acquisition
                  and Wi-Fi cloud communication.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-medium">DHT22 Sensor</h3>
                <p className="text-sm text-muted-foreground">
                  Provides accurate <strong>temperature</strong> and{" "}
                  <strong>humidity</strong> readings, giving essential
                  environmental context.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Data Accuracy & Calibration</h2>
          <p className="text-base text-muted-foreground">
            Aeroscan is designed as an experimental prototype. While the DHT22
            sensor provides reliable low-cost performance, it is not calibrated
            against certified laboratory-grade instruments. Readings give a
            useful baseline for awareness and research, but should not be used
            for regulatory-grade measurements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className={`text-2xl font-semibold ${montserrat.className}`}>Get Involved</h2>
          <p className="text-base text-muted-foreground">
            Aeroscan is open-source and welcomes contributions from developers,
            hardware enthusiasts, and environmental researchers. Whether it’s
            improving the codebase, enhancing visualization tools, or exploring
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

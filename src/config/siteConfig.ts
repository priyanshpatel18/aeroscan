import { Metadata } from "next";

const { title, description, ogImage, baseURL, appName } = {
  title: "aeroscan",
  description:
    "aeroscan is a personal air quality monitoring tool that tracks PM2.5, temperature, and humidity in real time. Stay informed about your environment with clear, simple insights.",
  baseURL: "https://aeroscan.site",
  ogImage: "/og-image.png",
  appName: "aeroscan",
};

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ogImage,
  },
  icons: {
    icon: [
      { rel: "icon", type: "image/x-icon", url: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "48x48",
        url: "/favicon-48x48.png",
      },
      { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
    ],
    apple: "/apple-touch-icon.png",
  },
  applicationName: appName,
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    "air quality",
    "AQI monitor",
    "PM2.5 sensor",
    "environment tracker",
    "personal air monitor",
    "ESP32 project",
    "Aeroscan",
  ],
};

import type { MetadataRoute } from "next";

const { appName, description } = {
  appName: "aeroscan",
  description:
    "aeroscan is a personal air quality monitoring tool that tracks PM2.5, temperature, and humidity in real time. Stay informed about your environment with clear, simple insights.",
};

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
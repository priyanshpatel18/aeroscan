"use client";

import { useState, useEffect } from "react";

export function useGeolocation() {
  const [city, setCity] = useState<string | undefined>(undefined);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch("/api/get-city", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: latitude, lon: longitude }),
        });

        const data = await res.json();
        if (data.city) setCity(data.city);
      } catch (error) {
        console.error("Failed to fetch city:", error);
      }
    });
  }, []);

  return { city };
}

"use client";

import { useEffect, useRef, useState } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export function useSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = () => {
      if (!WS_URL) {
        console.error("WebSocket URL is not defined");
        return;
      }
      console.log("Attempting WebSocket connection...");
      socketRef.current = new WebSocket(WS_URL);

      socketRef.current.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
      };

      socketRef.current.onclose = () => {
        console.warn("WebSocket Disconnected");
        setIsConnected(false);
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
    };

    connect();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
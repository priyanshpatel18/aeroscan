"use client";

import { MessageType } from "@/messages";
import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "";
const HEARTBEAT_INTERVAL = 5000;
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

export type ConnectionType = "2g" | "3g" | "4g" | "offline";

export function useSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connectionType, setConnectionType] = useState<ConnectionType | null>(null);

  function getConnectionInfo(): ConnectionType | null {
    if ("connection" in navigator) {
      const connection =
        navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      if (connection && typeof connection === "object") {
        return connection.effectiveType || null;
      }
    }
    return isConnected ? "4g" : "offline";
  }

  const connect = useCallback(() => {
    if (!navigator.onLine) {
      setConnectionType("offline");
      window.addEventListener("online", handleOnline);
      return;
    }

    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      try {
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
          setReconnectAttempts(0);
          setConnectionType(getConnectionInfo());
          setIsConnected(true);

          ws.send(JSON.stringify({ type: MessageType.CONNECTED }));

          // Start Heartbeat
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN && navigator.onLine) {
              setConnectionType(getConnectionInfo());
              ws.send(JSON.stringify({ type: MessageType.HEARTBEAT }));
            } else if (!navigator.onLine) {
              setConnectionType("offline");
              ws.close();
            }
          }, HEARTBEAT_INTERVAL);
        };

        ws.onclose = () => {
          setIsConnected(false);
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
          attemptReconnect();
        };

        // Error Handling
        ws.onerror = (error) => {
          setConnectionType("offline");
          console.error("WebSocket error:", error);
          ws.close();
        };
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
        setConnectionType("offline");
      }
    } else {
      console.error("Max Reconnect Attempts Reached");
    }
  }, [reconnectAttempts]);

  const attemptReconnect = useCallback(() => {
    // Clear Timeout if already exists
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Try Reconnection if user disconnects
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && navigator.onLine) {
      setReconnectAttempts((prev) => prev + 1);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, RECONNECT_INTERVAL);
    } else if (!navigator.onLine) {
      setConnectionType("offline");
      window.addEventListener("online", handleOnline);
    } else {
      console.error("Max Reconnect Attempts Reached");
    }
  }, [connect, reconnectAttempts]);

  const handleOnline = useCallback(() => {
    setConnectionType(getConnectionInfo());
    window.removeEventListener("online", handleOnline);
    setReconnectAttempts(0);
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", () => {
      setConnectionType("offline");
      setIsConnected(false);
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect, handleOnline]);

  return { socket: socketRef.current, isConnected, connectionType };
}
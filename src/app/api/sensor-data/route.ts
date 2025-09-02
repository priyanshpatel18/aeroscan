import { NextRequest, NextResponse } from "next/server";
import { updateReading } from "@/utils/solanaClient";

export async function POST(req: NextRequest) {
  try {
    const token =
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      req.headers.get("x-api-token") ||
      "";

    if (token !== process.env.MC_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { temperature, humidity, pm25, pm10 } = body;

    if (typeof temperature !== "number" || typeof humidity !== "number") {
      return NextResponse.json(
        { error: "Invalid data format. temperature and humidity are required numbers" },
        { status: 400 }
      );
    }

    // Update Solana reading
    await updateReading(0, 0, temperature, humidity, 0);

    return NextResponse.json({
      message: "Sensor data updated successfully",
      data: { temperature, humidity, pm25, pm10 }
    });
  } catch (error) {
    console.error("Error handling sensor-data request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

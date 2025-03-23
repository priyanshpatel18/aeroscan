import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
const SENSOR_SECRET = process.env.SENSOR_SECRET || "my_secret_key";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Generate Sensor ID
  const value = body.value;

  // Generate Sensor ID
  const hash = await argon2.hash(SENSOR_SECRET + value);

  return NextResponse.json({ hash });
}
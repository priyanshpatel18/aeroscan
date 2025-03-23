import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import prisma from "@/db";
import { Sensor } from "@prisma/client";
const SENSOR_SECRET = process.env.SENSOR_SECRET || "my_secret_key";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const value = body.value;
  const email = body.email;

  if (!value) {
    return NextResponse.json({ isValid: false });
  }
  if (email !== "kaizen0499@gmail.com") {
    return NextResponse.json({ isValid: false, message: "EMAIL_NOT_VERIFIED" });
  }

  try {
    const isValid = await argon2.verify("$argon2id$v=19$m=65536,t=3,p=4$C8r2vamTeN1Oyv5SuIXksw$4/sB8Sz+ILuC699vYjfYrKbadOzfPEzTlZuQU93hEb0", SENSOR_SECRET + value);

    let sensor: Sensor | null = null;
    sensor = await prisma.sensor.findFirst({
      where: {
        email,
        sensorId: value,
        verified: true
      },
    });
    if (isValid) {
      if (!sensor) {
        sensor = await prisma.sensor.upsert({
          where: {
            email,
          },
          update: {
            verified: true
          },
          create: {
            email,
            sensorId: value,
            verified: true
          },
        });
      }

      return NextResponse.json({ isValid, sensor }, { status: 200 });
    } else {
      return NextResponse.json({ isValid: false }, { status: 400 });
    }
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ isValid: false }, { status: 500 });
  }
}
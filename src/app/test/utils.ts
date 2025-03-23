import argon2 from "argon2";

const SENSOR_SECRET = process.env.SENSOR_SECRET || "my_secret_key";

export async function generateSensorId(value: string): Promise<string> {
  return await argon2.hash(SENSOR_SECRET + value);
}

// Validate sensor ID against the original hash
export async function validateSensorId(value: string, originalHash: string): Promise<boolean> {
  try {
    return await argon2.verify(originalHash, SENSOR_SECRET + value);
  } catch (error) {
    console.error("Validation failed:", error);
    return false;
  }
}

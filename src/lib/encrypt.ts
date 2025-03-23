import { SignJWT, jwtVerify } from "jose";

// Load keys from environment variables
const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET || "");

// Generate a JWT token
export const generateToken = async (payload: Record<string, any>, expiresIn: string = "1h") => {
  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime(expiresIn).sign(SECRET_KEY);
};

// Verify a JWT token
export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, SECRET_KEY);
  return payload as Record<string, any>;
};
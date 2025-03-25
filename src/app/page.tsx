"use server";

import Home from "@/components/Home";
import { auth } from "@/lib/auth";


export default async function HomePage() {
  const session = await auth();

  return (
   <Home session={session} />
  );
}
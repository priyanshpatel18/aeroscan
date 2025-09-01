"use client";

import AppBar from "@/components/AppBar";
import AppFooter from "@/components/AppFooter";
import { ReactNode } from "react";

export default function PageLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppBar />
      {children}
      <AppFooter />
    </div>
  )
}

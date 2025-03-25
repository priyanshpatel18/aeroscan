"use client";

import { CloudIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-12 py-6 px-4 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <CloudIcon className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm font-medium">aeroscan</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Real-time air quality monitoring dashboard
          </div>
        </div>
      </div>
    </footer>
  )
}

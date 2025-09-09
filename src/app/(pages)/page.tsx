"use client";

import { Button } from '@/components/ui/button';
import { pirataOne } from '@/fonts';
import {
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const techStack = [
    {
      icon: "/solana.png",
      link: "https://solana.com/",
      name: "Solana",
      description: "Blockchain for the future"
    },
    {
      icon: "/magicblock.jpg",
      link: "https://magicblock.xyz/",
      name: "MagicBlock",
      description: "Rollup solution for Solana"
    },
    {
      icon: "/esp32.svg",
      name: "ESP32",
      link: "https://www.espressif.com/en/products/socs/esp32",
      description: "IoT sensor hardware"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl space-y-16">

        <div className="text-center space-y-6">
          <h1 className={`text-4xl lg:text-5xl font-bold text-primary ${pirataOne.className}`}>
            aeroscan
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time environmental data stored on Solana blockchain
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base" onClick={() => router.push("/dashboard")}>
              View Analytics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-base text-primary"
              onClick={() => router.push("https://github.com/priyanshpatel18/aeroscan")}
            >
              View on GitHub
            </Button>
          </div>
        </div>

        <div className="space-y-2 flex flex-col items-center">
          <h2 className="text-2xl text-center text-foreground">
            Powered by
          </h2>

          <div className="flex gap-4">
            {techStack.map((tech, index) => (
              <Link
                key={index}
                href={tech.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2"
              >
                <Image
                  key={index}
                  src={tech.icon}
                  alt={tech.name}
                  width={64}
                  height={64}
                  className="mx-auto rounded-full"
                />
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* TODO: ADD A BLOG */}
      <div></div>
    </div>
  );
}
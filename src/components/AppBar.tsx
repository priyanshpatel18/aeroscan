"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { pirataOne } from "@/fonts";
import { Activity, BarChart3, Info, Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function AppBar() {
  const router = useRouter();

  const navigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: Activity },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "About", href: "/about", icon: Info },
  ];

  const NavItems = ({
    mobile = false,
  }: {
    mobile?: boolean;
  }) => (
    <div
      className={`flex ${mobile ? "flex-col space-y-2" : "space-x-6"
        } items-start`}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return mobile ? (
          <SheetClose asChild key={item.label}>
            <Button
              variant="ghost"
              onClick={() => router.push(item.href)}
              className="w-full justify-start gap-3 h-12 text-primary cursor-pointer"
            >
              <Icon size={20} />
              {item.label}
            </Button>
          </SheetClose>
        ) : (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex items-center gap-2 text-sm font-medium transition-colors text-primary cursor-pointer"
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-3 select-none cursor-pointer group"
              onClick={() => router.push("/")}
            >
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="aeroscan logo"
                  width={40}
                  height={40}
                  className="transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`${pirataOne.className} text-2xl lg:text-3xl text-primary leading-none`}
                >
                  aeroscan
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Air Quality Monitor
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <NavItems />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://github.com/priyanshpatel18/aeroscan",
                    "_blank"
                  )
                }
                className="hidden sm:flex items-center gap-2"
              >
                <Image src="/github.png" alt="github" width={20} height={20} />
                <span className="hidden lg:inline text-primary">Source</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://github.com/priyanshpatel18/aeroscan",
                    "_blank"
                  )
                }
                className="sm:hidden"
              >
                <Image src="/github.png" alt="github" width={20} height={20} />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-6">
                  <SheetHeader className="text-left pb-6">
                    <SheetTitle className="flex items-center gap-3">
                      <Image
                        src="/logo.png"
                        alt="logo"
                        width={32}
                        height={32}
                      />
                      <span
                        className={`${pirataOne.className} text-xl text-primary`}
                      >
                        aeroscan
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <nav className="space-y-1">
                        <NavItems mobile />
                      </nav>

                      <div className="mt-8">
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                "https://github.com/priyanshpatel18/aeroscan",
                                "_blank"
                              )
                            }
                            className="w-full justify-start gap-3 h-12"
                          >
                            <Image
                              src="/github.png"
                              alt="github"
                              width={20}
                              height={20}
                            />
                            View Source Code
                          </Button>
                        </SheetClose>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16" />
    </>
  );
}
import { pirataOne } from "@/fonts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppFooter() {
  const router = useRouter();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-3 select-none cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <span
              className={`${pirataOne.className} text-2xl lg:text-3xl text-primary leading-none`}
            >
              aeroscan
            </span>
          </div>
          <Link href="https://x.com/priyansh_ptl18" target="_blank">
            <Image src="/x.png" alt="x" width={20} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  )
}

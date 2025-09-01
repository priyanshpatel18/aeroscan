import { AppProviders } from '@/components/AppProviders';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config/siteConfig';
import '@solana/wallet-adapter-react-ui/styles.css';
import "./globals.css";
import { inter } from '@/fonts';

export const metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className}`}>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

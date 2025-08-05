import { Metadata } from "next";

const { title, description, ogImage, baseURL, appName } = {
  title:
    "Realtime",
  description:
    "",
  baseURL: "https://realtime-test.zerogames.fun",
  ogImage: "",
  appName: "",
};

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ogImage,
  },
  icons: {
    icon: [
      { rel: "icon", type: "image/x-icon", url: "/favicon.ico" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "48x48",
        url: "/favicon-48x48.png",
      },
      { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
    ],
    apple: "/apple-touch-icon.png",
  },
  applicationName: appName,
  alternates: {
    canonical: baseURL,
  },
  keywords: [
   
  ],
};
import type { MetadataRoute } from "next";
import { ORGANIZATION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NAG · NOVIK — профессиональное звуковое оборудование",
    short_name: "NAG · NOVIK",
    description: ORGANIZATION.description,
    start_url: "/",
    display: "standalone",
    lang: "ru",
    background_color: "#FBFAF7",
    theme_color: "#E11507",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

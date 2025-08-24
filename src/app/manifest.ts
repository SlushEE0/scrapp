import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Scrapp",
    short_name: "Scrapp",
    description: "Your buddy for better disposal",
    start_url: "/",
    display: "standalone",
    background_color: "#d0f1c5",
    theme_color: "#19573f",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}

import type { Metadata, Viewport } from "next";
import { Behaviour } from "@/components/Behaviour";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { preload } from "react-dom";
import "@/generated/styles.css";

export const metadata: Metadata = {
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
};

export const viewport: Viewport = { themeColor: "#e5f15c" };

// Preloaded so the text is in its own face from the first paint.
const FONTS = ["fjalla-one-latin-400-normal", "barlow-latin-500-normal", "barlow-latin-700-normal"];

const NO_SCRIPT = "<style>.bar__menu{display:none}.nav{display:flex}.wall__controls{display:none}</style>";

export default function RootLayout({ children }: LayoutProps<"/">) {
  for (const font of FONTS) {
    preload(`/fonts/${font}.woff2`, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }
  return (
    <html lang="en-GB">
      <head>
        <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT }} />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <Behaviour />
      </body>
    </html>
  );
}

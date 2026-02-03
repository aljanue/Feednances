import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Feednances",
  description: "Smart subscription and expense management",
  metadataBase: new URL("https://feednances.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen text-foreground font-sans antialiased overflow-x-hidden`}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -30%, rgba(43, 238, 108, 0.12), transparent),
            radial-gradient(ellipse 50% 40% at 90% 20%, rgba(120, 119, 198, 0.15), transparent),
            oklch(0.129 0.042 264.695)
          `,
        }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

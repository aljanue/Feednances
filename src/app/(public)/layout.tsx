import NavBar from "@/components/public/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feednances | Smart Subscription & Expense Tracker",
  description:
    "Take control of your digital spend. Track subscriptions, log expenses instantly via iOS Shortcuts, and get Telegram alerts before you're charged. Start saving today!",
  openGraph: {
    title: "Feednances - Automated Expense Management",
    description:
      "The ultimate tool to manage recurring payments with iOS Shortcuts and Telegram integration.",
    type: "website",
    url: "https://feednances.vercel.app",
    images: [
      {
        url: "https://feednances.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Feednances Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feednances | Smart Subscription Tracker",
    description:
      "Never pay for a forgotten subscription again. Integrated with iOS & Telegram.",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="p-8 grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

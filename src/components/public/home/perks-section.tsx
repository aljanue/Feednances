import Card from "@/components/shared/card";
import Link from "next/link";

const perks = [
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Zero Friction",
    description:
      "Input data in seconds via Siri, Shortcuts, or Raycast. Never open a heavy banking app again.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 9l-1.25-2.75L15 5l2.75-1.25L19 1l1.25 2.75L23 5l-2.75 1.25L19 9zm0 14l-1.25-2.75L15 19l2.75-1.25L19 15l1.25 2.75L23 19l-2.75 1.25L19 23zM9 18l-2.5-5.5L1 10l5.5-2.5L9 2l2.5 5.5L17 10l-5.5 2.5L9 18z" />
      </svg>
    ),
    title: "Automated Parsing",
    description:
      "Forward your digital receipts to a private inbox. Our AI handles categorization and deduplication instantly.",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
      </svg>
    ),
    title: "Cloud Native Sync",
    description:
      "Your financial data, synchronized across all your devices in real-time with full API access for developers.",
    color: "bg-purple-500/10 text-purple-400",
  },
];

export default function PerksSection() {
  return (
    <div className="py-16 w-full bg-white/5 border-y border-muted-foreground/20 flex flex-col items-center lg:px-16 md:px-12 sm:px-8 px-4 gap-8">
      <h1 className="text-4xl font-black text-center">
        Engineered for Efficiency
      </h1>
      <p className="text-muted-foreground text-center">
        Minimalist tools for maximalist financial control. No bloat, just
        performance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
        {perks.map((perk, index) => (
          <Card
            key={index}
            icon={perk.icon}
            title={perk.title}
            description={perk.description}
            color={perk.color}
          />
        ))}
      </div>
      <Link href="/features" className="nav-link-white">See all features</Link>
    </div>
  );
}

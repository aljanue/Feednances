import Image from "next/image";

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({ collapsed }: LogoProps) {
    return (
        <div className="flex items-center gap-4 h-6 cursor-pointer">
          <Image
            src="/feednances.svg"
            alt="Feednances Logo"
            width={32}
            height={32}
            className="h-full w-auto"
          />
        {!collapsed && <h1 className="font-bold text-xl transition-opacity duration-300">Feednances</h1>}
        </div>
    )
}
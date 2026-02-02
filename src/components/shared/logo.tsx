import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center gap-4 h-6 cursor-pointer">
          <Image
            src="/feednances.svg"
            alt="Feednances Logo"
            width={32}
            height={32}
            className="h-full w-auto"
          />
          <h1 className="font-bold text-xl">Feednances</h1>
        </div>
    )
}
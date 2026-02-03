import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import IPhoneMockup from "./iphone-mockup";

export default function MainSection() {
  return (
    <section className="py-8 w-full min-h-[calc(100vh-85px)] flex justify-between items-center lg:px-16 md:px-12 sm:px-8 px-4 md:flex-row flex-col-reverse gap-8">
      <div className="flex flex-col gap-6 max-w-lg">
        <Badge variant="announcement" className="gap-2 text-sm">
          <span className="bg-primary h-2 w-2 rounded-full"></span>
          <p className="uppercase">new: ios shortcuts integration</p>
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
          Track Finances at the Speed of a{" "}
          <span className="text-primary">Shortcut</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Experience the power of a headless expense tracker. Automated,
          developer-friendly, and built for speed with zero app-opening
          required.
        </p>
        <div>
          <Button size="lg">Start Setup</Button>
        </div>
      </div>
      
      <IPhoneMockup />
    </section>
  );
}

import { cn } from "@/lib/utils";

interface InfoContainerProps {
    title: string;
    variant?: "default" | "destructive";
    children: React.ReactNode;
}

export default function InfoContainer({ title, variant = "default", children }: InfoContainerProps) {
    return (
        <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", variant === "destructive" && "border-destructive/50")}>
            <div className={cn("p-4 border-b", variant === "destructive" && "border-destructive/50")}>
                <h2 className={cn("font-semibold leading-none tracking-tight text-lg", variant === "destructive" && "text-destructive")}>{title}</h2>
            </div>
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}
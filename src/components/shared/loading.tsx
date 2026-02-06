import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export function Loading() {
  return (
    <div className="flex-1 h-full w-full flex items-center justify-center gap-4">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}

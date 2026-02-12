"use client";

import { Check, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PRESET_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#84cc16", // Lime
  "#22c55e", // Green
  "#10b981", // Emerald
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#64748b", // Slate
];

interface ColorPickerProps {
  value?: string | null;
  onChange: (color: string) => void;
  error?: string;
}

export function ColorPicker({ value, onChange, error }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <Label>Color</Label>
      <div className="grid grid-cols-6 gap-3 p-1">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              value === color ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110 shadow-md" : "opacity-90 hover:opacity-100"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          >
            {value === color && <Check className="h-4 w-4 text-white drop-shadow-md" />}
          </button>
        ))}
      </div>
      
      <div className="relative flex items-center mt-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <div 
            className="h-4 w-4 rounded-sm border shadow-sm"
            style={{ backgroundColor: value || "transparent" }}
          />
        </div>
        <Input
          placeholder="#000000"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className="pl-9 pr-12 font-mono uppercase"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 p-1">
           <div className="relative h-7 w-8 overflow-hidden rounded-md border border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer bg-background">
             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/20 pointer-events-none">
                <GripHorizontal className="h-3 w-3 opacity-50" />
             </div>
             <input
               type="color"
               value={value || "#000000"}
               onChange={(e) => onChange(e.target.value)}
               className="absolute inset-0 h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 p-0 opacity-0 cursor-pointer"
               title="Open color picker"
             />
           </div>
        </div>
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

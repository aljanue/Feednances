"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { TimeRangeValue } from "@/lib/dtos/dashboard";

interface TimeRangeSelectProps {
  value: TimeRangeValue;
  onValueChange: (value: TimeRangeValue) => void;
}

const timeRangeLabels: Record<TimeRangeValue, string> = {
  "last-month": "Last month",
  "last-3-months": "Last 3 months",
  "last-6-months": "Last 6 months",
  "last-year": "Last year",
};

export default function TimeRangeSelect({
  value,
  onValueChange,
}: TimeRangeSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as TimeRangeValue)}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(timeRangeLabels).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

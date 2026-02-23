"use server";

import { getAllTimeUnits } from "@/lib/data/time-units.queries";

export async function getTimeUnitsAction() {
  return await getAllTimeUnits();
}

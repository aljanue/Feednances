export const chartPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getChartColorByIndex(index: number) {
  return chartPalette[index % chartPalette.length];
}

export function getChartColorForCategory(category: string) {
  const hash = hashString(category.toLowerCase());
  return getChartColorByIndex(hash % chartPalette.length);
}

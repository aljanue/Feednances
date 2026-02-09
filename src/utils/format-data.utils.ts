export function formatAmount(amount: string | number): string {
  if (!amount) return '0';
  
  let cleaned = amount.toString();
  
  cleaned = cleaned.replace(',', '.');
  
  if (isNaN(Number(cleaned))) {
    throw new Error(`El importe '${amount}' no es un número válido.`);
  }

  return cleaned;
}

export function formatTimeAbbreviationByType(type: string): string {
  switch (type) {
    case "day":
      return "d";
    case "week":
      return "w";
    case "month":
      return "mo";
    case "year":
      return "ye";
    default:
      return type;
  }
}
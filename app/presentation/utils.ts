import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number, currency: string = "ARS") {
  try {
    return new Intl.NumberFormat("es-AR", {
      currency,
      style: "currency",
      maximumFractionDigits: currency === "BTC" ? 20 : 2,
    }).format(amount);
  } catch (e) {
    return new Intl.NumberFormat("es-AR", {
      currency: "ARS",
      style: "currency",
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    year: "numeric",
    month: "short",
  },
) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

export const COLORS = [
  "amber",
  "blue",
  "cyan",
  "emerald",
  "fuchsia",
  "gray",
  "green",
  "indigo",
  "lightBlue",
  "lime",
  "neutral",
  "orange",
  "pink",
  "purple",
  "red",
  "rose",
  "sky",
  "slate",
  "stone",
  "teal",
  "violet",
  "yellow",
  "zinc",
] as const;

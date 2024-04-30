import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: number, currency = "ARS") {
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

export function getMonthDefaultValue() {
  const [month, year] = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .split("/");

  return `${year}-${month}`;
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

export const TAILWIND_BG = {
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  fuchsia: "bg-fuchsia-500",
  gray: "bg-gray-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
  lightBlue: "bg-lightBlue-500",
  lime: "bg-lime-500",
  neutral: "bg-neutral-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  slate: "bg-slate-500",
  stone: "bg-stone-500",
  teal: "bg-teal-500",
  violet: "bg-violet-500",
  yellow: "bg-yellow-500",
  zinc: "bg-zinc-500",
};

export const TAILWIND_TEXT = {
  amber: "text-amber-700",
  blue: "text-blue-700",
  cyan: "text-cyan-700",
  emerald: "text-emerald-700",
  fuchsia: "text-fuchsia-700",
  gray: "text-gray-700",
  green: "text-green-700",
  indigo: "text-indigo-700",
  lightBlue: "text-lightBlue-700",
  lime: "text-lime-700",
  neutral: "text-neutral-700",
  orange: "text-orange-700",
  pink: "text-pink-700",
  purple: "text-purple-700",
  red: "text-red-700",
  rose: "text-rose-700",
  sky: "text-sky-700",
  slate: "text-slate-700",
  stone: "text-stone-700",
  teal: "text-teal-700",
  violet: "text-violet-700",
  yellow: "text-yellow-700",
  zinc: "text-zinc-700",
};

export const TYPES = ["income", "spent"];

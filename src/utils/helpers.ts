import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export function cn(...classname: ClassValue[]) {
  return twMerge(clsx(classname));
}

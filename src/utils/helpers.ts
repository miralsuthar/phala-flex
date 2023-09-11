import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";
import { createHash } from "crypto";

export function cn(...classname: ClassValue[]) {
  return twMerge(clsx(classname));
}

export function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

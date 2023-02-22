import { ClassValue, clsx } from "clsx";
import { useMutation } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { invoke, type InvokeArgs } from "@tauri-apps/api/tauri";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useInvoke(cmd: string, args?: InvokeArgs) {
  return useMutation(() => invoke(cmd, args));
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Type-safe Object.keys that preserves the key type of a Record. */
export function typedKeys<T extends Record<string, unknown>>(obj: T): (keyof T & string)[] {
  return Object.keys(obj)
}

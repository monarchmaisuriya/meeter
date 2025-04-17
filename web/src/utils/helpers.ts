import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function isNotEmpty<T>(value: T | null | undefined): value is T {
	return (
		value !== null &&
		value !== undefined &&
		value !== "" &&
		value !== false &&
		value !== 0
	)
}

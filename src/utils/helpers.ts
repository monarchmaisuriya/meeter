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

export function formatDateAndTime(date?: Date | string) {
	const d = date ? new Date(date) : new Date()
	const dateStr = d.toISOString().split("T")[0]
	const timeStr = d.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	})
	return `${dateStr}, ${timeStr}`
}

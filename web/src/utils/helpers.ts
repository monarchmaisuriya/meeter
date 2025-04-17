import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export { toast } from "sonner"
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

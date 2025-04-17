import { useState } from "react"

const nativeExceptions = [
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError,
]

function throwNative(error: unknown): never | void {
	if (nativeExceptions.some((Exception) => error instanceof Exception)) {
		throw error
	}
}

export function useClient() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const request = async <T>(
		promise: Promise<T>,
		finalFunction?: () => void
	): Promise<{ data: T | null; error: Error | null }> => {
		setLoading(true)
		setError(null)

		try {
			const result = await promise
			return { data: result, error: null }
		} catch (rawError) {
			throwNative(rawError)

			const handledError =
				rawError instanceof Error
					? rawError
					: new Error("An unexpected error occurred")

			setError(handledError)
			return { data: null, error: handledError }
		} finally {
			setLoading(false)
			finalFunction?.()
		}
	}

	return { request, loading, error }
}

import { useEffect } from "react"
import { client } from "@/utils/clients"
import { toast } from "@/utils/helpers"
import { useApp } from "./useApp"

const APP_ACCESS_TOKEN = "MEETER_JWT"

export function useAuth() {
	const { setUser, setMeetings } = useApp()

	const handleGoogleSignIn = () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/oauth/google`
	}

	const handleLogOut = () => {
		setUser(null)
		setMeetings(null)
		window.sessionStorage.removeItem(APP_ACCESS_TOKEN)
	}

	const parseTokenFromUrl = () => {
		const hash = window.location.hash.substring(1)
		const params = new URLSearchParams(hash)
		const error = params.get("error")
		if (error) {
			toast.error(`Authentication error: ${error}`)
			return null
		}
		return params.get("access_token")
	}

	const authenticateWithParamToken = async (token: string) => {
		try {
			const response = await client.authenticate({
				strategy: "jwt",
				accessToken: token,
			})
			setUser(response.user)
			setMeetings([])
			window.sessionStorage.setItem(APP_ACCESS_TOKEN, token)
			window.history.replaceState({}, document.title, window.location.pathname)
		} catch (error: unknown) {
			let errorMessage = "Authentication failed"
			if (error instanceof Error) {
				errorMessage = error.message
			} else if (typeof error === "string") {
				errorMessage = error
			}
			toast.error(`An error occurred : ${errorMessage}`)
			window.sessionStorage.removeItem(APP_ACCESS_TOKEN)
			setUser(null)
		}
	}

	const authenticateWithStoredToken = async () => {
		try {
			const response = await client.authenticate()
			setUser(response.user)
			setMeetings([])
		} catch {
			window.sessionStorage.removeItem(APP_ACCESS_TOKEN)
			setUser(null)
		}
	}

	useEffect(() => {
		const token = parseTokenFromUrl()
		if (token) {
			authenticateWithParamToken(token)
		} else if (window.sessionStorage.getItem(APP_ACCESS_TOKEN)) {
			authenticateWithStoredToken()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { handleGoogleSignIn, handleLogOut }
}

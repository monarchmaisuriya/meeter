import { AppContext } from "@/contexts/app"
import { User, Meeting } from "@/declarations"
import { ReactNode, useState, useEffect } from "react"

export function AppProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState({
		user: null as User | null,
		meetings: [] as Meeting[],
	})

	useEffect(() => {
		const storedUser = sessionStorage.getItem("user")
		const storedMeetings = sessionStorage.getItem("meetings")
		setState({
			user: storedUser ? JSON.parse(storedUser) : null,
			meetings: storedMeetings ? JSON.parse(storedMeetings) : [],
		})
	}, [])

	const updateUser = (newUser: User) => {
		setState((prev) => ({ ...prev, user: newUser }))
		sessionStorage.setItem("user", JSON.stringify(newUser))
	}

	const updateMeetings = (newMeetings: Meeting[]) => {
		setState((prev) => ({ ...prev, meetings: newMeetings }))
		sessionStorage.setItem("meetings", JSON.stringify(newMeetings))
	}

	return (
		<AppContext.Provider
			value={{
				...state,
				setUser: updateUser,
				setMeetings: updateMeetings,
			}}>
			{children}
		</AppContext.Provider>
	)
}

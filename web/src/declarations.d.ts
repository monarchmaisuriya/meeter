export type User = {
	name: string
	email: string
	photoURL: string
} | null

export type Meeting = {
	id: string
	title: string
	date: string
	link: string
} | null

export type AppContextType = {
	user: User
	setUser: (user: User) => void
	meetings: Meeting[]
	setMeetings: (meetings: Meeting[]) => void
}

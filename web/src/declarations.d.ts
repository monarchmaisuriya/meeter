export type User = {
	id: string
	googleId: string
	sub: string
	email: string
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
	meetings: Meeting[] | null
	setMeetings: (meetings: Meeting[] | null) => void
}

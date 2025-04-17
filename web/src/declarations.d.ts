export type User = {
	id: string
	googleId: string
	googleAccessToken: string
	googleExpiryDate: string
	googleRefreshToken: string
	idToken: string
	sub: string
	email: string
} | null

export type Meeting = {
	id: string
	title: string
	startDateTime: string
	endDateTime: string
	meetingLink?: string
	calendarLink: string
	createdBy: string
	attendees: string[]
}

export type AppContextType = {
	user: User
	setUser: (user: User) => void
	meetings: Meeting[] | null
	setMeetings: (meetings: Meeting[] | null) => void
}

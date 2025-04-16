import { IconGoogle, IconLogOut } from "@/components/local/icons"
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/useApp"

function HomePage() {
	const { user, setUser, meetings, setMeetings } = useApp()

	const handleGoogleSignIn = () => {
		// TODO: Implement Google Sign-in
		setUser({
			name: "Test User",
			email: "test@example.com",
			photoURL: "https://example.com/photo.jpg",
		})
	}

	const handleCreateMeeting = () => {
		// TODO: Implement meeting creation
		const newMeeting = {
			id: Date.now().toString(),
			title: "New Meeting",
			date: new Date().toISOString(),
			link: "https://meet.google.com/test",
		}
		setMeetings([...meetings, newMeeting])
	}

	const handleLogOut = () => {
		// TODO: Implement Google Sign-out
		setUser(null)
		setMeetings([])
	}

	if (!user) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col gap-12">
					<p className="text-lg font-medium">
						Meeter - Sign In using Google and create meetings with Google Meet
					</p>
					<Button
						variant="outline"
						className="flex items-center gap-2"
						onClick={handleGoogleSignIn}>
						<span>
							<IconGoogle />
						</span>
						Sign in with Google
					</Button>
				</div>
			</div>
		)
	} else {
		return (
			<div className="container mx-auto p-4">
				<div className="space-y-6">
					<div className="flex justify-between">
						<p className="font-bold">Meeter</p>
						<div className="flex gap-4">
							<Button onClick={handleCreateMeeting}>Create Meeting</Button>
							<Button
								className="cursor-pointer hover:text-red-500"
								variant={"ghost"}
								onClick={handleLogOut}>
								<IconLogOut />
							</Button>
						</div>
					</div>
					<div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
						<h2 className="text-lg font-semibold">Your Meetings</h2>
						<div className="mt-4">
							{meetings.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No meetings scheduled
								</p>
							) : (
								<div className="space-y-4">
									{meetings.map((meeting) => (
										<div
											key={meeting?.id}
											className="flex items-center justify-between rounded-lg border p-4">
											<div>
												<h3 className="font-medium">{meeting?.title}</h3>
												<p className="text-sm text-muted-foreground">
													{meeting?.date}
												</p>
											</div>
											<Button
												variant="outline"
												onClick={() => window.open(meeting?.link, "_blank")}>
												Join
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default HomePage

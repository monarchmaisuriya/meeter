import { IconGoogle, IconLogOut } from "@/components/local/icons"
import { Button } from "@/components/ui/button"
import { useApp } from "@/hooks/useApp"
import { useAuth } from "@/hooks/useAuth"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import Scheduler from "@/components/local/scheduler"
import { useEffect, useState } from "react"
import { formatDateAndTime, isNotEmpty, toast } from "@/utils/helpers"
import { useClient } from "@/hooks/useClient"
import { meetings as meetingsClient } from "@/utils/clients"
import { LoadingSpinner } from "@/components/local/spinner"
import { Meeting } from "@/declarations"

function HomePage() {
	const { user, meetings, setMeetings } = useApp()
	const { handleGoogleSignIn, handleLogOut: handleGoogleLogOut } = useAuth()
	const [dialogOpen, setDialogOpen] = useState(false)
	const { request: queryRequest, loading: queryLoading } = useClient()
	const { request: mutationRequest, loading: mutationLoading } = useClient()

	const fetchMeetings = async () => {
		const response = await queryRequest(
			meetingsClient.find({ query: { $limit: 100 } })
		)
		if (response?.error) {
			toast.error(
				`An error occurred while fetching meetings: ${response?.error?.message}`
			)
		} else {
			setMeetings(response?.data?.data || [])
		}
	}

	const createMeeting = async (meeting: Partial<Meeting>) => {
		const response = await mutationRequest(meetingsClient.create(meeting))
		if (response?.error) {
			toast.error(
				`An error occurred while creating meeting: ${response?.error?.message}`
			)
		} else {
			toast.success("Meeting created successfully")
			fetchMeetings()
		}
	}

	useEffect(() => {
		if (user) {
			fetchMeetings()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	if (queryLoading || mutationLoading) {
		return (
			<div className="min-h-screen flex justify-center align-middle items-center">
				<div className="flex flex-col gap-3 justify-center align-middle items-center">
					<LoadingSpinner />
					<p className="text-sm font-semibold">Please Wait ...</p>
				</div>
			</div>
		)
	} else {
		if (!user) {
			return (
				<div className="flex min-h-screen items-center justify-center">
					<div className="flex flex-col gap-12 text-center">
						<div className="text-xl font-medium">Meeter</div>
						<div className="text-sm font-medium">
							Sign in via Google and set up meetings on Google Meet.
						</div>
						<Button
							variant="outline"
							className="flex items-center gap-4 cursor-pointer"
							onClick={handleGoogleSignIn}>
							<span>
								<IconGoogle />
							</span>
							Sign In With Google
						</Button>
					</div>
				</div>
			)
		} else {
			return (
				<>
					<div className="container mx-auto p-4">
						<div className="space-y-6">
							<div className="flex justify-between">
								<div className="flex gap-2">
									<div className="font-bold">Meeter</div>
									<div className="font-bold text-xs text-gray-400">
										({user?.email})
									</div>
								</div>
								<div className="flex gap-4">
									<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
										<DialogTrigger className="cursor-pointer bg-white rounded-md h-9 px-4 py-2 text-sm text-black">
											Create Meeting
										</DialogTrigger>
										<DialogContent className="min-w-[90%] md:min-w-1/2 p-4">
											<DialogHeader>
												<DialogTitle>Create a Meeting</DialogTitle>
												<DialogDescription>
													<Scheduler
														setDialogOpen={setDialogOpen}
														onCreateMeeting={async (
															meeting: Partial<Meeting>
														) => {
															await createMeeting(meeting)
														}}
													/>
												</DialogDescription>
											</DialogHeader>
										</DialogContent>
									</Dialog>
									<Button
										className="cursor-pointer hover:text-red-500"
										variant={"ghost"}
										onClick={handleGoogleLogOut}>
										<IconLogOut />
									</Button>
								</div>
							</div>
							<div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
								<h2 className="text-lg font-semibold">Your Meetings</h2>
								<div className="mt-4">
									{meetings?.length === 0 ? (
										<div className="text-sm text-muted-foreground">
											No meetings scheduled
										</div>
									) : (
										<div className="space-y-4">
											{meetings?.map((event, idx) => (
												<div
													key={event?.id || idx}
													className="flex items-center justify-between rounded-lg border p-4">
													<div>
														<h3
															className="font-medium cursor-pointer hover:underline"
															onClick={() =>
																window.open(event?.calendarLink, "_blank")
															}>
															{event?.title}
														</h3>
														<div className="text-sm text-muted-foreground">
															{event?.startDateTime &&
																formatDateAndTime(event?.startDateTime)}
														</div>
													</div>
													{isNotEmpty(event?.meetingLink) && (
														<Button
															variant="outline"
															onClick={() =>
																window.open(event?.meetingLink, "_blank")
															}>
															Join
														</Button>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)
		}
	}
}

export default HomePage

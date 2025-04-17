import React, { useEffect, useState } from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SchedulerProps {
	availableTimes?: string[]
	onCreateMeeting: (type: string, meeting?: unknown) => void
	onMeetingTypeChange: (type: string) => void
	setDialogOpen: (open: boolean) => void
}

const Scheduler: React.FC<SchedulerProps> = ({
	availableTimes = [],
	onCreateMeeting,
	onMeetingTypeChange,
	setDialogOpen,
}) => {
	const [meetingType, setMeetingType] = useState<"instant" | "scheduled">(
		"scheduled"
	)
	const [selectedTime, setSelectedTime] = useState<string>("")
	const [meetingLink, setMeetingLink] = useState<string>("")
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
	const [duration, setDuration] = useState<string>("30")
	const [eventDescription, setEventDescription] = useState<string>("")
	const [attendees, setAttendees] = useState<string[]>([])

	const defaultTimes = [
		"09:00",
		"09:30",
		"10:00",
		"10:30",
		"11:00",
		"11:30",
		"13:00",
		"13:30",
		"14:00",
		"14:30",
		"15:00",
		"15:30",
		"16:00",
		"16:30",
		"17:00",
	]

	const times = availableTimes.length > 0 ? availableTimes : defaultTimes

	const handleTimeClick = (time: string) => {
		setSelectedTime(time)
	}

	useEffect(() => {
		onMeetingTypeChange(meetingType)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [meetingType])

	if (meetingType === "scheduled") {
		return (
			<div className="p-4">
				<div className="my-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Event Attendees
					</label>
					<Input
						type="text"
						value={attendees}
						onChange={(e) =>
							setAttendees((prev) => {
								return [...new Set([...prev, e.target.value])]
							})
						}
						placeholder="Email addresses as comma separated values"
					/>
				</div>
				<div className="flex flex-col sm:flex-row sm:space-x-8">
					<div className="flex-1">
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Event Description
							</label>
							<Input
								type="text"
								value={eventDescription}
								onChange={(e) => setEventDescription(e.target.value)}
								placeholder="Why create this meeting?"
							/>
						</div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Available Dates
						</label>
						<Calendar
							mode="single"
							disabled={{ before: new Date() }}
							selected={selectedDate}
							onSelect={setSelectedDate}
						/>
					</div>

					<div className="flex-shrink-0 w-full sm:w-64">
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Duration
							</label>
							<Select
								value={duration}
								onValueChange={(value) => setDuration(value)}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent className="w-[180px]">
									<SelectItem value="30">30 minutes</SelectItem>
									<SelectItem value="60">60 minutes</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Available Times
						</label>
						<div className="grid grid-cols-2 gap-2">
							{times.map((time) => (
								<Button
									key={time}
									variant={selectedTime === time ? "default" : "outline"}
									onClick={() => handleTimeClick(time)}
									size={"xs"}>
									{time}
								</Button>
							))}
						</div>
					</div>
				</div>
				<div className="flex justify-center flex-col gap-2">
					<Button
						variant="default"
						className="cursor-pointer"
						onClick={() => {
							onCreateMeeting("scheduled", {
								date: selectedDate,
								time: selectedTime,
								duration: duration,
								description: eventDescription,
							})
							setDialogOpen(false)
						}}>
						Schedule Meeting
					</Button>
					<Button
						variant={"link"}
						className="cursor-pointer"
						onClick={() => {
							setMeetingType("instant")
							onCreateMeeting("instant")
							setMeetingLink("https://gemini.google.com/app")
						}}>
						Or Create an Instant Meeting
					</Button>
				</div>
			</div>
		)
	} else {
		return (
			<div className="p-4">
				<div className="my-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Meeting Link
					</label>
					<Input
						type="text"
						value={meetingLink}
						placeholder="Use this link to join the meeting"
					/>
				</div>
				<div className="flex justify-center flex-col gap-2">
					<Button
						className="cursor-pointer"
						variant="default"
						onClick={() => {
							if (meetingLink) {
								window.open(meetingLink, "_blank")
								setDialogOpen(false)
							}
						}}>
						Join Meeting
					</Button>
					<Button
						variant={"link"}
						className="cursor-pointer"
						onClick={() => {
							setMeetingType("scheduled")
							setMeetingLink("")
						}}>
						Or Schedule a Meeting
					</Button>
				</div>
			</div>
		)
	}
}

export default Scheduler

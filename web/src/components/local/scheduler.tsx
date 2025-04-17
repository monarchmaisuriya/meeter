import React, { useState } from "react"
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
import { Meeting } from "@/declarations"
import { toast } from "sonner"

interface SchedulerProps {
	availableTimes?: string[]
	onCreateMeeting: (meeting: Partial<Meeting>) => Promise<unknown>
	setDialogOpen: (open: boolean) => void
}

const Scheduler: React.FC<SchedulerProps> = ({
	availableTimes = [],
	onCreateMeeting,
	setDialogOpen,
}) => {
	const [selectedTime, setSelectedTime] = useState<string>("09:00")
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
	const [duration, setDuration] = useState<string>("30")
	const [eventTitle, setEventTitle] = useState<string>("")
	const [attendees, setAttendees] = useState<string>("")

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

	return (
		<div className="p-4">
			<div className="my-4">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Event Attendees
				</label>
				<Input
					type="text"
					value={attendees}
					onChange={(e) => setAttendees(e.target.value)}
					placeholder="Email addresses as comma separated values"
				/>
			</div>
			<div className="flex flex-col sm:flex-row sm:space-x-8">
				<div className="flex-1">
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Event Title
						</label>
						<Input
							type="text"
							value={eventTitle}
							onChange={(e) => setEventTitle(e.target.value)}
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
					onClick={async () => {
						if (attendees.length === 0) {
							toast.error("Please add at least one attendee")
						} else {
							if (!selectedDate || !selectedTime || !duration) return
							const [hours, minutes] = selectedTime.split(":").map(Number)
							const startDateTime = new Date(selectedDate)
							startDateTime.setHours(hours, minutes, 0, 0)
							const endDateTime = new Date(startDateTime)
							endDateTime.setMinutes(
								endDateTime.getMinutes() + parseInt(duration, 10)
							)
							await onCreateMeeting({
								startDateTime: startDateTime.toISOString(),
								endDateTime: endDateTime.toISOString(),
								title: eventTitle,
								attendees: attendees.split(",").map((email) => email.trim()),
							})
							setDialogOpen(false)
						}
					}}>
					Schedule Meeting
				</Button>
				<Button
					variant={"link"}
					className="cursor-pointer"
					onClick={async () => {
						const now = new Date()
						const startDateTime = new Date(now)
						const endDateTime = new Date(startDateTime)
						endDateTime.setMinutes(
							startDateTime.getMinutes() + parseInt(duration, 10)
						)
						await onCreateMeeting({
							startDateTime: startDateTime.toISOString(),
							endDateTime: endDateTime.toISOString(),
							title: "Instant Meeting",
							attendees:
								attendees.length > 0
									? attendees.split(",").map((email) => email.trim())
									: [],
						})
						setDialogOpen(false)
					}}>
					Or Create an Instant Meeting
				</Button>
			</div>
		</div>
	)
}

export default Scheduler

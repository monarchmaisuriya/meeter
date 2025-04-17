// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from "@feathersjs/schema"
import { Type, getValidator, querySyntax } from "@feathersjs/typebox"
import type { Static } from "@feathersjs/typebox"

import type { HookContext } from "../../declarations"
import { dataValidator, queryValidator } from "../../utils/validators"
import type { MeetingsService } from "./meetings.class"

// Main data model schema
export const meetingsSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: "Meetings", additionalProperties: false }
)
export type Meetings = Static<typeof meetingsSchema>
export const meetingsValidator = getValidator(meetingsSchema, dataValidator)
export const meetingsResolver = resolve<Meetings, HookContext<MeetingsService>>({})

export const meetingsExternalResolver = resolve<Meetings, HookContext<MeetingsService>>({})

// Schema for creating new entries
export const meetingsDataSchema = Type.Pick(meetingsSchema, ["text"], {
  $id: "MeetingsData"
})
export type MeetingsData = Static<typeof meetingsDataSchema>
export const meetingsDataValidator = getValidator(meetingsDataSchema, dataValidator)
export const meetingsDataResolver = resolve<Meetings, HookContext<MeetingsService>>({})

// Schema for updating existing entries
export const meetingsPatchSchema = Type.Partial(meetingsSchema, {
  $id: "MeetingsPatch"
})
export type MeetingsPatch = Static<typeof meetingsPatchSchema>
export const meetingsPatchValidator = getValidator(meetingsPatchSchema, dataValidator)
export const meetingsPatchResolver = resolve<Meetings, HookContext<MeetingsService>>({})

// Schema for allowed query properties
export const meetingsQueryProperties = Type.Pick(meetingsSchema, ["id", "text"])
export const meetingsQuerySchema = Type.Intersect(
  [
    querySyntax(meetingsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type MeetingsQuery = Static<typeof meetingsQuerySchema>
export const meetingsQueryValidator = getValidator(meetingsQuerySchema, queryValidator)
export const meetingsQueryResolver = resolve<MeetingsQuery, HookContext<MeetingsService>>({})

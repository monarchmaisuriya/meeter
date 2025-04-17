// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { AdapterParams, AdapterQuery, PaginationOptions } from "@feathersjs/adapter-commons"
import type { Paginated } from "@feathersjs/feathers"
import { google } from "googleapis"
import type { Application } from "../../declarations"
import type { Meetings, MeetingsData, MeetingsQuery } from "./meetings.schema"
import { NotAuthenticated } from "@feathersjs/errors"
import { Logger } from "winston"

export type { Meetings, MeetingsData, MeetingsQuery }

export interface MeetingsServiceOptions {
  app: Application
  logger: Logger
}

export interface MeetingsParams extends AdapterParams<AdapterQuery> {}

export class MeetingsService<ServiceParams extends MeetingsParams = MeetingsParams> {
  app: Application
  logger: Logger
  //TODO: Fix type check for configuration schema
  oauth: any

  constructor(options: MeetingsServiceOptions) {
    this.app = options.app
    this.logger = options.logger
    //TODO: Fix type check for configuration schema
    this.oauth = this.app.get("authentication")?.oauth as any
  }

  async find(params?: ServiceParams & { paginate?: PaginationOptions }): Promise<Paginated<Meetings>> {
    const user = params?.user

    if (!user) {
      throw new NotAuthenticated("User not authenticated")
    }

    // Check if we have Google OAuth credentials
    if (!this.oauth?.google?.key || !this.oauth?.google?.secret) {
      throw new NotAuthenticated("Google OAuth not configured")
    }

    const auth = new google.auth.OAuth2(
      this.oauth?.google?.key ?? "",
      this.oauth?.google?.secret ?? "",
      this.oauth?.redirect ?? ""
    )

    // Get Google OAuth tokens from user's account
    const userService = this.app.service("users")
    const googleAccount = await userService.get(user.id, {
      query: {
        $select: ["googleAccessToken", "googleRefreshToken", "googleExpiryDate"]
      }
    })

    if (!googleAccount.googleAccessToken) {
      throw new NotAuthenticated("User not authenticated with Google")
    }

    auth.setCredentials({
      access_token: googleAccount.googleAccessToken,
      refresh_token: googleAccount.googleRefreshToken,
      expiry_date: googleAccount.googleExpiryDate
    })

    try {
      const { credentials } = await auth.refreshAccessToken()
      auth.setCredentials(credentials)
    } catch (error) {
      this.logger.error("Error refreshing access token:", error)
      throw new NotAuthenticated("Invalid or expired authentication tokens")
    }

    const calendar = google.calendar({ version: "v3", auth })

    try {
      const limit = params?.query?.$limit || 50

      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: limit,
        singleEvents: true,
        orderBy: "startTime"
      })

      const meetings =
        response.data.items?.map(event => ({
          id: event.id || Date.now().toString(),
          title: event.summary || "",
          description: event.description || "",
          startDateTime: event.start?.dateTime || "",
          endDateTime: event.end?.dateTime || "",
          meetingLink: event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri || "",
          calendarLink: event.htmlLink || "",
          createdBy: event.creator?.email || event.organizer?.email || "",
          attendees: event.attendees?.map(attendee => attendee.email || "")
        })) || []

      return {
        total: meetings.length,
        limit,
        skip: 0,
        data: meetings
      }
    } catch (error) {
      this.logger.error("Error fetching Google Meet meetings:", error)
      throw error
    }
  }

  async create(data: MeetingsData, params?: ServiceParams): Promise<Meetings> {
    const user = params?.user
    if (!user) {
      throw new NotAuthenticated("User not authenticated")
    }

    // Check if we have Google OAuth credentials
    if (!this.oauth?.google?.key || !this.oauth?.google?.secret) {
      throw new NotAuthenticated("Google OAuth not configured")
    }

    const auth = new google.auth.OAuth2(
      this.oauth?.google?.key ?? "",
      this.oauth?.google?.secret ?? "",
      this.oauth?.redirect ?? ""
    )

    // Get Google OAuth tokens from user's account
    const userService = this.app.service("users")
    const googleAccount = await userService.get(user.id, {
      query: {
        $select: ["googleAccessToken", "googleRefreshToken", "googleExpiryDate"]
      }
    })

    if (!googleAccount.googleAccessToken) {
      throw new NotAuthenticated("User not authenticated with Google")
    }

    auth.setCredentials({
      access_token: googleAccount.googleAccessToken,
      refresh_token: googleAccount.googleRefreshToken,
      expiry_date: googleAccount.googleExpiryDate
    })
    const calendar = google.calendar({ version: "v3", auth })

    const event = {
      summary: data.title,
      description: data.description ?? "",
      start: {
        dateTime: data.startDateTime,
        timeZone: "UTC"
      },
      end: {
        dateTime: data.endDateTime,
        timeZone: "UTC"
      },
      attendees: data.attendees?.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      }
    }

    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        requestBody: event
      })

      return {
        ...data,
        id: Date.now().toString(),
        meetingLink:
          response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || undefined
      }
    } catch (error) {
      this.logger.error("Error creating Google Meet meeting:", error)
      throw error
    }
  }
}

export const getOptions = (app: Application, logger: Logger) => {
  return { app, logger }
}

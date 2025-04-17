// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from "@feathersjs/authentication"

import { hooks as schemaHooks } from "@feathersjs/schema"

import {
  meetingsDataValidator,
  meetingsQueryValidator,
  meetingsResolver,
  meetingsExternalResolver,
  meetingsDataResolver,
  meetingsQueryResolver
} from "./meetings.schema"

import type { Application } from "../../declarations"
import { MeetingsService, getOptions } from "./meetings.class"
import { logger } from "../../utils/logger"

export const meetingsPath = "meetings"
export const meetingsMethods: Array<keyof MeetingsService> = ["find", "create"]

export * from "./meetings.class"
export * from "./meetings.schema"

// A configure function that registers the service and its hooks via `app.configure`
export const meetings = (app: Application) => {
  // Register our service on the Feathers application
  app.use(meetingsPath, new MeetingsService(getOptions(app, logger)), {
    // A list of all methods this service exposes externally
    methods: meetingsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(meetingsPath).hooks({
    around: {
      all: [
        authenticate("jwt"),
        schemaHooks.resolveExternal(meetingsExternalResolver),
        schemaHooks.resolveResult(meetingsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(meetingsQueryValidator),
        schemaHooks.resolveQuery(meetingsQueryResolver)
      ],
      find: [],
      create: [schemaHooks.validateData(meetingsDataValidator), schemaHooks.resolveData(meetingsDataResolver)]
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    [meetingsPath]: MeetingsService
  }
}

// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  meetingsDataValidator,
  meetingsPatchValidator,
  meetingsQueryValidator,
  meetingsResolver,
  meetingsExternalResolver,
  meetingsDataResolver,
  meetingsPatchResolver,
  meetingsQueryResolver
} from './meetings.schema'

import type { Application } from '../../declarations'
import { MeetingsService, getOptions } from './meetings.class'

export const meetingsPath = 'meetings'
export const meetingsMethods: Array<keyof MeetingsService> = ['find', 'get', 'create', 'patch', 'remove']

export * from './meetings.class'
export * from './meetings.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const meetings = (app: Application) => {
  // Register our service on the Feathers application
  app.use(meetingsPath, new MeetingsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: meetingsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(meetingsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
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
      get: [],
      create: [
        schemaHooks.validateData(meetingsDataValidator),
        schemaHooks.resolveData(meetingsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(meetingsPatchValidator),
        schemaHooks.resolveData(meetingsPatchResolver)
      ],
      remove: []
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
declare module '../../declarations' {
  interface ServiceTypes {
    [meetingsPath]: MeetingsService
  }
}

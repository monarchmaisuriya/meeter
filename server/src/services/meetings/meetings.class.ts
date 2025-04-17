// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { AdapterParams, AdapterQuery } from "@feathersjs/adapter-commons"

import type { Application } from "../../declarations"
import type { Meetings, MeetingsData, MeetingsPatch, MeetingsQuery } from "./meetings.schema"

import { MemoryService } from "@feathersjs/memory"

export type { Meetings, MeetingsData, MeetingsPatch, MeetingsQuery }

export interface MeetingsServiceOptions {
  app: Application
  id?: string
}

export interface MeetingsParams extends AdapterParams<AdapterQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class MeetingsService<ServiceParams extends MeetingsParams = MeetingsParams> extends MemoryService<
  Meetings,
  MeetingsData,
  ServiceParams,
  MeetingsPatch
> {
  constructor(options: MeetingsServiceOptions) {
    const { app, ...memoryOptions } = options
    super({
      id: "id",
      ...memoryOptions
    })
  }
}

export const getOptions = (app: Application) => {
  return { app }
}

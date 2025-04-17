// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { AdapterParams, AdapterQuery } from "@feathersjs/adapter-commons"

import type { Application } from "@/declarations"
import type { User, UserData, UserPatch, UserQuery } from "./users.schema"

import { MemoryService } from "@feathersjs/memory"

export type { User, UserData, UserPatch, UserQuery }

export interface UserServiceOptions {
  app: Application
  id?: string
}

export interface UserParams extends AdapterParams<AdapterQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class UserService<ServiceParams extends UserParams = UserParams> extends MemoryService<
  User,
  UserData,
  ServiceParams,
  UserPatch
> {
  constructor(options: UserServiceOptions) {
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

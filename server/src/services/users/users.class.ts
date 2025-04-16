// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from "@feathersjs/feathers"

import type { Application } from "@/declarations"
import type { User, UserData, UserPatch, UserQuery } from "./users.schema"

export type { User, UserData, UserPatch, UserQuery }

export interface UserServiceOptions {
  app: Application
}

export interface UserParams extends Params<UserQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class UserService<ServiceParams extends UserParams = UserParams>
  implements ServiceInterface<User, UserData, ServiceParams, UserPatch>
{
  constructor(public options: UserServiceOptions) {}

  async find(_params?: ServiceParams): Promise<User[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<User> {
    return {
      id: 0,
      googleId: `A new message with ID: ${id}!`
    }
  }

  async create(data: UserData, params?: ServiceParams): Promise<User>
  async create(data: UserData[], params?: ServiceParams): Promise<User[]>
  async create(data: UserData | UserData[], params?: ServiceParams): Promise<User | User[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: UserData, _params?: ServiceParams): Promise<User> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: UserPatch, _params?: ServiceParams): Promise<User> {
    return {
      id: 0,
      googleId: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<User> {
    return {
      id: 0,
      googleId: "removed"
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}

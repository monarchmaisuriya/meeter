// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from "@feathersjs/schema"
import { Type, getValidator, querySyntax } from "@feathersjs/typebox"
import type { Static } from "@feathersjs/typebox"

import type { HookContext } from "@/declarations"
import { dataValidator, queryValidator } from "../../utils/validators"
import type { UserService } from "./users.class"

// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.Number(),
    googleId: Type.String(),
    email: Type.Optional(Type.String()),
    googleAccessToken: Type.Optional(Type.String()),
    googleRefreshToken: Type.Optional(Type.String()),
    googleExpiryDate: Type.Optional(Type.Number()),
    idToken: Type.Optional(Type.String()),
    sub: Type.Optional(Type.String())
  },
  { $id: "User", additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext<UserService>>({})

export const userExternalResolver = resolve<User, HookContext<UserService>>({})

// Schema for creating new entries
export const userDataSchema = Type.Pick(
  userSchema,
  ["googleId", "email", "sub", "googleAccessToken", "googleRefreshToken", "googleExpiryDate", "idToken"],
  {
    $id: "UserData"
  }
)
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext<UserService>>({})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: "UserPatch"
})
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext<UserService>>({})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, [
  "id",
  "googleId",
  "email",
  "googleAccessToken",
  "googleRefreshToken",
  "googleExpiryDate"
])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user.id
    }

    return value
  }
})

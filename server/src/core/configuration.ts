import { Type, getValidator, defaultAppConfiguration } from "@feathersjs/typebox"
import type { Static } from "@feathersjs/typebox"

import { dataValidator } from "../utils/validators"

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    host: Type.Optional(Type.String()),
    port: Type.Optional(Type.Number()),
    public: Type.Optional(Type.String())
  })
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)

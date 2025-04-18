// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import "dotenv/config"
import { feathers } from "@feathersjs/feathers"
import configuration from "@feathersjs/configuration"
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors } from "@feathersjs/koa"
import morgan from "koa-morgan"
import { configurationValidator } from "./core/configuration"
import type { Application } from "./declarations"
import { logError } from "./hooks/log-error"
import { authentication } from "./core/authentication"
import { services } from "./services"
import { logger } from "./utils/logger"

const app: Application = koa(feathers())

app.use(morgan("dev"))

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors({ origin: "*", credentials: true }))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())

app.configure(authentication)
app.configure(services)

Object.keys(app.services).forEach(path => {
  logger.info(`Registered service route: /${path}`)
})

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }

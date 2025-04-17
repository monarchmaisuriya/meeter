import { app } from "./app"
import { logger } from "./utils/logger"

const port = app.get("port") ?? 3030
const host = app.get("host") ?? "localhost"
const env = process.env.NODE_ENV || ""

process.on("unhandledRejection", reason => logger.error("Unhandled Rejection %O", reason))

app.listen(port).then(() => {
  logger.info(`${env}: Feathers app listening on http://${host}:${port}`)
})

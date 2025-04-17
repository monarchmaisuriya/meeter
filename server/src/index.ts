import path from "path"
import fs from "fs"
import { app } from "./app"
import { logger } from "./utils/logger"

const port = app.get("port") ?? 3030
const host = app.get("host") ?? "localhost"
const env = process.env.NODE_ENV || ""

process.on("unhandledRejection", reason => logger.error("Unhandled Rejection %O", reason))

app.listen(port).then(async () => {
  const configDir = path.resolve(__dirname, "../config")
  try {
    const configFiles = await fs.promises.readdir(configDir)
    logger.info(
      `Loaded ${configFiles.length} config files from ${configDir}/ \n${configFiles.map(file => `- ${file}`).join("\n")}`
    )
  } catch (err) {
    logger.error("Config directory not found:", err)
  }
  logger.info(`${env}: Feathers app listening on http://${host}:${port}`)
})

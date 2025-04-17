import { feathers } from "@feathersjs/feathers"
import rest from "@feathersjs/rest-client"
import authentication from "@feathersjs/authentication-client"

export const BASE_URL = import.meta.env.VITE_API_URL

const REST = rest(BASE_URL)
const app = feathers()

app.configure(REST.fetch(window.fetch.bind(window)))
app.configure(authentication())

const auth = app.service("authentication")

export { app as client, auth }

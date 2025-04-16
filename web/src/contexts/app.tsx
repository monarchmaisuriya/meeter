import { AppContextType } from "@/declarations"
import { createContext } from "react"

export const AppContext = createContext<AppContextType | undefined>(undefined)

import HomePage from "@/pages/home"
import { useTheme } from "@/hooks/useTheme"
import { AppProvider } from "@/providers/app"

function App() {
	useTheme()
	return (
		<AppProvider>
			<div className="min-h-screen bg-background text-foreground p-4">
				<HomePage />
			</div>
		</AppProvider>
	)
}
export default App

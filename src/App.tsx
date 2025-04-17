import HomePage from "@/pages/home"
import { useTheme } from "@/hooks/useTheme"
import { AppProvider } from "@/providers/app"
import { Toaster } from "@/components/ui/sonner"

function App() {
	useTheme()
	return (
		<AppProvider>
			<Toaster />
			<div className="min-h-screen bg-background text-foreground p-4">
				<HomePage />
			</div>
		</AppProvider>
	)
}
export default App

import { useRoutes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from './routes'
import Toast from './components/ui/Toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000
    }
  }
})

export default function App() {
  const element = useRoutes(routes)

  return (
    <QueryClientProvider client={queryClient}>
      {element}
      <Toast />
    </QueryClientProvider>
  )
}

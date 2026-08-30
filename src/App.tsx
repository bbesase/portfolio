import { RouterProvider, useRouter } from './router'
import Home from './pages/Home'
import Journey from './pages/Journey'

function Routes() {
  const { path } = useRouter()
  if (path === '/journey') return <Journey />
  return <Home />
}

function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  )
}

export default App

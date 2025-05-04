import AppBar from './components/AppBar.tsx'
import AppBody from './components/AppBody.tsx'
import { ThemeProvider } from '@mui/material'
import theme from './theme.ts'
import './App.css'

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
    <AppBar />
    <AppBody />
    </ThemeProvider>
    </>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'



const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', 'blackAlpha.900')(props),
    },
  }),
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  }
}

const theme = extendTheme({
  colors,
  config,
  styles,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>


      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          {/* // Wrap the App component with SocketContextProvider to enable socket access */}
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    
    </RecoilRoot>

  </StrictMode>,
)

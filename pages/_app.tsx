import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3296fa',
      contrastText: '#fff',
    },
    background: {
      paper: '#282828',
      default: '#1D1D1D',
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
    },
  },
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp

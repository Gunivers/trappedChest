import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { SnackbarProvider } from 'notistack';
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
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    h1: {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: "80px",
      fontWeight: 400,
      lineHeight: "1em",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: "60px",
      fontWeight: 400,
      lineHeight: "1em",
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: "25px",
      fontWeight: 400,
      lineHeight: "1em",
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: "25px",
      fontWeight: 400,
      lineHeight: "1em",
      letterSpacing: 0,
    },
    h5: {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: "20px",
      fontWeight: 400,
      lineHeight: "1.5em",
      letterSpacing: 0,
    },
    h6: {
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "1.43em",
      letterSpacing: 0,
    },

  },
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  )
}

export default MyApp

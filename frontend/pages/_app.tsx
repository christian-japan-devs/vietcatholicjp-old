import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { initInjector } from '../di'

function MyApp({ Component, pageProps }: AppProps) {
  initInjector()
  return <Component {...pageProps} />
}

export default MyApp

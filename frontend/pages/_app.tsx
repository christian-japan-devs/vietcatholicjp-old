<<<<<<< HEAD
import type { AppProps } from 'next/app'
import { initInjector } from '../di'
=======
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { initInjector } from '../di';
import { appWithTranslation } from 'next-i18next';
>>>>>>> main

function MyApp({ Component, pageProps }: AppProps) {
  initInjector()
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)

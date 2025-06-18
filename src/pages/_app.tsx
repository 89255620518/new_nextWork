
import type { AppProps } from 'next/app';
import { BasketProvider } from '../context/BasketContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <BasketProvider>
        <Component {...pageProps} />
        </BasketProvider>
    );
}

export default MyApp;

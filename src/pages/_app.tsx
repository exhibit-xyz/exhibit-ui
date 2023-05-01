import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig } from 'wagmi';
import { useEffect } from 'react';
import { client } from '../lib/wagmi';
import { SWRConfig } from 'swr';
import { ConnectKitProvider, ConnectKitButton } from 'connectkit';

const refreshInterval = 1000 * 60; // 1 minute

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    client.autoConnect().then();
  }, []);

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme='nouns'>
        <div className='m-4 flex justify-end'>
          <ConnectKitButton />
        </div>
        <SWRConfig
          value={{
            refreshInterval,
            fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

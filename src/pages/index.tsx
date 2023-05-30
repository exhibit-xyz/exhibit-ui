import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { NextPageContext } from 'next'
import { useEffect, useState } from 'react'
import { client } from '@/lib/wagmi'

const inter = Inter({ subsets: ['latin'] })

type HomePageProps = {}

export default function Home ({}: HomePageProps) {
  const { address, isConnected } = useAccount()

  // https://codingwithmanny.medium.com/understanding-hydration-errors-in-nextjs-13-with-a-web3-wallet-connection-8155c340fbd5
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) return null

  return (
    <>
      <header className='m-4 flex justify-end'>
        <ConnectKitButton />
      </header>
      <main>
        {isConnected && (
          <Image
            src='https://noun-api.com/beta/pfp'
            alt='Queried public API'
            width={100}
            height={100}
          />
        )}
      </main>
    </>
  )
}

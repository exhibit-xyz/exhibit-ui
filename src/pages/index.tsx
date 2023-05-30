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
      <header className='header flex justify-end'>
        <ConnectKitButton />
      </header>
      <main>
        <Image
          src='https://noun-api.com/beta/pfp'
          alt='Queried public API'
          width={800}
          height={800}
          className='nft rounded-md'
        />
        {isConnected && (
          <section>
            <h2>Ad auction</h2>
            <form>
              <label className='block'>
                <span className='text-gray-700 dark:text-gray-300'>
                  Bid amount (cryptocurrency)
                </span>
                <input
                  type='number'
                  className='mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0'
                  placeholder='100'
                />
              </label>
              <label className='block'>
                <span className='text-gray-700 dark:text-gray-300'>
                  Duration (days)
                </span>
                <input
                  type='number'
                  className='mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0'
                  placeholder='30'
                />
              </label>
              <label className='block'>
                <span className='text-gray-700 dark:text-gray-300'>
                  Mask data (SVG)
                </span>
                <input
                  type='file'
                  className='mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0'
                  accept='image/xml+svg'
                />
              </label>
            </form>
          </section>
        )}
      </main>
    </>
  )
}

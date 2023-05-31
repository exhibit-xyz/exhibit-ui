import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { NextPageContext } from 'next'
import { useEffect, useState } from 'react'
import { client } from '@/lib/wagmi'
import Header from '@/components/Header'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

const COOLDOWN = 15 * 60 * 1000

const time = (duration: number) =>
  `${Math.floor(duration / 1000 / 60)}:${(Math.floor(duration / 1000) % 60)
    .toString()
    .padStart(2, '0')}`

type NftPageProps = {}

export default function NftPage ({}: NftPageProps) {
  const router = useRouter()

  const { address, isConnected } = useAccount()
  const [cooldown, setCooldown] = useState<number | null>(null)
  const [now, setNow] = useState<number>(Date.now)

  useEffect(() => {
    if (cooldown) {
      setNow(Date.now())
      const intervalId = setInterval(() => {
        setNow(Date.now())
        if (Date.now() >= cooldown) {
          setCooldown(null)
        }
      }, 1000)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [cooldown])

  // https://codingwithmanny.medium.com/understanding-hydration-errors-in-nextjs-13-with-a-web3-wallet-connection-8155c340fbd5
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) return null

  return (
    <>
      <Header />
      <main>
        <Image
          src={`https://noun-api.com/beta/pfp?_=${router.query.slug}`}
          alt={`Queried public API; NFT ${router.query.slug}`}
          width={800}
          height={800}
          className='nft rounded-md'
        />
        {isConnected && (
          <section>
            <h2>Ad auction</h2>
            <form
              onSubmit={e => {
                e.preventDefault()

                setCooldown(Date.now() + COOLDOWN)

                // TODO
                console.log(new FormData(e.currentTarget))
              }}
            >
              <label className='block'>
                <span className='text-gray-700 dark:text-gray-300'>
                  Bid amount (cryptocurrency)
                </span>
                <input
                  type='number'
                  name='bid'
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
                  name='duration'
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
                  name='mask'
                  className='mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0'
                  accept='.svg'
                />
              </label>
              <div className='flex gap-4'>
                {cooldown === null ? (
                  <button className='flex-1 rounded-md mt-1 h-12 bg-blue-500 text-white'>
                    Bid
                  </button>
                ) : (
                  <button
                    className='flex-1 rounded-md mt-1 h-12 bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-400'
                    disabled
                  >
                    Wait {time(cooldown - now)} to bid again
                  </button>
                )}
                <button
                  className='flex-1 rounded-md mt-1 h-12 bg-orange-500 text-white'
                  type='button'
                >
                  Settle
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </>
  )
}

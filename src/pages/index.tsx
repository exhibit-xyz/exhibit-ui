import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { NextPageContext } from 'next'
import { useEffect, useState } from 'react'
import { client } from '@/lib/wagmi'

const inter = Inter({ subsets: ['latin'] })

const COOLDOWN = 15 * 60 * 1000

const time = (duration: number) =>
  `${Math.floor(duration / 1000 / 60)}:${(Math.floor(duration / 1000) % 60)
    .toString()
    .padStart(2, '0')}`

type HomePageProps = {}

export default function Home ({}: HomePageProps) {
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
      <header className='header flex justify-end'>
        {isConnected && (
          <button className='mr-4 notif-btn'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
              />
            </svg>
            <span className='notif-dot bg-red-500 rounded-full w-1 h-1'>1</span>
          </button>
        )}
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

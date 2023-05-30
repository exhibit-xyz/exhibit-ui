import Header from '@/components/Header'
import { ConnectKitButton } from 'connectkit'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export type NotificationsProps = {}

export default function Notifications ({}: NotificationsProps) {
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
      {isConnected ? (
        <main>
          <h1>Notifications</h1>
          <article className='border dark:border-gray-800 p-4 rounded-md mt-4'>
            <h2>Someone wants to advertise on your NFT</h2>
            <p>
              <a href='#' className='text-blue-500'>
                View mask
              </a>
            </p>
            <button className='text-white bg-blue-500 rounded-md w-full h-12 mt-4'>
              Approve
            </button>
          </article>
        </main>
      ) : (
        <main className='center'>Please connect your wallet.</main>
      )}
    </>
  )
}

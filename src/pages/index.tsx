import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { NextPageContext } from 'next'
import { useEffect, useState } from 'react'
import { client } from '@/lib/wagmi'
import Header from '@/components/Header'
import { keccak256 } from 'viem'
import Link from 'next/link'
import PaginationControls from '@/components/PaginationControls'

const inter = Inter({ subsets: ['latin'] })

const NFTS_PER_PAGE = 25

type HomePageProps = {}

export default function Home ({}: HomePageProps) {
  const [nfts, setNfts] = useState(() => {
    const nftIds: string[] = []
    for (let i = 0; i < 134; i++) {
      nftIds.push(`nft${i}`)
    }
    return nftIds
  })
  const [page, setPage] = useState(0)

  const nftPage = nfts.slice(page * NFTS_PER_PAGE, (page + 1) * NFTS_PER_PAGE)

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
        <div className='nfts mb-4'>
          {nftPage.map(nftId => (
            <Link href={`/nft/${nftId}`} key={nftId}>
              <Image
                src={`https://noun-api.com/beta/pfp?_=${nftId}`}
                alt={`Queried public API; NFT ${nftId}`}
                width={144}
                height={144}
                className='nft-preview bg-gray-100 dark:bg-gray-900 rounded-md'
              />
            </Link>
          ))}
        </div>
        <PaginationControls
          page={page}
          onPage={setPage}
          pages={Math.ceil(nfts.length / NFTS_PER_PAGE)}
        />
      </main>
    </>
  )
}

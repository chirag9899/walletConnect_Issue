'use client'

import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { mainnet, arbitrum, berachainTestnet, defineChain, berachainTestnetbArtio } from '@reown/appkit/networks'

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Create a metadata object
const metadata = {
  name: 'BeraVote',
  // description: 'Decentralized Governance Infrastructure',
  description: 'AppKit Example',
  url: 'http://127.0.0.1:8001',
  icons: ['https://avatars.mywebsite.com/']
}


// 3. Create the AppKit instance
export const modal = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [berachainTestnetbArtio, mainnet],
  projectId: projectId || '',
  features: {
    analytics: true 
  }
  
})
export function Web3Modal({ children }: { children: React.ReactNode }) {
  return children
}

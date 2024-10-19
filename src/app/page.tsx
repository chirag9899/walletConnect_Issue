'use client'
import Image from "next/image";
import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitState } from '@reown/appkit/react' 
import { ethers } from "ethers";
import { modal } from "../utils/appkit";
import { berachainTestnetbArtio, mainnet } from "@reown/appkit/networks";
import { defineChain } from "viem";

const USDTAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const WBERACHAIN_ADDRESS = '0x7507c1dc16935B82698e4C63f2746A2fCf994dF8'


// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const ERC20Abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)'
]

const beraChainTestnet = defineChain({
  id: 80084,
  name: 'Berachain bArtio',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA Token',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: { http: ['https://bartio.rpc.berachain.com'] },
  },
  chainNamespace: 'eip155',
  caipNetworkId: 'eip155:80084',
})

// const berachain = defineChain({
//   id: 80084,
//   name:'Berachain bArtio',
//   network: `Berachain`,
//   nativeCurrency: {
//     decimals: 18,
//     name: 'BERA Token',
//     symbol: 'BERA',
//   },
//   rpcUrls: {
//    default: {
//     http: ['https://bartio.rpc.berachain.com'],
//    },
//    public: {
//     http: ['https://bartio.rpc.berachain.com'],
//    },
//   },
//   blockExplorers: {
//    default: { 
//        name: `Beratrail`,
//        url: `https://bartio.beratrail.io/` 
//      },
//   },
//  });


function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit()
  const { selectedNetworkId } = useAppKitState()
  const { isConnected, status, address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')


  async function getBalance(network: number ) {
    if (!isConnected) {
      console.error('User is not connected');
      throw Error('User disconnected');
    }

    try {
      if (network === 80084) {
        // modal.addConnector(berachainTestnetbArtio as any);
        modal.switchNetwork(berachainTestnetbArtio as any);
        const state = await modal.getState()
        console.log(state)
      } else if (network === 1) {
        modal.switchNetwork(mainnet as any);
      }
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = await ethersProvider.getSigner();
      console.log(signer)
      let contractAddress = network === 80084 ? WBERACHAIN_ADDRESS : USDTAddress;
      const USDTContract = new ethers.Contract(contractAddress, ERC20Abi, signer);
      const USDTName = await USDTContract.name();
      const USDTBalance = await USDTContract.balanceOf(address);
      console.log(`Name: ${USDTName.toString()}`);
      console.log(`Balance: ${USDTBalance.toString()}`);
    } catch (error) {
      console.error( error);
    }
  }

  async function signText(network: number) {
    if (!isConnected) {
      console.error('User is not connected');
      throw Error('User disconnected');
    }
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider as any);
    const signer = await ethersProvider.getSigner();
    const signature = await signer.signMessage('Hello World');
    console.log(signature)
  }


  console.log(isConnected, status, address)
  return (
    <div className="flex flex-col items-center justify-center h-full flex-wrap gap-10">
      <button onClick={() => open()} className="bg-blue-500 text-white px-4 py-2 rounded-md">Open Connect Modal</button>
      <button onClick={() => open({ view: 'Networks' })} className="bg-blue-500 text-white px-4 py-2 rounded-md">Open Network Modal</button>
      <button onClick={() => getBalance(berachainTestnetbArtio.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Get Wbera Balance</button>
      <button onClick={() => getBalance(mainnet.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Get USDC Balance</button>
      <button onClick={() => signText(berachainTestnetbArtio.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Sign Text</button>

    </div>
  )
}
export default function Home() {
  return (
    <div className="flex justify-center items-center border-2 border-red-500 h-screen">
      <ConnectButton />
    </div>
  );
}

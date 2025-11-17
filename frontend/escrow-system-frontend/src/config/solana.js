import { Connection, clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

export const NETWORK = WalletAdapterNetwork.Devnet
export const ENDPOINT = clusterApiUrl(NETWORK)
export const connection = new Connection(ENDPOINT, 'confirmed')
export const PROGRAM_ID = 'FBkdzDicx5cyJoTQ1NrM9BPhFkhwFk4a1WRbvGGNYMqY'

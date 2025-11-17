import { computed } from 'vue'
import { useWallet as useSolanaWallet } from 'solana-wallets-vue'
import { connection, logNetwork } from '@/config/solana'

export function useWallet() {
  const wallet = useSolanaWallet()

  const walletAddress = computed(() => {
    return wallet.publicKey.value?.toString() || ''
  })

  const truncatedAddress = computed(() => {
    if (!walletAddress.value) return ''
    return `${walletAddress.value.slice(0, 4)}...${walletAddress.value.slice(-4)}`
  })

  const connectWallet = () => {
    try {
      if (!wallet.wallet.value) {
        wallet.select('Phantom')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnectWallet = async () => {
    try {
      await wallet.disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      throw error
    }
  }

  return {
    connected: wallet.connected,
    walletAddress,
    truncatedAddress,
    connectWallet,
    disconnectWallet,
    publicKey: wallet.publicKey,
    sendTransaction: wallet.sendTransaction,
    signTransaction: wallet.signTransaction,
    signMessage: wallet.signMessage,
    select: wallet.select,
    wallet: wallet.wallet,
    connection,
  }
}

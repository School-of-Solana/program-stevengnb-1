import { ref, computed } from 'vue'

export function useWallet() {
  const connected = ref(false)
  const walletAddress = ref('')

  const truncatedAddress = computed(() => {
    if (!walletAddress.value) return ''
    return `${walletAddress.value.slice(0, 4)}...${walletAddress.value.slice(-4)}`
  })

  const connectWallet = async () => {
    // TODO: Implement wallet connection with @solana/wallet-adapter-vue
    // For now, this is a placeholder
    console.log('Connecting wallet...')

    try {
      // Simulate connection - Replace with actual wallet adapter logic
      connected.value = true
      walletAddress.value = 'DummyWalletAddress123456789'

      // Actual implementation will look like:
      // const { select, wallets } = useWallet()
      // if (wallets.value.length > 0) {
      //   select(wallets.value[0].adapter.name)
      // }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnectWallet = () => {
    // TODO: Implement wallet disconnection
    console.log('Disconnecting wallet...')
    connected.value = false
    walletAddress.value = ''
  }

  return {
    connected,
    walletAddress,
    truncatedAddress,
    connectWallet,
    disconnectWallet,
  }
}

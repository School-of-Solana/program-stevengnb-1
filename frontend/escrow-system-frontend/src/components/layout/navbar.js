import { computed } from 'vue'
import { useWallet } from 'solana-wallets-vue'

export default {
  name: 'Navbar',
  props: {
    links: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { connected, publicKey, select, disconnect, wallet } = useWallet()

    const truncatedAddress = computed(() => {
      if (!publicKey.value) return ''
      const address = publicKey.value.toString()
      return `${address.slice(0, 4)}...${address.slice(-4)}`
    })

    const connectWallet = () => {
      try {
        if (!wallet.value) {
          select('Phantom')
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    }

    const disconnectWallet = async () => {
      try {
        await disconnect()
      } catch (error) {
        console.error('Failed to disconnect wallet:', error)
      }
    }

    return {
      connected,
      truncatedAddress,
      connectWallet,
      disconnectWallet
    }
  }
}

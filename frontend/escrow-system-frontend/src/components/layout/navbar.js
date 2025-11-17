import { useWallet } from '@/composables/useWallet'

export default {
  name: 'Navbar',
  props: {
    links: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { connected, truncatedAddress, connectWallet, disconnectWallet } = useWallet()

    return {
      connected,
      truncatedAddress,
      connectWallet,
      disconnectWallet
    }
  }
}

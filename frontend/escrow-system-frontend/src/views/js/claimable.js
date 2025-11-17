import EscrowCard from '@/components/EscrowCard.vue'

export default {
  name: 'Claimable',
  components: {
    EscrowCard
  },
  data() {
    return {
      escrows: [],
      loading: false,
      error: ''
    }
  },
  methods: {
    getStateMessage(state) {
      const messages = {
        Pending: { text: 'Waiting for creator to approve this escrow', class: 'text-slate-500' },
        Claimed: { text: 'Successfully claimed', class: 'text-blue-600 font-medium' },
        Cancelled: { text: 'Cancelled by creator', class: 'text-red-600' }
      }
      return messages[state] || { text: state, class: 'text-slate-500' }
    },
    async fetchEscrows() {
      this.loading = true
      this.error = ''

      try {
        // TODO: Implement actual escrow fetching from Solana program
        console.log('Fetching claimable escrows...')
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const now = Math.floor(Date.now() / 1000)
        this.escrows = [
          {
            creator: 'CreatorAddress111222333',
            recipient: 'DummyWalletAddress123456789',
            amount: 2.5,
            escrowId: 3,
            state: 'Approved',
            createdAt: now - 259200,
            bump: 253,
            publicKey: 'EscrowPDA999888777666555',
          },
          {
            creator: 'AnotherCreator444555666',
            recipient: 'DummyWalletAddress123456789',
            amount: 0.8,
            escrowId: 4,
            state: 'Pending',
            createdAt: now - 345600,
            bump: 252,
            publicKey: 'EscrowPDA333222111000999',
          },
        ]
      } catch (err) {
        this.error = err.message || 'Failed to fetch claimable escrows'
        console.error('Error fetching claimable escrows:', err)
      } finally {
        this.loading = false
      }
    },
    async handleClaim(escrowId) {
      if (confirm('Are you sure you want to claim this escrow?')) {
        try {
          // TODO: Implement actual claim transaction with Solana program
          console.log('Claiming escrow:', escrowId)
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Update local state
          const escrow = this.escrows.find(e => e.escrowId === escrowId)
          if (escrow) {
            escrow.state = 'Claimed'
          }

          // Remove after short delay
          setTimeout(() => {
            this.escrows = this.escrows.filter(e => e.escrowId !== escrowId)
          }, 500)
        } catch (err) {
          console.error('Failed to claim:', err)
          this.error = err.message || 'Failed to claim escrow'
        }
      }
    }
  },
  mounted() {
    this.fetchEscrows()
  }
}

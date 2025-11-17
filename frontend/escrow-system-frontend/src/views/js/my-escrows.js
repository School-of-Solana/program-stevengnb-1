import EscrowCard from '@/components/EscrowCard.vue'

export default {
  name: 'MyEscrows',
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
        Approved: { text: 'Waiting for recipient to claim', class: 'text-slate-500' },
        Cancelled: { text: 'Cancelled', class: 'text-red-600' },
        Claimed: { text: 'Claimed by recipient', class: 'text-blue-600' }
      }
      return messages[state] || { text: state, class: 'text-slate-500' }
    },
    async fetchEscrows() {
      this.loading = true
      this.error = ''

      try {
        // TODO: Implement actual escrow fetching from Solana program
        console.log('Fetching my escrows...')
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const now = Math.floor(Date.now() / 1000)
        this.escrows = [
          {
            creator: 'DummyWalletAddress123456789',
            recipient: 'RecipientAddress987654321',
            amount: 0.5,
            escrowId: 1,
            state: 'Pending',
            createdAt: now - 86400,
            bump: 255,
            publicKey: 'EscrowPDA111222333444555',
          },
          {
            creator: 'DummyWalletAddress123456789',
            recipient: 'AnotherRecipient111222333',
            amount: 1.2,
            escrowId: 2,
            state: 'Approved',
            createdAt: now - 172800,
            bump: 254,
            publicKey: 'EscrowPDA444555666777888',
          },
        ]
      } catch (err) {
        this.error = err.message || 'Failed to fetch escrows'
        console.error('Error fetching escrows:', err)
      } finally {
        this.loading = false
      }
    },
    async handleApprove(escrowId) {
      try {
        // TODO: Implement actual approve transaction with Solana program
        console.log('Approving escrow:', escrowId)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const escrow = this.escrows.find(e => e.escrowId === escrowId)
        if (escrow) {
          escrow.state = 'Approved'
        }
      } catch (err) {
        console.error('Failed to approve:', err)
        this.error = err.message || 'Failed to approve escrow'
      }
    },
    async handleCancel(escrowId) {
      if (confirm('Are you sure you want to cancel this escrow?')) {
        try {
          // TODO: Implement actual cancel transaction with Solana program
          console.log('Canceling escrow:', escrowId)
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const escrow = this.escrows.find(e => e.escrowId === escrowId)
          if (escrow) {
            escrow.state = 'Cancelled'
          }
        } catch (err) {
          console.error('Failed to cancel:', err)
          this.error = err.message || 'Failed to cancel escrow'
        }
      }
    }
  },
  mounted() {
    this.fetchEscrows()
  }
}

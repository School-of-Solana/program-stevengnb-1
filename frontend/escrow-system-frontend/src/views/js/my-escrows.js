import { ref, computed, onMounted, watch } from 'vue'
import { useWorkspace } from '@/composables/useWorkspace'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import EscrowCard from '@/components/EscrowCard.vue'

export default {
  name: 'MyEscrows',
  components: {
    EscrowCard
  },
  setup() {
    const { program, wallet, programId } = useWorkspace()

    const escrows = ref([])
    const loading = ref(false)
    const error = ref('')

    const isWalletConnected = computed(() => !!wallet.value)

    const getStateMessage = (state) => {
      const messages = {
        Approved: { text: 'Waiting for recipient to claim', class: 'text-amber-600' },
        Cancelled: { text: 'Cancelled - SOL returned', class: 'text-red-600' },
        Claimed: { text: 'Claimed by recipient', class: 'text-emerald-600' }
      }
      return messages[state] || { text: state, class: 'text-slate-500' }
    }

    const parseEscrowState = (stateObj) => {
      if (stateObj.pending) return 'Pending'
      if (stateObj.approved) return 'Approved'
      if (stateObj.cancelled) return 'Cancelled'
      if (stateObj.claimed) return 'Claimed'
      return 'Unknown'
    }

    const fetchEscrows = async () => {
      if (!isWalletConnected.value || !program.value) {
        escrows.value = []
        return
      }

      loading.value = true
      error.value = ''

      try {
        const allEscrows = await program.value.account.escrow.all()

        const myEscrows = allEscrows
          .filter(item => item.account.creator.equals(wallet.value.publicKey))
          .map(item => ({
            publicKey: item.publicKey.toString(),
            creator: item.account.creator.toString(),
            recipient: item.account.recipient.toString(),
            amount: item.account.amount.toNumber() / LAMPORTS_PER_SOL,
            escrowId: item.account.escrowId.toNumber(),
            state: parseEscrowState(item.account.state),
            createdAt: item.account.createdAt.toNumber(),
            bump: item.account.bump
          }))
          .sort((a, b) => b.createdAt - a.createdAt)

        escrows.value = myEscrows
      } catch (err) {
        error.value = err.message || 'Failed to fetch escrows'
      } finally {
        loading.value = false
      }
    }

    const handleApprove = async (escrowId) => {
      if (!program.value || !wallet.value) return

      try {
        const escrowIdBN = new BN(escrowId)

        const [escrowPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('escrow'),
            wallet.value.publicKey.toBuffer(),
            escrowIdBN.toArrayLike(Buffer, 'le', 8)
          ],
          programId
        )

        const tx = await program.value.methods
          .approve()
          .accounts({
            creator: wallet.value.publicKey,
            escrow: escrowPda
          })
          .rpc()

        const escrow = escrows.value.find(e => e.escrowId === escrowId)
        if (escrow) {
          escrow.state = 'Approved'
        }

        alert(`Escrow approved! Transaction: ${tx}`)
      } catch (err) {
        error.value = err.message || 'Failed to approve escrow'
      }
    }

    const handleCancel = async (escrowId) => {
      if (!program.value || !wallet.value) return

      if (!confirm('Are you sure you want to cancel this escrow? The SOL will be returned to your wallet.')) {
        return
      }

      try {
        const escrowIdBN = new BN(escrowId)

        const [escrowPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('escrow'),
            wallet.value.publicKey.toBuffer(),
            escrowIdBN.toArrayLike(Buffer, 'le', 8)
          ],
          programId
        )

        const tx = await program.value.methods
          .cancel()
          .accounts({
            creator: wallet.value.publicKey,
            escrow: escrowPda
          })
          .rpc()

        const escrow = escrows.value.find(e => e.escrowId === escrowId)
        if (escrow) {
          escrow.state = 'Cancelled'
        }

        alert(`Escrow cancelled! SOL returned. Transaction: ${tx}`)
      } catch (err) {
        error.value = err.message || 'Failed to cancel escrow'
      }
    }

    onMounted(() => {
      if (isWalletConnected.value) {
        fetchEscrows()
      }
    })

    watch(() => wallet.value, () => {
      fetchEscrows()
    })

    return {
      escrows,
      loading,
      error,
      isWalletConnected,
      getStateMessage,
      handleApprove,
      handleCancel,
      fetchEscrows
    }
  }
}

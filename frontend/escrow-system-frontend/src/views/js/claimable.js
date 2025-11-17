import { ref, computed, onMounted, watch } from 'vue'
import { useWorkspace } from '@/composables/useWorkspace'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import EscrowCard from '@/components/EscrowCard.vue'

export default {
  name: 'Claimable',
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
        Pending: { text: 'Waiting for creator to approve', class: 'text-amber-600' },
        Claimed: { text: 'Successfully claimed', class: 'text-emerald-600 font-medium' },
        Cancelled: { text: 'Cancelled by creator', class: 'text-red-600' }
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

        const claimableEscrows = allEscrows
          .filter(item => item.account.recipient.equals(wallet.value.publicKey))
          .map(item => ({
            publicKey: item.publicKey.toString(),
            creator: item.account.creator.toString(),
            recipient: item.account.recipient.toString(),
            amount: item.account.amount.toNumber() / LAMPORTS_PER_SOL,
            escrowId: item.account.escrowId.toNumber(),
            state: parseEscrowState(item.account.state),
            createdAt: item.account.createdAt.toNumber(),
            bump: item.account.bump,
            creatorPubkey: item.account.creator
          }))
          .sort((a, b) => b.createdAt - a.createdAt)

        escrows.value = claimableEscrows
      } catch (err) {
        error.value = err.message || 'Failed to fetch claimable escrows'
      } finally {
        loading.value = false
      }
    }

    const handleClaim = async (escrowId) => {
      if (!program.value || !wallet.value) return

      const escrow = escrows.value.find(e => e.escrowId === escrowId)
      if (!escrow) return

      if (!confirm(`Are you sure you want to claim ${escrow.amount} SOL from this escrow?`)) {
        return
      }

      try {
        const escrowIdBN = new BN(escrowId)
        const creatorPubkey = new PublicKey(escrow.creator)

        const [escrowPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('escrow'),
            creatorPubkey.toBuffer(),
            escrowIdBN.toArrayLike(Buffer, 'le', 8)
          ],
          programId
        )

        const tx = await program.value.methods
          .claim()
          .accounts({
            recipient: wallet.value.publicKey,
            escrow: escrowPda
          })
          .rpc()

        escrow.state = 'Claimed'

        alert(`Successfully claimed ${escrow.amount} SOL! Transaction: ${tx}`)
      } catch (err) {
        if (err.message?.includes('User rejected')) {
          error.value = 'Transaction was cancelled'
        } else if (err.message?.includes('InvalidStateForClaim')) {
          error.value = 'This escrow is not approved yet'
        } else {
          error.value = err.message || 'Failed to claim escrow'
        }
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
      handleClaim,
      fetchEscrows
    }
  }
}

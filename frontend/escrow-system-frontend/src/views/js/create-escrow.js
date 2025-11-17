import { ref, computed } from 'vue'
import { useWorkspace } from '@/composables/useWorkspace'
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'

export default {
  name: 'CreateEscrow',
  setup() {
    const { program, wallet, programId } = useWorkspace()

    const formData = ref({
      recipientAddress: '',
      amount: 0,
      escrowId: 1
    })
    const errors = ref({})
    const loading = ref(false)
    const success = ref(false)
    const error = ref('')
    const txSignature = ref('')

    const isWalletConnected = computed(() => !!wallet.value)

    const validateForm = () => {
      errors.value = {}

      if (!isWalletConnected.value) {
        error.value = 'Please connect your wallet first'
        return false
      }

      if (!formData.value.recipientAddress) {
        errors.value.recipientAddress = 'Recipient address is required'
        return false
      }

      try {
        new PublicKey(formData.value.recipientAddress)
      } catch {
        errors.value.recipientAddress = 'Invalid Solana address'
        return false
      }

      if (formData.value.amount <= 0) {
        errors.value.amount = 'Amount must be greater than 0'
        return false
      }

      if (formData.value.escrowId <= 0 || !Number.isInteger(formData.value.escrowId)) {
        errors.value.escrowId = 'Escrow ID must be a positive integer'
        return false
      }

      return true
    }

    const createEscrow = async () => {
      if (!validateForm()) return

      loading.value = true
      success.value = false
      error.value = ''
      txSignature.value = ''

      try {
        const recipientPubkey = new PublicKey(formData.value.recipientAddress)
        const escrowId = new BN(formData.value.escrowId)
        const amountLamports = new BN(formData.value.amount * LAMPORTS_PER_SOL)

        const [escrowPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('escrow'),
            wallet.value.publicKey.toBuffer(),
            escrowId.toArrayLike(Buffer, 'le', 8)
          ],
          programId
        )

        const tx = await program.value.methods
          .initialize(amountLamports, escrowId)
          .accounts({
            creator: wallet.value.publicKey,
            recipient: recipientPubkey,
            escrow: escrowPda,
            systemProgram: SystemProgram.programId
          })
          .rpc()

        txSignature.value = tx
        success.value = true

        formData.value.recipientAddress = ''
        formData.value.amount = 0
        formData.value.escrowId += 1
      } catch (err) {
        if (err.message?.includes('User rejected')) {
          error.value = 'Transaction was cancelled'
        } else if (err.message?.includes('insufficient funds')) {
          error.value = 'Insufficient SOL balance'
        } else if (err.message?.includes('already in use')) {
          error.value = 'Escrow ID already exists. Try a different ID.'
        } else {
          error.value = (err.message || 'Failed to create escrow') + '. Please try again!'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      errors,
      loading,
      success,
      error,
      txSignature,
      isWalletConnected,
      createEscrow
    }
  }
}

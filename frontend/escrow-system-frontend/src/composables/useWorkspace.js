import { computed, ref } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { ENDPOINT, PROGRAM_ID } from '@/config/solana'
import idl from '@/idl.json'

const programId = new PublicKey(PROGRAM_ID)
const connection = new Connection(ENDPOINT, 'confirmed')
const isInitialized = ref(false)

export const initWorkspace = () => {
  isInitialized.value = true
}

export const useWorkspace = () => {
  const wallet = useAnchorWallet()

  const provider = computed(() => {
    if (!wallet.value) return null
    return new AnchorProvider(connection, wallet.value, {
      preflightCommitment: 'confirmed',
      commitment: 'confirmed',
    })
  })

  const program = computed(() => {
    if (!provider.value) return null
    return new Program(idl, provider.value)
  })

  return {
    wallet,
    connection,
    provider,
    program,
    programId,
    isInitialized,
  }
}

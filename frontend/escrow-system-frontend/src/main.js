import { Buffer } from 'buffer'
window.Buffer = Buffer

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import SolanaWallets from 'solana-wallets-vue'
import 'solana-wallets-vue/styles.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { initWorkspace } from './composables/useWorkspace'

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  autoConnect: true,
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(SolanaWallets, walletOptions)

initWorkspace()

app.mount('#app')
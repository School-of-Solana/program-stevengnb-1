<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
    <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <RouterLink
        to="/"
        class="text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors"
      >
        GuardSOL
      </RouterLink>

      <div class="flex items-center gap-6">
        <div v-if="!connected" class="text-sm text-slate-500">
          Welcome! Please connect your wallet
        </div>
        <div v-else class="text-sm text-slate-600 font-medium">
          Connected: {{ truncatedAddress }}
        </div>

        <button
          v-if="!connected"
          @click="connectWallet"
          class="px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Connect Wallet
        </button>
        <button
          v-else
          @click="disconnectWallet"
          class="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-all duration-200"
        >
          Disconnect
        </button>
      </div>
    </nav>
  </header>
</template>

<script src="./navbar.js" />
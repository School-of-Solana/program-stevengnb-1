<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-slate-800 mb-4">
          Solana Escrow System
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Secure peer-to-peer SOL payments with approval mechanism. Create, manage, and claim escrows with confidence.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard v-for="card in featureCards" :key="card.to" v-bind="card" />
      </div>

      <div class="mt-20 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-12 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="text-center">
            <div
              class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              1</div>
            <h3 class="text-lg font-semibold text-white mb-2">Create Escrow</h3>
            <p class="text-slate-300 text-sm">Deposit SOL and specify the recipient's wallet address</p>
          </div>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              2</div>
            <h3 class="text-lg font-semibold text-white mb-2">Approve Payment</h3>
            <p class="text-slate-300 text-sm">Review and approve when you're ready to release funds</p>
          </div>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              3</div>
            <h3 class="text-lg font-semibold text-white mb-2">Claim Funds</h3>
            <p class="text-slate-300 text-sm">Recipient claims the approved escrow to their wallet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./js/home.js" />

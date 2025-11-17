<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">Claimable Escrows</h1>
        <p class="text-slate-600">View and claim escrows where you're the recipient</p>
      </div>

      <div v-if="!isWalletConnected" class="text-center py-20">
        <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
            </path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-700 mb-2">Wallet Not Connected</h3>
        <p class="text-slate-500">Please connect your wallet to view claimable escrows</p>
      </div>

      <div v-else-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-600"></div>
      </div>

      <div v-else-if="error" class="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p class="text-red-700">{{ error }}</p>
        <button @click="fetchEscrows" class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Retry
        </button>
      </div>

      <div v-else-if="escrows.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-700 mb-2">No claimable escrows</h3>
        <p class="text-slate-500">There are no escrows waiting for you to claim</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <EscrowCard v-for="escrow in escrows" :key="escrow.escrowId" :escrow="escrow" address-label="From"
          :address-value="escrow.creator">
          <template #actions>
            <div v-if="escrow.state === 'Approved'">
              <button @click="handleClaim(escrow.escrowId)"
                class="w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md">
                Claim {{ escrow.amount }} SOL
              </button>
              <p class="text-xs text-center text-slate-500 mt-2">
                This escrow has been approved and is ready to claim
              </p>
            </div>
            <div v-else class="text-center py-3">
              <p class="text-sm" :class="getStateMessage(escrow.state).class">
                {{ getStateMessage(escrow.state).text }}
              </p>
            </div>
          </template>
        </EscrowCard>
      </div>
    </div>
  </div>
</template>

<script src="./js/claimable.js" />

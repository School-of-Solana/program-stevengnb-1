<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">My Escrows</h1>
        <p class="text-slate-600">View and manage all escrows you've created</p>
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
        <p class="text-slate-500">Please connect your wallet to view your escrows</p>
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-700 mb-2">No escrows found</h3>
        <p class="text-slate-500 mb-6">You haven't created any escrows yet</p>
        <RouterLink to="/create"
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all">
          Create Your First Escrow
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <EscrowCard v-for="escrow in escrows" :key="escrow.escrowId" :escrow="escrow" address-label="Recipient"
          :address-value="escrow.recipient">
          <template #actions>
            <div v-if="escrow.state === 'Pending'" class="flex gap-3">
              <button @click="handleApprove(escrow.escrowId)"
                class="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                Approve
              </button>
              <button @click="handleCancel(escrow.escrowId)"
                class="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                Cancel
              </button>
            </div>
            <div v-else class="text-center py-2 text-sm" :class="getStateMessage(escrow.state).class">
              {{ getStateMessage(escrow.state).text }}
            </div>
          </template>
        </EscrowCard>
      </div>
    </div>
  </div>
</template>

<script src="./js/my-escrows.js" />

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-lg font-bold text-slate-800">Escrow #{{ escrow.escrowId }}</h3>
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full"
            :class="getStateClass(escrow.state)"
          >
            {{ escrow.state.toUpperCase() }}
          </span>
        </div>
        <p class="text-sm text-slate-500">
          Created {{ formatDate(escrow.createdAt) }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-slate-800">{{ escrow.amount }} SOL</p>
      </div>
    </div>

    <div class="space-y-2 mb-4">
      <div class="flex items-center justify-between py-2 border-t border-slate-100">
        <span class="text-sm text-slate-600">{{ addressLabel }}</span>
        <span class="text-sm font-mono text-slate-800">
          {{ truncateAddress(addressValue) }}
        </span>
      </div>
    </div>

    <div class="mt-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<script src="./js/escrow-card.js" />

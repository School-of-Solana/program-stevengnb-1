<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16">
    <div class="max-w-2xl mx-auto px-6">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-800 mb-2">Create Escrow</h1>
        <p class="text-slate-600">Create a secure SOL escrow payment to another wallet</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <form @submit.prevent="createEscrow" class="space-y-6">
          <div>
            <label for="recipient" class="block text-sm font-medium text-slate-700 mb-2">
              Recipient Wallet Address
            </label>
            <input id="recipient" v-model="formData.recipientAddress" type="text"
              placeholder="Enter recipient's Solana wallet address"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.recipientAddress }" />
            <p v-if="errors.recipientAddress" class="mt-1 text-sm text-red-600">
              {{ errors.recipientAddress }}
            </p>
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-slate-700 mb-2">
              Amount (SOL)
            </label>
            <input id="amount" v-model.number="formData.amount" type="number" step="0.01" min="0.01" placeholder="0.00"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.amount }" />
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">
              {{ errors.amount }}
            </p>
          </div>

          <div>
            <label for="escrowId" class="block text-sm font-medium text-slate-700 mb-2">
              Escrow ID
            </label>
            <input id="escrowId" v-model.number="formData.escrowId" type="number" min="1"
              placeholder="Unique identifier for this escrow"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500': errors.escrowId }" />
            <p v-if="errors.escrowId" class="mt-1 text-sm text-red-600">
              {{ errors.escrowId }}
            </p>
          </div>

          <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <div v-if="success" class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p class="text-sm text-emerald-700">Escrow created successfully!</p>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Creating Escrow...' : 'Create Escrow' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script src="./js/create-escrow.js" />

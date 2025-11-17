<template>
  <RouterLink
    :to="to"
    class="group relative bg-white border border-slate-200 shadow-sm hover:shadow-xl p-8 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 overflow-hidden"
  >
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      :class="gradientClass"
    ></div>
    <div class="relative">
      <div class="w-14 h-14 rounded-xl flex items-center justify-center mb-6" :class="iconBgClass">
        <svg class="w-7 h-7" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-800 mb-3">{{ title }}</h2>
      <p class="text-slate-600">{{ description }}</p>
    </div>
    <div class="relative mt-6">
      <span class="inline-flex items-center font-semibold group-hover:gap-2 transition-all" :class="textColorClass">
        {{ actionText }}
        <svg class="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </span>
    </div>
  </RouterLink>
</template>

<script src="./js/feature-card.js" />

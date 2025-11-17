import FeatureCard from '@/components/FeatureCard.vue'

export default {
  name: 'Home',
  components: {
    FeatureCard
  },
  data() {
    return {
      featureCards: [
        {
          to: '/create',
          title: 'Create Escrow',
          description: 'Create a new escrow payment for secure SOL transfers to another wallet',
          actionText: 'Get Started',
          iconPath: 'M12 4v16m8-8H4',
          gradientClass: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
          iconBgClass: 'bg-emerald-100',
          iconColorClass: 'text-emerald-600',
          textColorClass: 'text-emerald-600',
        },
        {
          to: '/my-escrows',
          title: 'My Escrows',
          description: 'View and manage all escrows you\'ve created. Approve or cancel pending escrows',
          actionText: 'View Escrows',
          iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          gradientClass: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
          iconBgClass: 'bg-blue-100',
          iconColorClass: 'text-blue-600',
          textColorClass: 'text-blue-600',
        },
        {
          to: '/claimable',
          title: 'Claimable Escrows',
          description: 'View approved escrows ready to claim. Receive your SOL from completed escrows',
          actionText: 'Claim Funds',
          iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          gradientClass: 'bg-gradient-to-br from-violet-500/10 to-purple-500/10',
          iconBgClass: 'bg-violet-100',
          iconColorClass: 'text-violet-600',
          textColorClass: 'text-violet-600',
        },
      ]
    }
  }
}

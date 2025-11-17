export default {
  name: 'EscrowCard',
  props: {
    escrow: {
      type: Object,
      required: true
    },
    addressLabel: {
      type: String,
      required: true
    },
    addressValue: {
      type: String,
      required: true
    }
  },
  methods: {
    getStateClass(state) {
      const classes = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Approved: 'bg-emerald-100 text-emerald-700',
        Cancelled: 'bg-red-100 text-red-700',
        Claimed: 'bg-blue-100 text-blue-700',
      }
      return classes[state] || 'bg-slate-100 text-slate-700'
    },
    truncateAddress(address) {
      if (!address || address.length < 8) return address
      return `${address.slice(0, 4)}...${address.slice(-4)}`
    },
    formatDate(timestamp) {
      return new Date(timestamp * 1000).toLocaleDateString()
    }
  }
}

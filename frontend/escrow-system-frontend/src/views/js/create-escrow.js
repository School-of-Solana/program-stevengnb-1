export default {
  name: 'CreateEscrow',
  data() {
    return {
      formData: {
        recipientAddress: '',
        amount: 0,
        escrowId: 1
      },
      errors: {},
      loading: false,
      success: false,
      error: ''
    }
  },
  methods: {
    validateForm() {
      this.errors = {}

      if (!this.formData.recipientAddress) {
        this.errors.recipientAddress = 'Recipient address is required'
        return false
      }

      if (this.formData.recipientAddress.length < 32) {
        this.errors.recipientAddress = 'Invalid Solana address'
        return false
      }

      if (this.formData.amount <= 0) {
        this.errors.amount = 'Amount must be greater than 0'
        return false
      }

      if (this.formData.escrowId <= 0) {
        this.errors.escrowId = 'Escrow ID must be greater than 0'
        return false
      }

      return true
    },
    async createEscrow() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.success = false
      this.error = ''

      try {
        // TODO: Implement actual escrow creation with Solana program
        console.log('Creating escrow with:', this.formData)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        this.success = true

        // Reset form
        this.formData.recipientAddress = ''
        this.formData.amount = 0
        this.formData.escrowId += 1
      } catch (err) {
        this.error = err.message || 'Failed to create escrow'
        console.error('Error creating escrow:', err)
      } finally {
        this.loading = false
      }
    }
  }
}

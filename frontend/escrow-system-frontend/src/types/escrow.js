/**
 * @typedef {'Pending' | 'Approved' | 'Cancelled' | 'Claimed'} EscrowState
 */

/**
 * @typedef {Object} Escrow
 * @property {string} creator - Creator wallet address
 * @property {string} recipient - Recipient wallet address
 * @property {number} amount - Amount in SOL
 * @property {number} escrowId - Unique escrow identifier
 * @property {EscrowState} state - Current escrow state
 * @property {number} createdAt - Unix timestamp
 * @property {number} bump - PDA bump seed
 * @property {string} publicKey - Escrow account public key
 */

/**
 * @typedef {Object} EscrowFormData
 * @property {string} recipientAddress - Recipient wallet address
 * @property {number} amount - Amount in SOL
 * @property {number} escrowId - Unique escrow identifier
 */

/**
 * @typedef {Object} FormErrors
 * @property {string} [recipientAddress] - Recipient address error message
 * @property {string} [amount] - Amount error message
 * @property {string} [escrowId] - Escrow ID error message
 */

export {}

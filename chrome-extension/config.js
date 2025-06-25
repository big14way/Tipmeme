const CONFIG = {
  TIPMEME_CONTRACT_ADDRESS: '0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e',
  STARKNET_RPC_URL: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_8',
  NETWORK: 'sepolia',
  PAYMASTER_SERVICE_URL: 'http://localhost:3001'
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG };
} 
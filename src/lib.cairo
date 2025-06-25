use starknet::ContractAddress;

// TipStruct definition
#[derive(Drop, Serde, starknet::Store)]
pub struct TipStruct {
    pub sender: ContractAddress,
    pub amount: u256,
    pub token: ContractAddress,
    pub timestamp: u64,
}

// Define the contract interface
#[starknet::interface]
pub trait ITipMeme<TContractState> {
    fn tip(ref self: TContractState, recipient: felt252, token: ContractAddress, amount: u256);
    fn withdraw(ref self: TContractState, handle: felt252, signature: Array<felt252>);
    fn get_tips(self: @TContractState, handle: felt252) -> Array<TipStruct>;
    fn get_balance(self: @TContractState, account: ContractAddress) -> u256;
    fn is_paymaster_enabled(self: @TContractState) -> bool;
    fn set_paymaster_enabled(ref self: TContractState, enabled: bool);
    fn get_nonce(self: @TContractState, account: ContractAddress) -> felt252;
}

// Define the contract module
#[starknet::contract]
pub mod TipMeme {
    use starknet::ContractAddress;
    use starknet::storage::*;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use starknet::get_contract_address;
    use core::num::traits::Zero;
    use core::poseidon::poseidon_hash_span;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::account::interface::{ISRC6Dispatcher, ISRC6DispatcherTrait};
    use super::TipStruct;

    // Error constants
    mod Errors {
        pub const ZERO_ADDRESS: felt252 = 'Zero address not allowed';
        pub const ZERO_AMOUNT: felt252 = 'Amount cannot be zero';
        pub const INVALID_SIGNATURE: felt252 = 'Invalid signature';
        pub const NO_TIPS_TO_WITHDRAW: felt252 = 'No tips to withdraw';
        pub const TRANSFER_FAILED: felt252 = 'Token transfer failed';
        pub const UNAUTHORIZED: felt252 = 'Unauthorized caller';
        pub const PAYMASTER_DISABLED: felt252 = 'Paymaster not enabled';
    }

    // Define storage variables
    #[storage]
    pub struct Storage {
        balances: Map<ContractAddress, u256>,
        tips: Map<felt252, Vec<TipStruct>>,
        owner: ContractAddress,
        paymaster_enabled: bool,
        nonces: Map<ContractAddress, felt252>,
        // Token balances tracking per handle
        token_totals: Map<(felt252, ContractAddress), u256>,
    }

    // Events
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        TipEvent: TipEvent,
        WithdrawEvent: WithdrawEvent,
        PaymasterStatusChanged: PaymasterStatusChanged,
    }

    #[derive(Drop, starknet::Event)]
    pub struct TipEvent {
        pub handle: felt252,
        pub sender: ContractAddress,
        pub token: ContractAddress,
        pub amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct WithdrawEvent {
        pub handle: felt252,
        pub recipient: ContractAddress,
        pub total_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PaymasterStatusChanged {
        pub enabled: bool,
    }

    // Constructor
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        assert(!owner.is_zero(), Errors::ZERO_ADDRESS);
        self.owner.write(owner);
        self.paymaster_enabled.write(false);
    }

    // Implement the contract interface
    #[abi(embed_v0)]
    pub impl TipMemeImpl of super::ITipMeme<ContractState> {
        /// Records a tip with recipient's Twitter handle and transfers tokens
        fn tip(ref self: ContractState, recipient: felt252, token: ContractAddress, amount: u256) {
            // Input validation
            assert(!token.is_zero(), Errors::ZERO_ADDRESS);
            assert(amount > 0, Errors::ZERO_AMOUNT);
            assert(recipient != 0, 'Invalid recipient handle');

            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            // Transfer tokens from caller to contract
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            let success = token_dispatcher.transfer_from(caller, get_contract_address(), amount);
            assert(success, Errors::TRANSFER_FAILED);

            // Create tip struct
            let tip = TipStruct {
                sender: caller,
                amount,
                token,
                timestamp,
            };

            // Store the tip using the new storage approach
            self.tips.entry(recipient).push(tip);

            // Update balance for the caller (optional tracking)
            let current_balance = self.balances.entry(caller).read();
            self.balances.entry(caller).write(current_balance + amount);

            // Track token totals per handle for easier withdrawal
            let current_token_total = self.token_totals.entry((recipient, token)).read();
            self.token_totals.entry((recipient, token)).write(current_token_total + amount);

            // Emit event
            self.emit(Event::TipEvent(TipEvent {
                handle: recipient,
                sender: caller,
                token,
                amount,
            }));
        }

        /// Withdraws all tips for a verified handle to the caller
        fn withdraw(ref self: ContractState, handle: felt252, signature: Array<felt252>) {
            let caller = get_caller_address();
            
            // Verify signature for handle ownership
            self._verify_handle_signature(caller, handle, signature);

            // Get all tips for this handle
            let tips_vec = self.tips.entry(handle);
            let tips_count = tips_vec.len();
            
            assert(tips_count > 0, Errors::NO_TIPS_TO_WITHDRAW);

            let mut total_withdrawn = 0_u256;
            let mut unique_tokens: Array<ContractAddress> = array![];

            // Collect unique tokens and calculate total
            let mut i = 0;
            while i < tips_count {
                let tip = tips_vec.at(i).read();
                total_withdrawn += tip.amount;
                
                // Check if token is already in unique_tokens array
                let mut token_found = false;
                let mut j = 0;
                while j < unique_tokens.len() {
                    if *unique_tokens.at(j) == tip.token {
                        token_found = true;
                        break;
                    }
                    j += 1;
                };
                
                if !token_found {
                    unique_tokens.append(tip.token);
                }
                i += 1;
            };

            // Transfer tokens to caller (handle owner)
            let mut token_index = 0;
            while token_index < unique_tokens.len() {
                let token = *unique_tokens.at(token_index);
                let token_amount = self.token_totals.entry((handle, token)).read();
                
                if token_amount > 0 {
                    let token_dispatcher = IERC20Dispatcher { contract_address: token };
                    let success = token_dispatcher.transfer(caller, token_amount);
                    assert(success, Errors::TRANSFER_FAILED);
                    
                    // Clear token total for this handle
                    self.token_totals.entry((handle, token)).write(0);
                }
                token_index += 1;
            };

            // Note: In production, you might want to keep tip history for auditing
            // For now, we don't clear tips to avoid storage complexity

            // Emit event
            self.emit(Event::WithdrawEvent(WithdrawEvent {
                handle,
                recipient: caller,
                total_amount: total_withdrawn,
            }));
        }

        /// Get all tips for a specific handle
        fn get_tips(self: @ContractState, handle: felt252) -> Array<TipStruct> {
            let tips_vec = self.tips.entry(handle);
            let tips_count = tips_vec.len();
            let mut tips_array = array![];
            
            let mut i = 0;
            while i < tips_count {
                tips_array.append(tips_vec.at(i).read());
                i += 1;
            };
            
            tips_array
        }

        /// Get balance for an account
        fn get_balance(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.entry(account).read()
        }

        /// Check if paymaster is enabled
        fn is_paymaster_enabled(self: @ContractState) -> bool {
            self.paymaster_enabled.read()
        }

        /// Set paymaster status (only owner)
        fn set_paymaster_enabled(ref self: ContractState, enabled: bool) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), Errors::UNAUTHORIZED);
            
            self.paymaster_enabled.write(enabled);
            
            self.emit(Event::PaymasterStatusChanged(PaymasterStatusChanged {
                enabled,
            }));
        }

        /// Get nonce for an account
        fn get_nonce(self: @ContractState, account: ContractAddress) -> felt252 {
            self.nonces.entry(account).read()
        }
    }

    // Internal implementation for helper functions
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Verify signature for handle ownership
        fn _verify_handle_signature(
            ref self: ContractState, 
            caller: ContractAddress, 
            handle: felt252, 
            signature: Array<felt252>
        ) {
            // Get current nonce for the caller
            let current_nonce = self.nonces.entry(caller).read();
            
            // Create message hash (simplified - in production use proper SNIP-12)
            let message_hash = self._create_message_hash(caller, handle, current_nonce);
            
            // Verify signature using SRC6 account abstraction
            let account_dispatcher = ISRC6Dispatcher { contract_address: caller };
            let is_valid = account_dispatcher.is_valid_signature(message_hash, signature);
            
            // Check if signature is valid (VALIDATED or true for backwards compatibility)
            let is_valid_signature = is_valid == starknet::VALIDATED || is_valid == 1;
            assert(is_valid_signature, Errors::INVALID_SIGNATURE);
            
            // Increment nonce to prevent replay attacks
            self._increment_nonce(caller);
        }

        /// Create message hash for signature verification
        fn _create_message_hash(
            self: @ContractState,
            caller: ContractAddress,
            handle: felt252,
            nonce: felt252
        ) -> felt252 {
            // Simple hash combination (in production, use proper SNIP-12)
            poseidon_hash_span(
                array![
                    caller.into(),
                    handle,
                    nonce,
                    get_contract_address().into(),
                    get_block_timestamp().into()
                ].span()
            )
        }

        /// Increment nonce for an account
        fn _increment_nonce(ref self: ContractState, account: ContractAddress) {
            let current_nonce = self.nonces.entry(account).read();
            self.nonces.entry(account).write(current_nonce + 1);
        }

        /// Paymaster function for gasless transactions (simplified implementation)
        fn _sponsor_transaction(self: @ContractState, _user: ContractAddress) -> bool {
            // Check if paymaster is enabled
            if !self.paymaster_enabled.read() {
                return false;
            }

            // In a real implementation, you would:
            // 1. Check if user is eligible for sponsorship
            // 2. Verify transaction details
            // 3. Pay for gas fees
            // 4. Update sponsorship limits/counters
            
            // For now, just return true if paymaster is enabled
            true
        }
    }
} 

//account owner  0x06622f4774d33f23a9181fe19bc4c0f09aab0a0b3d3f6bc7fdfb8fd860ac17bb
// contract address 0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e
// class hash 0x0215db8be37a5c0475d829dab3db3e318d0e2ebd7a390d22eed101dd299135fb
// starkscan url https://sepolia.starkscan.co/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e

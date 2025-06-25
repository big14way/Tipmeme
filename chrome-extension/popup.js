// TipMeme Extension Popup Script
class TipMemeExtension {
    constructor() {
        this.wallet = null;
        this.userAccount = null;
        this.contractAddress = CONFIG.TIPMEME_CONTRACT_ADDRESS;
        this.rpcUrl = CONFIG.STARKNET_RPC_URL;
        this.network = CONFIG.NETWORK;
        this.paymasterUrl = CONFIG.PAYMASTER_SERVICE_URL;
        this.tokenPrices = {
            'ETH': 2400,
            'STRK': 0.85,
            'USDC': 1.00
        };
        this.isConnecting = false;
    }

    async init() {
        this.updateContractInfo();
        await this.loadTwitterHandle();
        await this.checkConnection();
        this.setupEventListeners();
        this.generateMeme();
    }

    updateContractInfo() {
        // Update contract address display
        const contractElement = document.getElementById('contractAddress');
        if (contractElement && this.contractAddress) {
            const shortAddress = this.contractAddress.slice(0, 6) + '...' + this.contractAddress.slice(-4);
            contractElement.textContent = shortAddress;
            contractElement.title = this.contractAddress; // Show full address on hover
        }

        // Update network info
        const networkElement = document.getElementById('networkInfo');
        if (networkElement && this.network) {
            const networkName = this.network === 'sepolia' ? 'Starknet Sepolia Testnet' : `Starknet ${this.network}`;
            networkElement.textContent = networkName;
        }
    }

    setupEventListeners() {
        document.getElementById('argentxBtn').addEventListener('click', () => this.connectWallet('argentX'));
        document.getElementById('braavosBtn').addEventListener('click', () => this.connectWallet('braavos'));
        document.getElementById('amountInput').addEventListener('input', () => this.updateUSDDisplay());
        document.getElementById('tokenSelect').addEventListener('change', () => this.updateUSDDisplay());
        document.getElementById('tipBtn').addEventListener('click', () => this.sendTip());
        document.getElementById('recipientHandle').addEventListener('input', () => this.validateForm());
    }

    async checkConnection() {
        try {
            // Check wallet availability first
            const walletStatus = await this.checkWalletAvailability();
            
            if (walletStatus.hasWallet) {
                document.getElementById('connectionStatus').textContent = `🟢 ${walletStatus.walletType} Ready`;
                document.getElementById('connectionStatus').className = 'status-online';
                
                // Try to get connected account if available
                const accountStatus = await this.getConnectedAccount();
                if (accountStatus.connected) {
                    this.wallet = { type: walletStatus.walletType.toLowerCase() };
                    this.userAccount = accountStatus.address;
                    this.updateUIForConnectedState();
                }
            } else {
                const message = this.getWalletStatusMessage(walletStatus.walletType);
                document.getElementById('connectionStatus').textContent = message;
                document.getElementById('connectionStatus').className = 'status-offline';
            }
        } catch (error) {
            console.error('Connection check failed:', error);
            document.getElementById('connectionStatus').textContent = '🔴 Connection Error';
            document.getElementById('connectionStatus').className = 'status-offline';
        }
    }

    getWalletStatusMessage(walletType) {
        switch (walletType) {
            case 'unsupported_page':
                return '⚠️ Visit Twitter/X to connect';
            case 'none':
                return '🔴 No Wallet Detected';
            case 'error':
                return '🔴 Detection Error';
            default:
                return '🔴 No Wallet Found';
        }
    }

    async checkWalletAvailability() {
        try {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs[0]) {
                return { hasWallet: false, walletType: 'no_tab' };
            }

            const url = tabs[0].url;
            console.log('🔍 Extension checking tab:', { id: tabs[0].id, url: url, title: tabs[0].title });
            if (!url || (!url.includes('twitter.com') && !url.includes('x.com') && 
                        !url.includes('localhost') && !url.includes('127.0.0.1') && 
                        !url.startsWith('http'))) {
                return { hasWallet: false, walletType: 'unsupported_page' };
            }

            // Execute wallet detection with retry logic for timing issues
            const results = await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                world: 'MAIN', // Run in main world to access wallet objects
                func: async () => {
                    // Function to check wallets with retries
                    const checkWalletsWithRetry = async (maxAttempts = 3, delay = 1000) => {
                        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                            const debugInfo = {
                                pageUrl: window.location.href,
                                availableObjects: Object.keys(window).filter(k => k.includes('starknet') || k.includes('braavos') || k.includes('argent')),
                                directChecks: {
                                    starknet: !!window.starknet,
                                    starknet_braavos: !!window.starknet_braavos,
                                    starknet_argentX: !!window.starknet_argentX
                                },
                                attempt: attempt
                            };

                            // If wallets found, proceed with detection
                            if (debugInfo.directChecks.starknet || debugInfo.directChecks.starknet_braavos || debugInfo.directChecks.starknet_argentX) {
                                return performWalletDetection(debugInfo);
                            }

                            // If no wallets found and not last attempt, wait and try again
                            if (attempt < maxAttempts) {
                                await new Promise(resolve => setTimeout(resolve, delay));
                            } else {
                                // Last attempt failed
                                return {
                                    hasWallet: false,
                                    walletType: 'none',
                                    debug: debugInfo,
                                    detectedWallets: []
                                };
                            }
                        }
                    };

                                        // Separate function for actual wallet detection logic
                    const performWalletDetection = (debugInfo) => {
                        const detectWallets = () => {
                            const wallets = [];
                            
                            // Standard detection patterns - same as debug tool
                            const patterns = [
                                { key: 'starknet', name: 'Ready Wallet' },
                                { key: 'starknet_braavos', name: 'Braavos' },
                                { key: 'starknet_argentX', name: 'ArgentX' },
                                { key: 'braavos', name: 'Braavos' },
                                { key: 'argentX', name: 'ArgentX' },
                                { key: 'starknet_ready', name: 'Ready Wallet' },
                                { key: 'ready', name: 'Ready Wallet' }
                            ];

                            for (const pattern of patterns) {
                                try {
                                    const wallet = window[pattern.key];
                                    if (wallet && typeof wallet === 'object' && 
                                        (wallet.enable || wallet.request)) {
                                        wallets.push({
                                            key: pattern.key,
                                            name: pattern.name,
                                            id: wallet.id || pattern.key,
                                            wallet: wallet
                                        });
                                    }
                                } catch (e) {
                                    // Ignore individual check errors
                                }
                            }

                            return wallets;
                        };

                        const wallets = detectWallets();
                        
                        if (wallets.length > 0) {
                            const primary = wallets[0];
                            let walletType = 'Starknet Wallet';
                            
                            if (primary.key.includes('braavos') || primary.id === 'braavos') {
                                walletType = 'Braavos';
                            } else if (primary.key.includes('argent') || primary.key.includes('ready') || 
                                      primary.id === 'argentX' || primary.id === 'ready') {
                                walletType = 'Ready Wallet';
                            }

                            return { 
                                hasWallet: true, 
                                walletType,
                                walletId: primary.id,
                                wallets: wallets.map(w => ({ id: w.id, name: w.name, key: w.key })),
                                debug: debugInfo
                            };
                        }

                        return { 
                            hasWallet: false, 
                            walletType: 'none',
                            debug: debugInfo,
                            detectedWallets: wallets
                        };
                    };

                    // Start the detection with retry logic
                    return await checkWalletsWithRetry();
                }
            });

            console.log('🔍 Script injection results:', results);
            console.log('🔍 Actual result content:', JSON.stringify(results[0]?.result, null, 2));
            return results[0]?.result || { hasWallet: false, walletType: 'none' };
        } catch (error) {
            console.error('❌ Wallet detection error:', error);
            console.error('❌ Error details:', error.message);
            
            // Fallback: Try to detect wallets using a simpler approach
            console.log('🔄 Trying fallback detection method...');
            try {
                const simpleResults = await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Simple check without complex logic
                        const hasStarknet = !!window.starknet;
                        const hasBraavos = !!window.starknet_braavos;
                        const hasArgentX = !!window.starknet_argentX;
                        
                        console.log('Simple detection:', { hasStarknet, hasBraavos, hasArgentX });
                        
                        if (hasStarknet || hasBraavos || hasArgentX) {
                            return { 
                                hasWallet: true, 
                                walletType: hasStarknet ? 'Ready Wallet' : (hasBraavos ? 'Braavos' : 'ArgentX'),
                                method: 'fallback'
                            };
                        }
                        return { hasWallet: false, walletType: 'none', method: 'fallback' };
                    }
                });
                
                console.log('🔍 Fallback results:', simpleResults);
                return simpleResults[0]?.result || { hasWallet: false, walletType: 'error' };
            } catch (fallbackError) {
                console.error('❌ Fallback detection also failed:', fallbackError);
                return { hasWallet: false, walletType: 'error' };
            }
        }
    }

    async getConnectedAccount() {
        try {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs[0]) return { connected: false };

            const results = await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    // Check if any wallet is already connected
                    const checkConnection = async () => {
                        const wallets = [
                            window.starknet,
                            window.starknet_braavos,
                            window.braavos,
                            window.starknet_argentX,
                            window.argentX,
                            window.starknet_ready,
                            window.ready,
                            window.starknet_argent,
                            window.argent
                        ].filter(w => w && typeof w === 'object');

                        for (const wallet of wallets) {
                            try {
                                if (wallet.selectedAddress || wallet.account?.address) {
                                    return {
                                        connected: true,
                                        address: wallet.selectedAddress || wallet.account.address,
                                        walletId: wallet.id || 'unknown'
                                    };
                                }
                                
                                // Try to check if connected without triggering connection
                                if (wallet.isConnected) {
                                    return {
                                        connected: true,
                                        address: 'connected',
                                        walletId: wallet.id || 'unknown'
                                    };
                                }
                            } catch (e) {
                                // Continue checking other wallets
                            }
                        }
                        
                        return { connected: false };
                    };

                    return checkConnection();
                }
            });

            return results[0].result || { connected: false };
        } catch (error) {
            console.error('Connection check error:', error);
            return { connected: false };
        }
    }

    async connectWallet(walletType) {
        if (this.isConnecting) return;
        
        try {
            this.isConnecting = true;
            this.showProgress('Connecting wallet...', 20);

            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs[0]) {
                throw new Error('No active tab found. Please open Twitter/X.');
            }

            const url = tabs[0].url;
            if (!url.includes('twitter.com') && !url.includes('x.com') && 
                !url.includes('localhost') && !url.includes('127.0.0.1')) {
                throw new Error('Please navigate to Twitter/X to connect your wallet.');
            }

            this.showProgress('Requesting wallet connection...', 50);

            // Execute connection in the active tab
            const results = await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                world: 'MAIN', // Run in main world to access wallet objects
                func: async (targetWalletType) => {
                    try {
                        const connectToWallet = async () => {
                            // Find the appropriate wallet
                            let wallet = null;
                            let walletName = '';

                            if (targetWalletType === 'braavos') {
                                wallet = window.starknet_braavos || window.braavos || 
                                        (window.starknet && window.starknet.id === 'braavos' ? window.starknet : null);
                                walletName = 'Braavos';
                            } else if (targetWalletType === 'argentX') {
                                wallet = window.starknet_argentX || window.argentX || 
                                        window.starknet_ready || window.ready ||
                                        window.starknet_argent || window.argent ||
                                        (window.starknet && (window.starknet.id === 'argentX' || 
                                                            window.starknet.id === 'ready') ? window.starknet : null);
                                walletName = 'ArgentX';
                            }

                            if (!wallet) {
                                return {
                                    success: false,
                                    error: `${walletName} wallet not found. Please make sure it's installed and unlocked.`
                                };
                            }

                            // Attempt connection
                            let accounts = null;
                            
                            try {
                                // Try enable method first (older API)
                                if (wallet.enable) {
                                    accounts = await wallet.enable();
                                }
                                // Try request method (newer API)
                                else if (wallet.request) {
                                    accounts = await wallet.request({ method: 'wallet_requestAccounts' });
                                    if (!accounts) {
                                        accounts = await wallet.request({ method: 'starknet_requestAccounts' });
                                    }
                                }
                                // Direct account access
                                else if (wallet.account) {
                                    accounts = [wallet.account.address];
                                }
                            } catch (error) {
                                console.error('Connection attempt failed:', error);
                                return {
                                    success: false,
                                    error: `Failed to connect to ${walletName}. Please try again.`
                                };
                            }

                            if (!accounts || accounts.length === 0) {
                                return {
                                    success: false,
                                    error: `No accounts found in ${walletName}. Please unlock your wallet.`
                                };
                            }

                            return {
                                success: true,
                                address: accounts[0],
                                walletType: walletName,
                                walletId: wallet.id || targetWalletType
                            };
                        };

                        return await connectToWallet();
                    } catch (error) {
                        return {
                            success: false,
                            error: error.message || 'An unexpected error occurred'
                        };
                    }
                },
                args: [walletType]
            });

            if (!results || !results[0] || !results[0].result) {
                throw new Error('Script execution failed. Please try again.');
            }

            const result = results[0].result;
            
            if (result && result.success) {
                this.wallet = { type: walletType };
                this.userAccount = result.address;
                
                this.showProgress('Connected successfully!', 100);
                setTimeout(() => {
                    this.hideProgress();
                    this.updateUIForConnectedState();
                    this.showStatus(`Connected to ${result.walletType}`, 'success');
                }, 1000);
            } else {
                const errorMsg = result && result.error ? result.error : 'Connection failed';
                throw new Error(errorMsg);
            }

        } catch (error) {
            console.error('Wallet connection error:', error);
            this.hideProgress();
            this.showStatus(`Connection failed: ${error.message}`, 'error');
        } finally {
            this.isConnecting = false;
        }
    }

    updateUIForConnectedState() {
        if (this.userAccount) {
            const shortAddress = `${this.userAccount.slice(0, 6)}...${this.userAccount.slice(-4)}`;
            document.getElementById('connectionStatus').textContent = `🟢 Connected (${shortAddress})`;
            document.getElementById('connectionStatus').className = 'status-online';
            
            // Enable the tip functionality
            this.validateForm();
        }
    }

    async loadTwitterHandle() {
        try {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (tabs[0] && (tabs[0].url.includes('twitter.com') || tabs[0].url.includes('x.com'))) {
                const handle = this.extractTwitterHandle(tabs[0].url) || 'cryptodev';
                document.getElementById('twitterHandle').textContent = `@${handle}`;
                document.getElementById('recipientHandle').value = handle;
            } else {
                document.getElementById('twitterHandle').textContent = '@cryptodev';
                document.getElementById('recipientHandle').value = 'cryptodev';
            }
        } catch (error) {
            document.getElementById('twitterHandle').textContent = '@cryptodev';
            document.getElementById('recipientHandle').value = 'cryptodev';
        }
    }

    extractTwitterHandle(url) {
        const match = url.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/);
        return match ? match[1] : null;
    }

    async generateMeme() {
        setTimeout(() => {
            const memePreview = document.getElementById('memePreview');
            memePreview.innerHTML = `
                <div class="meme-generated">
                    <div class="meme-content">
                        <span class="meme-emoji">🚀💎🌙</span>
                        <div class="meme-text">TO THE MOON!</div>
                        <div class="meme-subtext">Much Tip, Very Crypto</div>
                    </div>
                </div>
            `;
        }, 3000);
    }

    updateUSDDisplay() {
        const amount = parseFloat(document.getElementById('amountInput').value) || 0;
        const tokenSelect = document.getElementById('tokenSelect');
        const selectedOption = tokenSelect.options[tokenSelect.selectedIndex];
        const symbol = selectedOption.getAttribute('data-symbol');
        
        if (symbol && this.tokenPrices[symbol]) {
            const usdValue = amount * this.tokenPrices[symbol];
            document.getElementById('usdDisplay').textContent = `$${usdValue.toFixed(2)}`;
        } else {
            document.getElementById('usdDisplay').textContent = '$0.00';
        }

        this.validateForm();
    }

    validateForm() {
        const amount = document.getElementById('amountInput').value;
        const token = document.getElementById('tokenSelect').value;
        const recipient = document.getElementById('recipientHandle').value;
        const isConnected = this.wallet !== null;

        const isValid = amount && token && recipient && isConnected;
        document.getElementById('tipBtn').disabled = !isValid;
    }

    async sendTip() {
        try {
            this.showProgress('Preparing tip...', 25);
            
            const amount = document.getElementById('amountInput').value;
            const token = document.getElementById('tokenSelect').value;
            const recipient = document.getElementById('recipientHandle').value;
            
            this.showProgress('Sending transaction...', 75);
            
            // Simulate transaction
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showProgress('Tip sent successfully!', 100);
            
            setTimeout(() => {
                this.hideProgress();
                this.showStatus(`Tipped ${amount} ${token} to @${recipient}!`, 'success');
                this.resetForm();
            }, 1000);
            
        } catch (error) {
            this.hideProgress();
            this.showStatus('Failed to send tip', 'error');
        }
    }

    showProgress(text, percentage) {
        const progressContainer = document.getElementById('progressContainer');
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');
        
        progressText.textContent = text;
        progressFill.style.width = percentage + '%';
        progressContainer.style.display = 'block';
    }

    updateProgress(text, percentage) {
        document.getElementById('progressText').textContent = text;
        document.getElementById('progressFill').style.width = percentage + '%';
    }

    hideProgress() {
        document.getElementById('progressContainer').style.display = 'none';
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('statusMessage');
        statusDiv.textContent = message;
        statusDiv.className = `status-message status-${type}`;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }

    resetForm() {
        document.getElementById('amountInput').value = '';
        document.getElementById('tokenSelect').selectedIndex = 0;
        this.updateUSDDisplay();
    }
}

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
    const extension = new TipMemeExtension();
    extension.init();
});

// Fallback for testing environment
if (typeof chrome === 'undefined') {
    window.chrome = {
        tabs: {
            query: async () => [{url: 'https://twitter.com/ethereum'}]
        }
    };
} 
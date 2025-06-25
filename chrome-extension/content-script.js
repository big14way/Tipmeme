/**
 * TipMeme Chrome Extension Content Script
 * Injects "Tip with Meme" button on Twitter profiles
 */

class TipMemeTwitterIntegration {
    constructor() {
        this.currentHandle = null;
        this.observer = null;
        this.rateLimitTracker = new Map();
        this.registryContractAddress = null;
        this.starknetProvider = null;
        
        // Rate limiting configuration
        this.RATE_LIMIT_WINDOW = 60000; // 1 minute
        this.MAX_REQUESTS_PER_WINDOW = 10;
        
        this.init();
    }

    async init() {
        try {
            // Load configuration from storage
            await this.loadConfig();
            
            // Initialize Starknet provider
            this.initializeStarknetProvider();
            
            // Start observing Twitter's DOM changes
            this.startObserver();
            
            // Initial injection attempt
            this.injectTipButton();
            
            console.log('TipMeme Twitter integration initialized');
        } catch (error) {
            console.error('Failed to initialize TipMeme integration:', error);
        }
    }

    async loadConfig() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([
                'registryContractAddress',
                'starknetRpcUrl',
                'tipMemeContractAddress'
            ], (result) => {
                this.registryContractAddress = result.registryContractAddress || 
                    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'; // Default
                this.starknetRpcUrl = result.starknetRpcUrl || 
                    'https://starknet-sepolia.public.blastapi.io/rpc/v0_8';
                this.tipMemeContractAddress = result.tipMemeContractAddress;
                resolve();
            });
        });
    }

    initializeStarknetProvider() {
        // Note: In a real implementation, you'd import starknet.js
        // For now, we'll use a mock provider structure
        this.starknetProvider = {
            async call(contractAddress, functionName, calldata = []) {
                // Mock implementation - replace with actual starknet.js calls
                console.log(`Calling ${functionName} on ${contractAddress} with`, calldata);
                return { result: ['0x0'] }; // Mock response
            }
        };
    }

    startObserver() {
        // Disconnect existing observer
        if (this.observer) {
            this.observer.disconnect();
        }

        // Create new MutationObserver for SPA navigation
        this.observer = new MutationObserver((mutations) => {
            let shouldReinject = false;

            mutations.forEach((mutation) => {
                // Check if URL changed (Twitter SPA navigation)
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check for Twitter's main content area
                            if (node.matches?.('[data-testid="primaryColumn"]') ||
                                node.querySelector?.('[data-testid="primaryColumn"]') ||
                                node.matches?.('[role="main"]') ||
                                node.querySelector?.('[role="main"]')) {
                                shouldReinject = true;
                            }
                        }
                    });
                }
            });

            if (shouldReinject) {
                // Debounce reinject calls
                clearTimeout(this.reinjectTimeout);
                this.reinjectTimeout = setTimeout(() => {
                    this.injectTipButton();
                }, 500);
            }
        });

        // Start observing
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    extractTwitterHandle() {
        // Extract handle from current URL
        const urlMatch = window.location.pathname.match(/^\/([^\/]+)$/);
        if (urlMatch && urlMatch[1] && !this.isNonProfilePath(urlMatch[1])) {
            return urlMatch[1];
        }

        // Fallback: Extract from page content
        const handleElements = [
            'h2[dir="ltr"] span', // Profile display name area
            '[data-testid="UserName"] span[dir="ltr"]', // Username in header
            'div[dir="ltr"] span[style*="color: rgb(83, 100, 113)"]' // Grayed username
        ];

        for (const selector of handleElements) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent?.trim();
                if (text && text.startsWith('@')) {
                    return text.substring(1); // Remove @ symbol
                }
            }
        }

        return null;
    }

    isNonProfilePath(path) {
        const nonProfilePaths = [
            'home', 'explore', 'notifications', 'messages', 'bookmarks',
            'lists', 'profile', 'more', 'compose', 'search', 'settings',
            'i', 'intent', 'hashtag', 'status'
        ];
        return nonProfilePaths.includes(path.toLowerCase());
    }

    async injectTipButton() {
        const handle = this.extractTwitterHandle();
        
        // Don't inject if no handle or same handle
        if (!handle || handle === this.currentHandle) {
            return;
        }

        this.currentHandle = handle;

        // Remove existing tip button
        this.removeTipButton();

        // Find the follow button container
        const followButtonContainer = this.findFollowButtonContainer();
        
        if (!followButtonContainer) {
            console.log('Follow button container not found, retrying...');
            setTimeout(() => this.injectTipButton(), 1000);
            return;
        }

        // Create and inject tip button
        const tipButton = this.createTipButton(handle);
        
        // Insert after follow button
        followButtonContainer.parentNode.insertBefore(tipButton, followButtonContainer.nextSibling);
        
        console.log(`Injected tip button for @${handle}`);
    }

    findFollowButtonContainer() {
        // Multiple selectors for different Twitter layouts
        const selectors = [
            '[data-testid="placementTracking"] div[role="button"]', // Follow button
            'div[aria-label*="Follow"]', // Follow button by aria-label
            'div[data-testid="userActions"]', // User actions container
            'div[role="button"]:has-text("Follow")', // Generic follow button
            'div[role="button"]:has-text("Following")', // Following button
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent?.toLowerCase();
                if (text && (text.includes('follow') || text.includes('following') || text.includes('unfollow'))) {
                    return element;
                }
            }
        }

        // Fallback: look for button in header area
        const headerButtons = document.querySelectorAll('div[data-testid="userActions"] > div');
        return headerButtons.length > 0 ? headerButtons[0] : null;
    }

    createTipButton(handle) {
        const button = document.createElement('div');
        button.className = 'tipmeme-button';
        button.setAttribute('data-handle', handle);
        
        // Style to match Twitter's design
        button.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 12px;
            padding: 8px 16px;
            background-color: rgb(239, 243, 244);
            border: 1px solid rgb(207, 217, 222);
            border-radius: 9999px;
            cursor: pointer;
            font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
            color: rgb(15, 20, 25);
            text-decoration: none;
            transition: all 0.2s;
            user-select: none;
            min-height: 32px;
            min-width: 32px;
        `;

        // Button content
        button.innerHTML = `
            <span style="margin-right: 4px;">🎯</span>
            <span>Tip with Meme</span>
        `;

        // Hover effects
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'rgb(215, 219, 220)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'rgb(239, 243, 244)';
        });

        // Click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleTipButtonClick(handle);
        });

        return button;
    }

    removeTipButton() {
        const existingButton = document.querySelector('.tipmeme-button');
        if (existingButton) {
            existingButton.remove();
        }
    }

    async handleTipButtonClick(handle) {
        try {
            // Check rate limiting
            if (this.isRateLimited()) {
                this.showError('Too many requests. Please wait a moment.');
                return;
            }

            this.updateRateLimit();

            // Show loading state
            const button = document.querySelector('.tipmeme-button');
            const originalContent = button.innerHTML;
            button.innerHTML = '<span>🔄</span><span>Loading...</span>';
            button.style.pointerEvents = 'none';

            try {
                // Query registry contract for linked Starknet address
                const starknetAddress = await this.queryRegistryContract(handle);
                
                // Prepare data for popup
                const profileData = {
                    handle: handle,
                    starknetAddress: starknetAddress,
                    profileUrl: window.location.href,
                    timestamp: Date.now()
                };

                // Store data and open popup
                await this.openTipPopup(profileData);

            } catch (error) {
                console.error('Error handling tip button click:', error);
                this.showError(`Failed to load profile data: ${error.message}`);
            } finally {
                // Restore button state
                button.innerHTML = originalContent;
                button.style.pointerEvents = 'auto';
            }

        } catch (error) {
            console.error('Error in tip button click handler:', error);
            this.showError('An unexpected error occurred');
        }
    }

    async queryRegistryContract(handle) {
        try {
            if (!this.registryContractAddress) {
                throw new Error('Registry contract address not configured');
            }

            // Convert handle to felt252 for Cairo contract call
            const handleFelt = this.stringToFelt252(handle);
            
            // Call registry contract to get linked Starknet address
            const result = await this.starknetProvider.call(
                this.registryContractAddress,
                'get_starknet_address', // Function name in registry contract
                [handleFelt]
            );

            // Parse result
            const starknetAddress = result.result[0];
            
            // Check if address is set (not zero)
            if (starknetAddress === '0x0' || starknetAddress === '0') {
                return null; // No linked address
            }

            return starknetAddress;

        } catch (error) {
            console.error('Error querying registry contract:', error);
            // Return null for unlinked accounts rather than throwing
            return null;
        }
    }

    stringToFelt252(str) {
        // Convert string to felt252 (simplified implementation)
        // In production, use proper encoding
        let felt = '0x';
        for (let i = 0; i < Math.min(str.length, 31); i++) {
            felt += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return felt;
    }

    async openTipPopup(profileData) {
        // Store profile data for popup access
        await new Promise((resolve) => {
            chrome.storage.local.set({
                tipProfileData: profileData,
                tipPopupTimestamp: Date.now()
            }, resolve);
        });

        // Send message to background script to open popup
        chrome.runtime.sendMessage({
            action: 'openTipPopup',
            data: profileData
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error opening popup:', chrome.runtime.lastError);
                this.showError('Failed to open tip interface');
            }
        });
    }

    isRateLimited() {
        const now = Date.now();
        const windowStart = now - this.RATE_LIMIT_WINDOW;
        
        // Clean old entries
        for (const [timestamp] of this.rateLimitTracker) {
            if (timestamp < windowStart) {
                this.rateLimitTracker.delete(timestamp);
            }
        }

        return this.rateLimitTracker.size >= this.MAX_REQUESTS_PER_WINDOW;
    }

    updateRateLimit() {
        this.rateLimitTracker.set(Date.now(), true);
    }

    showError(message) {
        // Create temporary error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgb(244, 33, 46);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: TwitterChirp, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.removeTipButton();
        clearTimeout(this.reinjectTimeout);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TipMemeTwitterIntegration();
    });
} else {
    new TipMemeTwitterIntegration();
}

// Handle extension unload
window.addEventListener('beforeunload', () => {
    if (window.tipMemeIntegration) {
        window.tipMemeIntegration.destroy();
    }
});

// Export for potential external access
window.tipMemeIntegration = TipMemeTwitterIntegration; 
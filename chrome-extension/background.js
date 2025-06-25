/**
 * TipMeme Chrome Extension Background Service Worker
 * Handles popup management and extension lifecycle
 */

class TipMemeBackground {
    constructor() {
        this.init();
    }

    init() {
        // Listen for messages from content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async response
        });

        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstalled(details);
        });

        // Handle tab updates (navigation)
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdated(tabId, changeInfo, tab);
        });

        console.log('TipMeme background service worker initialized');
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.action) {
                case 'openTipPopup':
                    await this.openTipPopup(message.data, sender.tab);
                    sendResponse({ success: true });
                    break;

                case 'getConfig':
                    const config = await this.getStoredConfig();
                    sendResponse({ success: true, config });
                    break;

                case 'updateConfig':
                    await this.updateConfig(message.config);
                    sendResponse({ success: true });
                    break;

                case 'trackAnalytics':
                    await this.trackAnalytics(message.event, message.data);
                    sendResponse({ success: true });
                    break;

                default:
                    console.warn('Unknown message action:', message.action);
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async openTipPopup(profileData, sourceTab) {
        try {
            // Store the profile data with a timestamp
            await chrome.storage.local.set({
                tipProfileData: {
                    ...profileData,
                    sourceTabId: sourceTab.id,
                    timestamp: Date.now()
                }
            });

            // Open the extension popup
            // Note: In Manifest V3, we can't programmatically open the popup
            // Instead, we'll use chrome.action.setBadgeText to indicate there's a tip ready
            await chrome.action.setBadgeText({
                text: '!',
                tabId: sourceTab.id
            });

            await chrome.action.setBadgeBackgroundColor({
                color: '#1DA1F2' // Twitter blue
            });

            // Show notification
            await this.showNotification(
                'TipMeme Ready',
                `Click the TipMeme extension icon to tip @${profileData.handle}`,
                sourceTab.id
            );

            // Auto-clear badge after 30 seconds
            setTimeout(async () => {
                try {
                    await chrome.action.setBadgeText({ text: '', tabId: sourceTab.id });
                } catch (e) {
                    // Tab might be closed
                }
            }, 30000);

        } catch (error) {
            console.error('Error opening tip popup:', error);
            throw error;
        }
    }

    async getStoredConfig() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([
                'registryContractAddress',
                'starknetRpcUrl',
                'tipMemeContractAddress',
                'defaultTipAmount',
                'preferredTokens',
                'walletAddress'
            ], (result) => {
                resolve({
                    registryContractAddress: result.registryContractAddress || 
                        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
                    starknetRpcUrl: result.starknetRpcUrl || 
                        'https://starknet-mainnet.public.blastapi.io',
                    tipMemeContractAddress: result.tipMemeContractAddress || '',
                    defaultTipAmount: result.defaultTipAmount || '1',
                    preferredTokens: result.preferredTokens || ['ETH', 'STRK'],
                    walletAddress: result.walletAddress || ''
                });
            });
        });
    }

    async updateConfig(config) {
        return new Promise((resolve) => {
            chrome.storage.sync.set(config, () => {
                console.log('Config updated:', config);
                resolve();
            });
        });
    }

    async trackAnalytics(event, data) {
        // Store analytics locally (in production, send to analytics service)
        const analyticsData = {
            event,
            data,
            timestamp: Date.now(),
            url: data.url || 'unknown'
        };

        try {
            const existing = await chrome.storage.local.get(['analytics']);
            const analytics = existing.analytics || [];
            analytics.push(analyticsData);

            // Keep only last 1000 events
            if (analytics.length > 1000) {
                analytics.splice(0, analytics.length - 1000);
            }

            await chrome.storage.local.set({ analytics });
        } catch (error) {
            console.error('Error storing analytics:', error);
        }
    }

    async showNotification(title, message, tabId) {
        // Only show notifications if user hasn't disabled them
        const settings = await chrome.storage.sync.get(['showNotifications']);
        if (settings.showNotifications === false) {
            return;
        }

        try {
            // Create notification
            const notificationId = `tipmeme-${Date.now()}`;
            
            // For now, we'll just log the notification
            // In production, you might want to use chrome.notifications API
            console.log(`Notification [${title}]: ${message}`);
            
            // Could implement chrome.notifications.create here if needed
            
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    handleInstalled(details) {
        console.log('TipMeme extension installed:', details);

        if (details.reason === 'install') {
            // Set default configuration
            this.setDefaultConfig();
            
            // Open welcome page
            chrome.tabs.create({
                url: chrome.runtime.getURL('welcome.html')
            });
        } else if (details.reason === 'update') {
            console.log('Extension updated from version:', details.previousVersion);
            
            // Handle migration if needed
            this.handleConfigMigration(details.previousVersion);
        }
    }

    async setDefaultConfig() {
        // Import config if available
        let config;
        try {
            // Dynamic import for config
            const configModule = await import('./config.js');
            config = configModule.CONFIG;
        } catch (e) {
            // Fallback to hardcoded values if config.js is not available
            config = {
                TIPMEME_CONTRACT_ADDRESS: '0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e',
                STARKNET_RPC_URL: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_8',
                NETWORK: 'sepolia',
                PAYMASTER_SERVICE_URL: 'http://localhost:3001'
            };
        }

        const defaultConfig = {
            registryContractAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
            starknetRpcUrl: config.STARKNET_RPC_URL,
            tipMemeContractAddress: config.TIPMEME_CONTRACT_ADDRESS,
            defaultTipAmount: '1',
            preferredTokens: ['ETH', 'STRK'],
            showNotifications: true,
            autoDetectHandles: true
        };

        await chrome.storage.sync.set(defaultConfig);
        console.log('Default configuration set');
    }

    async handleConfigMigration(previousVersion) {
        console.log(`Migrating config from version ${previousVersion}`);
        
        // Add migration logic here if needed for future versions
        // For example:
        // if (previousVersion < '1.1.0') {
        //     // Migrate config changes
        // }
    }

    handleTabUpdated(tabId, changeInfo, tab) {
        // Clear badge when user navigates away from Twitter
        if (changeInfo.status === 'complete' && tab.url) {
            if (!tab.url.includes('twitter.com') && !tab.url.includes('x.com')) {
                chrome.action.setBadgeText({ text: '', tabId });
            }
        }
    }
}

// Error handling for service worker
self.addEventListener('error', (event) => {
    console.error('TipMeme service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('TipMeme service worker unhandled rejection:', event.reason);
});

// Initialize background service
const tipMemeBackground = new TipMemeBackground(); 
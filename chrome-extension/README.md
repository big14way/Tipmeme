# TipMeme Chrome Extension

A Chrome extension that enables cryptocurrency tipping on Twitter using Starknet and the TipMeme Cairo smart contract.

## Features

### 🎯 **Core Functionality**
- **Smart Button Injection**: Automatically injects "Tip with Meme" buttons next to Twitter follow buttons
- **SPA Navigation Support**: Uses MutationObserver to handle Twitter's single-page application navigation
- **Profile Detection**: Extracts Twitter handles from URLs and page content
- **Contract Integration**: Queries registry contracts for linked Starknet addresses
- **Rate Limiting**: Built-in protection against API abuse

### 🔒 **Security & UX**
- **Error Handling**: Comprehensive error handling for network issues and rate limits
- **Accessibility**: Full accessibility support with focus management and screen reader compatibility
- **Responsive Design**: Mobile-friendly interface that adapts to different screen sizes
- **Dark Mode**: Automatic dark mode detection and styling

### ⚡ **Performance**
- **Efficient DOM Watching**: Optimized MutationObserver with debounced injections
- **Memory Management**: Proper cleanup and memory leak prevention
- **Lazy Loading**: Components load only when needed

## Installation

### Development Installation

1. **Clone or download** the extension files to a local directory
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top right)
4. **Click "Load unpacked"** and select the `chrome-extension` directory
5. **Pin the extension** to your toolbar for easy access

### Directory Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── content-script.js      # Main Twitter injection script
├── background.js          # Service worker for popup management
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality (to be created)
├── styles.css            # Custom styles for injected elements
└── README.md             # This file
```

## Usage

### 1. **Browse Twitter**
- Visit any Twitter profile (e.g., `https://twitter.com/username`)
- The extension automatically detects the profile

### 2. **Tip Button Appears**
- A "🎯 Tip with Meme" button appears next to the follow button
- Button automatically updates when navigating between profiles

### 3. **Initiate Tip**
- Click the tip button to start the tipping process
- Extension badge shows "!" when tip interface is ready
- Click the extension icon to open the tip interface

### 4. **Send Tip**
- Select token (ETH, STRK, USDC, MEME)
- Enter amount and optional message
- Confirm transaction through your Starknet wallet

## Configuration

### Storage Settings

The extension uses Chrome's storage API to persist configuration:

```javascript
// Sync storage (across devices)
{
  registryContractAddress: "0x...",    // Registry contract address
  starknetRpcUrl: "https://...",       // Starknet RPC endpoint
      tipMemeContractAddress: "0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e",     // TipMeme contract address
  defaultTipAmount: "1",               // Default tip amount
  preferredTokens: ["ETH", "STRK"],    // Preferred token list
  showNotifications: true,             // Show notifications
  autoDetectHandles: true              // Auto-detect Twitter handles
}

// Local storage (device specific)
{
  tipProfileData: {...},               // Current profile data
  analytics: [...],                    // Usage analytics
  rateLimitTracker: new Map()          // Rate limiting data
}
```

### Contract Integration

The extension integrates with two main smart contracts:

1. **Registry Contract**: Maps Twitter handles to Starknet addresses
2. **TipMeme Contract**: Handles the actual tipping functionality

## Technical Architecture

### Content Script (`content-script.js`)

```javascript
class TipMemeTwitterIntegration {
  // Core features:
  - DOM injection and management
  - Twitter handle extraction
  - MutationObserver for SPA navigation
  - Rate limiting protection
  - Starknet contract queries
  - Error handling and notifications
}
```

### Background Service Worker (`background.js`)

```javascript
class TipMemeBackground {
  // Core features:
  - Message handling between content script and popup
  - Configuration management
  - Analytics tracking
  - Extension lifecycle management
  - Badge management
}
```

### Key Methods

#### Content Script
- `extractTwitterHandle()`: Extract handle from URL/DOM
- `injectTipButton()`: Inject tip button into Twitter UI
- `queryRegistryContract()`: Check for linked Starknet address
- `handleTipButtonClick()`: Process tip button interactions

#### Background Script
- `openTipPopup()`: Manage popup opening and data passing
- `handleMessage()`: Process messages from content script
- `trackAnalytics()`: Track usage and errors

## Rate Limiting

Built-in rate limiting prevents abuse:

```javascript
// Configuration
RATE_LIMIT_WINDOW: 60000,        // 1 minute window
MAX_REQUESTS_PER_WINDOW: 10      // Max 10 requests per minute
```

## Error Handling

Comprehensive error handling covers:

- **Network Errors**: Starknet RPC failures
- **Rate Limiting**: Too many requests
- **Invalid Handles**: Malformed Twitter handles
- **Contract Errors**: Smart contract call failures
- **DOM Errors**: Twitter UI changes

## Browser Compatibility

- **Chrome**: v88+ (Manifest V3 required)
- **Edge**: v88+ (Chromium-based)
- **Brave**: v1.20+
- **Opera**: v74+

## Development

### Local Development

1. **Make changes** to any file in the extension directory
2. **Reload the extension** in `chrome://extensions/`
3. **Refresh Twitter tabs** to test changes
4. **Check console** for errors and logs

### Testing

```bash
# Test handle extraction
console.log(window.tipMemeIntegration.extractTwitterHandle());

# Test button injection
window.tipMemeIntegration.injectTipButton();

# Test rate limiting
window.tipMemeIntegration.isRateLimited();
```

### Debugging

1. **Content Script**: Open DevTools on Twitter page
2. **Background Script**: Go to `chrome://extensions/`, click "service worker"
3. **Popup**: Right-click extension icon → "Inspect popup"

## Security Considerations

### Data Protection
- No sensitive data stored in extension
- All wallet interactions go through user's Starknet wallet
- Rate limiting prevents abuse
- Input validation on all user inputs

### Permissions
```json
{
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["https://twitter.com/*", "https://x.com/*"]
}
```

## Integration with TipMeme Contract

The extension works with the TipMeme Cairo contract:

```cairo
// TipMeme contract functions used:
fn tip(recipient: felt252, token: ContractAddress, amount: u256)
fn get_tips(handle: felt252) -> Array<TipStruct>
fn withdraw(handle: felt252, signature: Array<felt252>)
```

## Future Enhancements

### Planned Features
- [ ] **Multi-platform Support**: Support for more social platforms
- [ ] **Batch Tipping**: Tip multiple creators at once
- [ ] **Tip Scheduling**: Schedule recurring tips
- [ ] **Advanced Analytics**: Detailed tipping statistics
- [ ] **Custom Tokens**: Support for custom ERC20 tokens
- [ ] **Tip Leaderboards**: Show top tippers and recipients

### Technical Improvements
- [ ] **Wallet Integration**: Direct wallet connection
- [ ] **Offline Support**: Cache and sync when online
- [ ] **Performance Optimization**: Faster DOM operations
- [ ] **Enhanced Error Recovery**: Better error handling

## Support

### Common Issues

1. **Button not appearing**: Refresh the page or check if you're on a profile
2. **Rate limiting**: Wait a minute before trying again
3. **Contract errors**: Check Starknet network status
4. **Popup not opening**: Click the extension icon after clicking tip button

### Contact

For bugs, feature requests, or questions:
- Create an issue in the repository
- Check console logs for error details
- Include browser version and extension version

## License

MIT License - see LICENSE file for details 
# 🎯 TipMeme Platform

**The Complete Social Media Crypto Tipping Ecosystem on Starknet**

TipMeme is a comprehensive platform that combines a **Chrome browser extension** for Twitter tipping with a **Creator Dashboard** for managing earnings, all powered by Starknet blockchain technology.

---

## 🌟 **Platform Components**

### 🚀 **Chrome Extension** ✅ **FULLY WORKING**
- **Direct Twitter Integration**: Seamlessly tip content creators on Twitter profiles
- **Cyberpunk UI**: Beautiful neon-themed interface with animations
- **Multi-Wallet Support**: 
  - ✅ **ArgentX (Ready Wallet)** - Fully supported & tested
  - ✅ **Braavos** - Fully supported & tested
  - **Auto-detection with retry logic** for reliable wallet connections
- **Real-time Conversion**: Live USD price display for tips
- **Secure Script Injection**: Runs in main world context for proper wallet access
- **Configuration System**: Centralized config for contract addresses and settings

### 📊 **Creator Dashboard** ✅ **FULLY WORKING**
- **Wallet Connection**: Working ArgentX and Braavos integration
- **Contract Integration**: Connected to deployed TipMeme contract
- **Earnings Analytics**: Comprehensive charts and statistics  
- **Tip Leaderboards**: See top tippers and trending content
- **Withdrawal Panel**: Easy fund management and withdrawals
- **Transaction History**: Complete audit trail of all tips received
- **Extension Demo**: Live preview of Chrome extension functionality

---

## 🛠 **Tech Stack**

- **Blockchain**: Starknet (Layer 2 on Ethereum)
- **Smart Contract**: Cairo 2.0
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Chart.js + Recharts  
- **Wallet**: Starknet React + ArgentX/Braavos
- **Extension**: Manifest V3 + Content Scripts

---

## 📋 **Contract Details**

- **Contract Address**: `0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e`
- **Network**: Starknet Sepolia Testnet
- **Explorer**: [View on Starkscan](https://sepolia.starkscan.co/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e)
- **Status**: ✅ Deployed & Verified
- **RPC URL**: `https://starknet-sepolia.public.blastapi.io/rpc/v0_8`

---

## 🚀 **Quick Start**

### **1. Setup Development Environment**

```bash
# Clone the repository
git clone https://github.com/big14way/Tipmeme.git
cd Tipmeme

# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard will be available at: `http://localhost:3000`
Extension demo at: `http://localhost:3000/extension-demo`

### **2. Chrome Extension Setup**

```bash
# Load the extension in Chrome
1. Go to chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the chrome-extension/ folder
5. Extension will auto-detect ArgentX and Braavos wallets
```

### **3. Wallet Setup**

```bash
# Install Required Wallets
- ArgentX (Ready Wallet): https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb
- Braavos: https://chrome.google.com/webstore/detail/braavos-starknet-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma

# Get Test Tokens
- STRK Faucet: https://starknet-faucet.vercel.app/
- ETH Faucet: https://blastapi.io/faucets/starknet-sepolia-eth
```

---

## 📁 **Project Structure**

```
tipmeme-platform/
├── 📱 app/                          # Next.js App Router
│   ├── 🏠 page.tsx                  # Creator Dashboard (main)
│   ├── 🎮 extension-demo/page.tsx   # Chrome Extension Demo
│   ├── 🎨 globals.css               # Global styles
│   ├── 📄 layout.tsx                # Root layout
│   └── 🔧 providers.tsx             # Starknet providers
├── 🧩 components/                   # Reusable components
│   ├── 📊 dashboard/                # Dashboard components
│   │   ├── 💰 gasless-withdraw.tsx  # Withdrawal functionality
│   │   ├── 🔐 login-section.tsx     # Wallet connection
│   │   └── ... other dashboard components
│   └── 🎨 ui/                       # shadcn/ui components
├── 📚 lib/                          # Shared libraries
│   ├── ⚙️ contract-config.ts        # Contract configuration
│   ├── 💸 paymaster.ts              # Gasless transactions
│   └── 🛠️ utils.ts                   # Utility functions
├── 🌐 chrome-extension/             # Browser Extension
│   ├── 📄 manifest.json             # Extension manifest
│   ├── ⚙️ config.js                 # Extension configuration
│   ├── 🔧 background.js             # Service worker
│   ├── 📝 content-script.js         # Twitter integration
│   ├── 🎨 popup.html                # Extension popup
│   ├── ⚛️  popup.js                 # Extension logic (MAIN)
│   ├── 🎨 styles.css                # Extension styles
│   ├── 📚 README.md                 # Extension docs
│   ├── 🧪 TESTING_GUIDE.md          # Testing instructions
│   └── 🔍 debug-wallets.html        # Wallet testing tool
├── 🏗️ src/                          # Cairo smart contract
│   └── lib.cairo                    # TipMeme contract
├── 🧪 tests/                        # Contract tests
├── 📜 scripts/                      # Deployment scripts
├── 🛠️ paymaster-service/            # Gasless transaction service
└── 📋 DEPLOYMENT_GUIDE.md           # Production deployment guide
```

---

## 🎮 **Features & Usage**

### **Chrome Extension Features** ✅

- **🎯 Twitter Button Injection**: Automatically adds tip buttons to Twitter profiles
- **💸 Easy Tipping**: Select token (ETH/STRK), enter amount, and send tips
- **🛡️ Secure Wallet Integration**: 
  - **Multi-world script execution** for proper wallet access
  - **Automatic retry logic** for timing issues
  - **Debug information** for troubleshooting
- **⚡ Real-time Updates**: Live USD conversion and transaction status
- **🔍 Advanced Debugging**: Built-in wallet detection testing
- **⚙️ Centralized Configuration**: Contract addresses and settings in `config.js`

### **Creator Dashboard Features** ✅

- **🔐 Wallet Connection**: Working integration with ArgentX and Braavos
- **📈 Analytics Overview**: Comprehensive earnings and tip statistics
- **🏆 Leaderboards**: See top tippers and most popular content
- **💰 Withdrawal Management**: Easy fund withdrawals and balance tracking
- **📊 Charts & Graphs**: Visual representation of earnings over time
- **📜 Transaction History**: Complete audit trail of all transactions
- **🎮 Extension Preview**: Live demo of Chrome extension functionality

---

## 🧪 **Testing**

### **Chrome Extension Testing** ✅

```bash
# Debug wallet connections
1. Load extension in Chrome
2. Navigate to chrome-extension/debug-wallets.html
3. Test wallet detection and connection
4. Check extension popup functionality

# Note: If you see CSS selector errors, reload the extension:
# chrome://extensions/ → Find TipMeme → Click reload button
```

### **Smart Contract Testing**

```bash
# Run Cairo tests
snforge test

# Deploy to testnet
scarb build
starkli deploy <class_hash> <constructor_args>
```

### **Dashboard Testing**

```bash
# Start development server
npm run dev

# Test all dashboard features
1. Visit http://localhost:3000
2. Connect wallet (ArgentX or Braavos)
3. View analytics and withdraw panel
4. Check extension demo at /extension-demo
```

---

## 🔧 **Development Commands**

```bash
# 🚀 Development
npm run dev              # Start Next.js development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# 🏗️ Smart Contract
scarb build              # Build Cairo contract
snforge test             # Run contract tests
scarb fmt                # Format Cairo code

# 🌐 Extension Development
# 1. Load chrome-extension/ folder in Chrome DevTools
# 2. Use debug-wallets.html for wallet testing
# 3. Check console for detailed logging
# 4. Reload extension after changes: chrome://extensions/
```

---

## 📊 **Latest Updates (January 2025)**

### **🎯 Configuration & Contract Integration** ✅
- **Centralized Configuration**: 
  - `chrome-extension/config.js` for extension settings
  - `lib/contract-config.ts` for dashboard settings
- **Contract Integration**: All components now use deployed contract
- **Working Wallet Detection**: Fixed ArgentX and Braavos integration

### **🐛 Bug Fixes & Improvements** ✅
- **Fixed Extension Demo**: Resolved SSR issues with Next.js
- **CSS Selector Fix**: Removed invalid `:has-text()` selectors
- **Wallet Connection**: Improved reliability and error handling
- **UI Consistency**: Updated contract addresses across all components

### **🛠️ Development Experience**
- **Better Error Handling**: Clear error messages and debugging info
- **Updated README**: Comprehensive setup and testing instructions
- **Working Development Setup**: All services properly configured

---

## 🔗 **Important Links**

- 📊 **Contract Explorer**: [Starkscan](https://sepolia.starkscan.co/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e)
- 🎮 **Extension Demo**: [http://localhost:3000/extension-demo](http://localhost:3000/extension-demo)
- 📈 **Creator Dashboard**: [http://localhost:3000](http://localhost:3000)
- 🦊 **ArgentX Wallet**: [Chrome Store](https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb)
- 🛡️ **Braavos Wallet**: [Chrome Store](https://chrome.google.com/webstore/detail/braavos-starknet-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma)
- 💧 **STRK Faucet**: [Get Test Tokens](https://starknet-faucet.vercel.app/)
- 🌐 **Starknet Docs**: [Documentation](https://docs.starknet.io/)

---

## 🚦 **Status Overview**

| Component | Status | Description |
|-----------|--------|-------------|
| 🎯 Smart Contract | ✅ Working | Deployed on Starknet Sepolia |
| 🌐 Chrome Extension | ✅ Working | Wallet integration complete |
| 📊 Creator Dashboard | ✅ Working | Full wallet & contract integration |
| 🎮 Extension Demo | ✅ Working | Live preview functionality |
| 🔐 Wallet Connection | ✅ Working | ArgentX & Braavos supported |
| ⚙️ Configuration | ✅ Working | Centralized config system |

---

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Starknet**: For the amazing Layer 2 blockchain technology
- **Cairo**: For the expressive smart contract language
- **ArgentX & Braavos**: For excellent Starknet wallet support
- **Radix UI**: For beautiful, accessible UI components
- **shadcn/ui**: For the component design system

---

**🎉 Ready to revolutionize social media tipping? Let's build the future together!**

*Last updated: January 2025 - Full Platform Integration Complete ✅* 
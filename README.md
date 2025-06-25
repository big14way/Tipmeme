# 🎯 TipMeme Platform

**The Complete Social Media Crypto Tipping Ecosystem on Starknet**

TipMeme is a comprehensive platform that combines a **Chrome browser extension** for Twitter tipping with a **Creator Dashboard** for managing earnings, all powered by Starknet blockchain technology.

---

## 🌟 **Platform Components**

### 🚀 **Chrome Extension** ✅ **WALLET INTEGRATION WORKING**
- **Direct Twitter Integration**: Seamlessly tip content creators on Twitter profiles
- **Cyberpunk UI**: Beautiful neon-themed interface with animations
- **Multi-Wallet Support**: 
  - ✅ **ArgentX (Ready Wallet)** - Fully supported
  - ✅ **Braavos** - Fully supported
  - **Auto-detection with retry logic** for reliable wallet connections
- **Real-time Conversion**: Live USD price display for tips
- **Secure Script Injection**: Runs in main world context for proper wallet access

### 📊 **Creator Dashboard**  
- **Earnings Analytics**: Comprehensive charts and statistics
- **Tip Leaderboards**: See top tippers and trending content
- **Withdrawal Panel**: Easy fund management and withdrawals
- **Transaction History**: Complete audit trail of all tips received
- **Starknet Integration**: Direct wallet connection and contract interaction

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

---

## 🚀 **Quick Start**

### **1. Setup Development Environment**

```bash
# Clone the repository
git clone https://github.com/big14way/Tipmeme.git
cd Tipmeme

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

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
│   └── 🎨 ui/                       # shadcn/ui components
├── 🌐 chrome-extension/             # Browser Extension
│   ├── 📄 manifest.json             # Extension manifest
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

### **Creator Dashboard Features**

- **📈 Analytics Overview**: Comprehensive earnings and tip statistics
- **🏆 Leaderboards**: See top tippers and most popular content
- **💰 Withdrawal Management**: Easy fund withdrawals and balance tracking
- **📊 Charts & Graphs**: Visual representation of earnings over time
- **📜 Transaction History**: Complete audit trail of all transactions

---

## 🧪 **Testing**

### **Chrome Extension Testing** ✅

```bash
# Debug wallet connections
1. Load extension in Chrome
2. Navigate to http://localhost:8080/chrome-extension/debug-wallets.html
3. Test wallet detection and connection
4. Check extension popup functionality
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
1. Connect wallet
2. View analytics
3. Test withdrawal panel
4. Check transaction history
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
```

---

## 📊 **Latest Updates**

### **Wallet Integration (December 2024)** ✅
- **Fixed wallet detection**: Now properly detects ArgentX (Ready Wallet) and Braavos
- **Script injection improvements**: Added `world: 'MAIN'` for proper wallet access
- **Retry logic**: Handles timing issues with wallet initialization
- **Debug tools**: Enhanced logging and debug-wallets.html testing tool

### **Code Cleanup**
- **Removed unnecessary files**: test-extension.js, backup files
- **Updated .gitignore**: Comprehensive exclusions for development files
- **Streamlined structure**: Focused on essential components only

---

## 🔗 **Important Links**

- 📊 **Contract Explorer**: [Starkscan](https://sepolia.starkscan.co/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e)
- 🦊 **ArgentX Wallet**: [Chrome Store](https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb)
- 🛡️ **Braavos Wallet**: [Chrome Store](https://chrome.google.com/webstore/detail/braavos-starknet-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma)
- 💧 **STRK Faucet**: [Get Test Tokens](https://starknet-faucet.vercel.app/)
- 🌐 **Starknet Docs**: [Documentation](https://docs.starknet.io/)

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

*Last updated: December 2024 - Wallet Integration Complete ✅* 
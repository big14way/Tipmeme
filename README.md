# 🎯 TipMeme Platform

**The Complete Social Media Crypto Tipping Ecosystem on Starknet**

TipMeme is a comprehensive platform that combines a **Chrome browser extension** for Twitter tipping with a **Creator Dashboard** for managing earnings, all powered by Starknet blockchain technology.

---

## 🌐 **Live Deployments**

### **🚀 Production Dashboard**
- **Live URL**: [https://tipmeme-5yvnz4vep-big14ways-projects.vercel.app](https://tipmeme-5yvnz4vep-big14ways-projects.vercel.app)
- **Platform**: Vercel
- **Status**: ✅ **LIVE & OPERATIONAL**

### **🔧 Paymaster Service**
- **Live URL**: [https://tipmeme-paymaster.onrender.com](https://tipmeme-paymaster.onrender.com)
- **Platform**: Render.com
- **Status**: ✅ **LIVE & OPERATIONAL**
- **Health Check**: `/health` endpoint available
- **Features**: Gasless transactions, rate limiting, comprehensive logging

### **📱 Chrome Extension**
- **Version**: 1.0.0
- **Status**: ✅ **PACKAGED & READY**
- **File**: Available as `tipmeme-extension.zip`
- **Installation**: Load unpacked in Chrome Developer Mode

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

### ⚡ **Paymaster Service** ✅ **FULLY OPERATIONAL**
- **Gasless Transactions**: Sponsor user transactions for seamless UX
- **Rate Limiting**: 10 requests per minute per IP for security
- **Multi-token Support**: ETH and STRK sponsorship
- **Comprehensive Logging**: Detailed transaction monitoring
- **Health Monitoring**: Real-time service status checks
- **Production Ready**: Deployed with Docker on Render.com

---

## 🛠 **Tech Stack**

- **Blockchain**: Starknet (Layer 2 on Ethereum)
- **Smart Contract**: Cairo 2.0
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Chart.js + Recharts  
- **Wallet**: Starknet React + ArgentX/Braavos
- **Extension**: Manifest V3 + Content Scripts
- **Backend**: Node.js + Express (Paymaster Service)
- **Deployment**: Vercel (Frontend) + Render.com (Backend)

---

## 📋 **Contract Details**

- **Contract Address**: `0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e`
- **Network**: Starknet Sepolia Testnet
- **Explorer**: [View on Starkscan](https://sepolia.starkscan.co/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e)
- **Status**: ✅ Deployed & Verified
- **RPC URL**: `https://starknet-sepolia.public.blastapi.io/rpc/v0_8`

---

## 🚀 **Quick Start**

### **1. Try Live Platform**

```bash
# Visit Live Dashboard
https://tipmeme-5yvnz4vep-big14ways-projects.vercel.app

# Download Chrome Extension
1. Download tipmeme-extension.zip
2. Extract files
3. Load in Chrome Developer Mode
4. Start tipping on Twitter!
```

### **2. Setup Development Environment**

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

### **3. Chrome Extension Setup**

```bash
# Load the extension in Chrome
1. Go to chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the chrome-extension/ folder
5. Extension will auto-detect ArgentX and Braavos wallets
```

### **4. Wallet Setup**

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
│   ├── 🐳 Dockerfile                # Container configuration
│   ├── 🔧 server.js                 # Main server file
│   ├── 🛣️ routes/sponsor.js         # Sponsorship endpoints
│   ├── 🛡️ middleware/               # Rate limiting & validation
│   └── 📚 README.md                 # Service documentation
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

### **Paymaster Service Features** ✅

- **⚡ Gasless Transactions**: Users can send tips without paying gas fees
- **🔒 Rate Limiting**: 10 requests per minute per IP for security
- **💰 Multi-token Support**: Supports both ETH and STRK sponsorship
- **📊 Comprehensive Logging**: Detailed logs for monitoring and debugging
- **🏥 Health Monitoring**: `/health` endpoint for service status checks
- **🛡️ Input Validation**: Robust validation for all transaction parameters
- **🌐 CORS Support**: Configured for frontend integration

---

## 🌐 **API Endpoints**

### **Paymaster Service**
```
Base URL: https://tipmeme-paymaster.onrender.com

GET  /health                 # Service health check
POST /sponsor               # Sponsor a transaction
```

### **Health Check Response**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX",
  "service": "tipmeme-paymaster",
  "uptime": "XX seconds"
}
```

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
3. Test tip functionality with extension demo
```

### **Paymaster Service Testing**

```bash
# Local testing
cd paymaster-service
npm start

# Health check
curl https://tipmeme-paymaster.onrender.com/health

# Test sponsorship (requires valid transaction)
curl -X POST https://tipmeme-paymaster.onrender.com/sponsor \
  -H "Content-Type: application/json" \
  -d '{"transaction": "...", "signature": "..."}'
```

---

## 🚀 **Deployment**

### **Prerequisites**
- Node.js 18+
- Git
- Vercel CLI
- Chrome Browser (for extension)

### **Frontend Deployment (Vercel)**
```bash
# Deploy to Vercel
vercel --prod

# Environment variables required:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e
NEXT_PUBLIC_STARKNET_NETWORK=testnet
NEXT_PUBLIC_STARKNET_CHAIN_ID=0x534e5f5345504f4c4941
NEXT_PUBLIC_PAYMASTER_ENABLED=true
```

### **Paymaster Service Deployment (Render.com)**
```bash
# Deploy via Docker on Render.com
# Required environment variables:
STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io/rpc/v0_8
PAYMASTER_PRIVATE_KEY=your_private_key_here
NODE_ENV=production
PORT=10000
```

### **Chrome Extension Deployment**
```bash
# Package extension
zip -r tipmeme-extension.zip chrome-extension/

# Install in Chrome
1. chrome://extensions/
2. Developer mode ON
3. Load unpacked → select chrome-extension folder
```

---

## 📞 **Support & Contact**

- **GitHub Issues**: [Report bugs or request features](https://github.com/big14way/Tipmeme/issues)
- **Documentation**: Comprehensive guides included in repository
- **Live Demo**: Test all features on our live deployment

---

## 📜 **License**

MIT License - see LICENSE file for details.

---

## 🎯 **What's Next**

- **📱 Mobile App**: React Native version for mobile tipping
- **🌍 Multi-Platform**: Support for more social media platforms
- **💎 NFT Integration**: Tip with NFTs and digital collectibles
- **🏪 Creator Marketplace**: Advanced monetization tools
- **🤖 AI Features**: Smart tip recommendations and analytics

---

**Built with ❤️ on Starknet** 
import ChromeExtensionPopup from "../../chrome-extension/popup"

export default function ExtensionDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Extension Preview */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Chrome Extension Preview</h2>
          <div className="relative">
            {/* Chrome browser frame simulation */}
            <div className="bg-gray-800 rounded-t-lg p-2 border-b border-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 text-xs text-gray-400">TipMeme Extension</div>
              </div>
            </div>
            
            {/* Extension popup */}
            <div className="border-2 border-gray-700 rounded-b-lg overflow-hidden">
              <ChromeExtensionPopup />
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent">
              TipMeme
            </h1>
            <p className="text-xl text-gray-300 mt-2">Crypto Tips for Twitter with Meme Magic ✨</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">Easy Tipping</h3>
              <p className="text-gray-300 text-sm">Send crypto tips directly on Twitter profiles with just a few clicks.</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 p-6 rounded-xl border border-cyan-500/30">
              <div className="text-2xl mb-3">🎭</div>
              <h3 className="text-lg font-bold text-white mb-2">Meme Generation</h3>
              <p className="text-gray-300 text-sm">AI-powered meme generation to make your tips more engaging and fun.</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/30 p-6 rounded-xl border border-yellow-500/30">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Starknet Powered</h3>
              <p className="text-gray-300 text-sm">Built on Starknet for fast, low-cost transactions with ETH and STRK support.</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-teal-900/30 p-6 rounded-xl border border-green-500/30">
              <div className="text-2xl mb-3">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2">Wallet Integration</h3>
              <p className="text-gray-300 text-sm">Seamless integration with ArgentX and Braavos wallets for secure transactions.</p>
            </div>
          </div>

          {/* Contract Info */}
          <div className="bg-black/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">📋 Contract Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Contract Address:</span>
                <span className="text-cyan-400 font-mono">0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="text-green-400">Starknet Sepolia Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">✅ Deployed & Verified</span>
              </div>
            </div>
          </div>

          {/* Installation Steps */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-600">
            <h3 className="text-lg font-bold text-white mb-4">🔧 Installation</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div className="text-white font-medium">Load Extension</div>
                  <div className="text-gray-400">Go to chrome://extensions/ and enable Developer mode</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div className="text-white font-medium">Install Wallet</div>
                  <div className="text-gray-400">Install ArgentX or Braavos Starknet wallet extension</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div className="text-white font-medium">Start Tipping</div>
                  <div className="text-gray-400">Visit Twitter profiles and look for the TipMeme button!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a 
              href="https://sepolia.starkscan.co/contract/0x072a452b7469b98df2f4cdc7677b160b4f71fd3c9d8a24a93662e4ee63e2db9e" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              📊 View on Starkscan
            </a>
            <a 
              href="/" 
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            >
              📈 Creator Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 
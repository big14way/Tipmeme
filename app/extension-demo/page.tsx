'use client';

import React from 'react';

const ChromeExtensionPopup = () => {
  return (
    <div className="w-80 bg-gray-900 text-white font-sans">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
            TipMeme
          </h1>
          <span className="text-xs text-gray-400">v1.0</span>
        </div>
        <div className="contract-info text-xs text-gray-400">
          <div>Contract: <span className="text-cyan-400">0x072a...db9e</span></div>
          <div>Network: <span className="text-green-400">Starknet Sepolia Testnet</span></div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Connection Status */}
        <div className="text-center">
          <div className="text-sm text-yellow-400 mb-2">🟡 Wallet Not Connected</div>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300">
            Connect ArgentX 🦊
          </button>
        </div>

        {/* Twitter Handle */}
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Tip to</div>
          <div className="text-lg font-bold text-blue-400">@ethereum</div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400">Amount</label>
          <div className="flex space-x-2">
            <input 
              type="number" 
              placeholder="0.01"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
              disabled
            />
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" disabled>
              <option>ETH</option>
              <option>STRK</option>
              <option>USDC</option>
            </select>
          </div>
          <div className="text-xs text-gray-400">≈ $24.00</div>
        </div>

        {/* Meme Preview */}
        <div className="bg-gray-800 rounded-lg p-3 text-center min-h-[80px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🚀💎🌙</div>
            <div className="text-sm font-bold">TO THE MOON!</div>
            <div className="text-xs text-gray-400">Much Tip, Very Crypto</div>
          </div>
        </div>

        {/* Send Button */}
        <button 
          className="w-full bg-gray-700 text-gray-500 py-3 px-4 rounded-lg text-sm font-medium cursor-not-allowed"
          disabled
        >
          🎁 Send Tip
        </button>

        {/* Status */}
        <div className="text-xs text-center text-gray-500">
          Connect wallet to start tipping
        </div>
      </div>
    </div>
  );
};

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
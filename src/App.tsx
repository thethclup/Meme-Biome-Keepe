import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore, MemeType } from './store/gameStore';
import { BiomeCanvas } from './components/BiomeCanvas';
import { Web3Provider } from './providers/Web3Provider';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useSendCalls, useSignMessage } from 'wagmi';
import { Wallet, Info, Zap, Flame, TestTube, Trophy, X, ArrowUpRight, Sun } from 'lucide-react';
import { generateAttributionSuffix } from './lib/erc8021';
import { buildAgentDeploymentData } from './lib/erc8004';
import { useWalletCapabilities } from './hooks/useWalletCapabilities';
import confetti from 'canvas-confetti';

function GameUI() {
  const { hype, memeticEnergy, chaosLevel, virality, biome, creatures, placeCreature, setBiome } = useGameStore();
  
  const [selectedMeme, setSelectedMeme] = useState<MemeType>('doge');
  const [showWeb3Menu, setShowWeb3Menu] = useState(false);

  // Wagmi Hooks
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransactionAsync } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();
  const { signMessageAsync } = useSignMessage();
  const { supportsBatching } = useWalletCapabilities();

  const sendGMTransaction = async () => {
    if (!isConnected) return alert("Connect wallet first!");
    try {
      const calldata = '0x676d'; // 'gm' in hex
      const suffix = generateAttributionSuffix();

      if (supportsBatching && sendCallsAsync) {
         // Smart Wallet flow (ERC-5792) with capabilities
         await sendCallsAsync({
           calls: [
             {
               to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
               data: calldata as `0x${string}`,
               value: 0n,
             }
           ],
           capabilities: {
             dataSuffix: {
               value: `0x${suffix}`,
               optional: true
             }
           }
         });
      } else {
         // EOA flow: append suffix directly to calldata
         const finalData = `${calldata}${suffix}` as `0x${string}`;
         await sendTransactionAsync({
           to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
           data: finalData,
           value: 0n,
         });
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const recordBiomeOnChain = async () => {
    if (!isConnected) return alert("Connect wallet first!");
    try {
      const message = `I am recording my Meme Biome Keeper ecosystem on Base Mainnet.
      
Creatures: ${creatures.length}
Hype: ${Math.floor(hype)}
Chaos: ${Math.floor(chaosLevel)}
Biome: ${biome}

Sign this message to attest your biome state.`;

      await signMessageAsync({ account: address, message });
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
      alert("Biome recorded on-chain via SIWE signature!");
    } catch (err) {
       console.error("Signature failed", err);
    }
  };

  const handlePlaceCreatureClick = (meme: MemeType) => {
     setSelectedMeme(meme);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-gray-900 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Top HUD */}
      <header className="absolute top-0 inset-x-0 z-10 p-4 flex justify-between items-start pointer-events-none">
        
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/50 shadow-xl">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-mono font-bold">{Math.floor(hype)} Hype</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/50 shadow-xl">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold">{Math.floor(memeticEnergy)} Energy</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/50 shadow-xl">
            <TestTube className="w-4 h-4 text-purple-500" />
            <span className="font-mono font-bold">{Math.floor(chaosLevel)}% Chaos</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <button 
            onClick={() => setShowWeb3Menu(true)}
            className="pointer-events-auto flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg transition-transform active:scale-95"
          >
            <Wallet className="w-6 h-6 text-white" />
          </button>
          
          {isConnected && (
            <button 
              onClick={sendGMTransaction}
              className="pointer-events-auto px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun className="w-4 h-4" /> Say GM
            </button>
          )}
        </div>

      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 relative touch-none">
         <BiomeCanvas />
         
         {/* Instruction Overlay */}
         <div className="absolute inset-x-0 top-32 flex justify-center pointer-events-none opacity-50">
            <p className="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
               Tap anywhere to place {selectedMeme.toUpperCase()}
            </p>
         </div>
      </main>

      {/* Bottom Toolbar */}
      <footer className="absolute bottom-0 inset-x-0 z-10 p-4 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none">
         <div className="flex justify-start md:justify-center overflow-x-auto no-scrollbar gap-3 pb-2 pointer-events-auto snap-x px-2">
            
            {(['doge', 'pepe', 'chad', 'wojak', 'apu', 'gigachad'] as MemeType[]).map(meme => (
               <button 
                 key={meme}
                 onClick={() => handlePlaceCreatureClick(meme)}
                 className={`snap-center flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all ${selectedMeme === meme ? 'border-amber-400 scale-110 bg-slate-800' : 'border-slate-700 bg-slate-900/80 hover:bg-slate-800'}`}
               >
                 <span className="text-2xl">
                   {meme === 'doge' ? 'Ð' : 
                    meme === 'pepe' ? '🐸' : 
                    meme === 'chad' ? '😎' : 
                    meme === 'wojak' ? '😭' : 
                    meme === 'apu' ? '🐸' : '🗿'}
                 </span>
                 <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">{meme}</span>
               </button>
            ))}

         </div>
      </footer>

      {/* Web3 Menu Modal */}
      <AnimatePresence>
        {showWeb3Menu && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowWeb3Menu(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                 <Wallet className="text-blue-500" /> Web3 Hub
              </h2>

              {!isConnected ? (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm mb-4">Connect your wallet to Base Mainnet to interact with on-chain mechanics.</p>
                  {connectors.map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                    >
                      <span className="font-bold">{connector.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                     <span className="text-sm font-mono text-slate-300">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                     </span>
                     <button onClick={() => disconnect()} className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full">Disconnect</button>
                  </div>
                  
                  <hr className="border-slate-700 my-4" />
                  
                  <button 
                    onClick={sendGMTransaction}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition"
                  >
                    Say GM on Base (ERC-8021)
                  </button>

                  <button 
                    onClick={recordBiomeOnChain}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-3 px-4 rounded-xl transition"
                  >
                    <Trophy className="w-5 h-5" /> Record Thriving Biome (SIWE)
                  </button>

                  <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
                     <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
                       <Info className="w-4 h-4" /> Agent System (ERC-8004)
                     </h3>
                     <p className="text-xs text-slate-400">
                        Deploy a trustless agent to manage your biome while offline. (Feature preview)
                     </p>
                  </div>

                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameUI />
    </Web3Provider>
  );
}

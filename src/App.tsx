import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col overflow-hidden selection:bg-[#ff00ff]/30">
      <div className="absolute inset-0 bg-noise z-50 mix-blend-overlay"></div>
      
      {/* Header */}
      <header className="h-20 border-b-2 border-[#1a1a1a] flex items-center justify-between px-8 bg-[#0a0a0a] shrink-0 z-20 relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[1px] before:bg-[#00ffff] before:shadow-[0_0_10px_#00ffff]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#00ffff] rounded-none shadow-[0_0_15px_rgba(0,255,255,0.6)] flex items-center justify-center animate-glitch relative before:absolute before:-inset-1 before:border before:border-[#ff00ff] before:opacity-50">
            <div className="w-4 h-4 bg-black" />
          </div>
          <h1 
            className="text-4xl font-digital tracking-widest text-[#e0e0e0] glitch-wrapper select-none"
            data-text="SYS.CORE"
          >
            SYS.CORE
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-12 font-digital text-xl">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-widest text-[#666]">UPLINK</span>
            <div className="text-[#00ffff] leading-none tracking-tighter mt-1 drop-shadow-[0_0_5px_#00ffff]">ESTABLISHED</div>
          </div>
          <div className="flex flex-col items-end border-l-2 border-[#1a1a1a] pl-12">
            <span className="text-xs uppercase tracking-widest text-[#666]">PROTOCOL</span>
            <div className="text-[#ff00ff] leading-none tracking-tighter mt-1 drop-shadow-[0_0_5px_#ff00ff]">GLITCH_V1</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <aside className="w-full lg:w-80 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1a1a1a] bg-[#050505] flex flex-col p-6 shrink-0 z-10 overflow-y-auto">
          <MusicPlayer />
        </aside>
        
        <section className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 bg-black overflow-hidden animate-tear">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(#ff00ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div 
            className="absolute inset-x-0 inset-y-10 opacity-10 pointer-events-none mix-blend-screen" 
            style={{ backgroundImage: 'linear-gradient(transparent 50%, #00ffff 50%)', backgroundSize: '100% 4px' }}
          />
          
          <div className="relative z-10 flex justify-center items-center w-full h-full max-h-[650px]">
            <SnakeGame />
          </div>

          <div className="absolute bottom-8 right-8 hidden md:flex flex-col gap-1 text-sm font-digital text-[#00ffff] opacity-70 text-right mix-blend-screen">
            <span>MEM: 0x9F4A [OK]</span>
            <span>CYCLES: 99.9%</span>
            <span>ERR: NIL</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-12 bg-[#0a0a0a] border-t-2 border-[#1a1a1a] px-8 flex items-center justify-between text-xs font-digital text-[#555] shrink-0 z-20">
        <div>LOG_DATA: <span className="text-[#ff00ff] animate-pulse">RECORDING...</span></div>
        <div className="hidden sm:flex gap-6">
          <span className="hover:text-[#00ffff] transition-colors">INPUT_MATRIX_WASD</span>
          <span className="hover:text-[#00ffff] transition-colors">OVERRIDE_SPACE</span>
        </div>
        <div className="text-[#00ffff]">© 20XX NULL_CORP</div>
      </footer>
    </div>
  );
}

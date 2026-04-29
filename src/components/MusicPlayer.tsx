import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drift (AI Gen)',
    artist: 'SynthMind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Cyberpunk Alley',
    artist: 'NeuralBeats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'AlgoRhythm',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-sm mx-auto lg:mx-0">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
        loop={false}
      />
      
      <h2 className="text-xl uppercase tracking-[0.2em] text-[#ff00ff] mb-6 font-digital drop-shadow-[0_0_5px_#ff00ff]">Neural Audio Stream</h2>
      
      <div className="space-y-4 flex-1">
        {TRACKS.map((track, idx) => {
          const isActive = idx === currentTrackIndex;
          if (isActive) {
            return (
              <div key={track.id} className="p-4 rounded-none bg-[#111] border border-[#00ffff]/20 border-l-4 border-l-[#00ffff] shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_100%)]">
                <p className="text-sm text-[#00ffff] font-digital mb-1 italic animate-pulse">NOW PLAYING</p>
                <p className="font-bold text-white text-lg font-digital leading-tight mb-1">{track.title}</p>
                <p className="text-xs text-[#666] font-digital">{track.artist} • {formatTime(duration)}</p>
                <div className="mt-4 flex items-center gap-1 group relative">
                  <div className="h-1 w-full bg-[#222] rounded-none overflow-hidden absolute inset-0 my-auto pointer-events-none z-0">
                    <div className="h-full bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}></div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={duration || 100} 
                    value={progress} 
                    onChange={handleProgressChange}
                    className="w-full h-3 bg-transparent appearance-none cursor-pointer z-10 opacity-0"
                  />
                  <span className="text-[11px] font-digital text-[#00ffff] ml-2 shrink-0">{formatTime(progress)}</span>
                </div>
              </div>
            );
          } else {
            return (
              <div 
                key={track.id} 
                onClick={() => setCurrentTrackIndex(idx)} 
                className="p-4 rounded-none bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#ff00ff] transition-colors cursor-pointer group hover:bg-[#111]"
              >
                <p className="font-bold text-[#888] font-digital text-lg group-hover:text-white leading-tight mb-1 transition-colors">{track.title}</p>
                <p className="text-xs font-digital text-[#444] group-hover:text-[#ff00ff] transition-colors">{track.artist}</p>
              </div>
            );
          }
        })}
      </div>

      <div className="pt-6 mt-6 border-t-2 border-[#1a1a1a]">
        <div className="flex items-center justify-center gap-8 mb-6 relative">
           {/* Static noise overlay for buttons area */}
           <div className="absolute inset-0 bg-noise opacity-5 pointe-events-none mix-blend-screen mix-blend-overlay"></div>
          
          <button 
            onClick={prevTrack}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] hover:drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] z-10"
          >
            <SkipBack className="w-8 h-8 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-[#ff00ff] hover:text-[#00ffff] transition-colors drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] hover:drop-shadow-[0_0_20px_rgba(0,255,255,1)] transform active:scale-95 flex items-center justify-center z-10 animate-pulse hover:animate-glitch"
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 fill-current" />
            ) : (
              <Play className="w-12 h-12 fill-current" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] hover:drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] z-10"
          >
            <SkipForward className="w-8 h-8 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#444] hover:text-[#00ffff] transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="h-1 flex-1 bg-[#1a1a1a] rounded-none relative overflow-hidden">
             <div className="h-full bg-[#00ffff] shadow-[0_0_5px_#00ffff]" style={{ width: isMuted ? '0%' : '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

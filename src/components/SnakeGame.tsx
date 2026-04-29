import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_DIRECTION = [0, -1]; // moving up

export default function SnakeGame() {
  const [gameState, setGameState] = useState({
    snake: INITIAL_SNAKE,
    food: [15, 10],
    score: 0,
    gameOver: false,
  });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: number[][]) => {
    let newFood: number[];
    while (true) {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1])) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      score: 0,
      gameOver: false,
    });
    setDirection(INITIAL_DIRECTION);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState.gameOver) return;
      
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir[1] !== -1) setDirection([0, 1]);
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir[0] !== -1) setDirection([1, 0]);
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameOver]);

  // game loop
  useEffect(() => {
    if (gameState.gameOver || isPaused) return;

    const moveSnake = () => {
      setGameState(prev => {
        const head = prev.snake[0];
        const newHead = [head[0] + directionRef.current[0], head[1] + directionRef.current[1]];

        // Check wall collision
        if (
          newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 || newHead[1] >= GRID_SIZE
        ) {
          return { ...prev, gameOver: true };
        }

        // Check self collision
        const isEaten = newHead[0] === prev.food[0] && newHead[1] === prev.food[1];
        const currentBody = isEaten ? prev.snake : prev.snake.slice(0, -1);
        
        if (currentBody.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          return { ...prev, gameOver: true };
        }

        const newSnake = [newHead, ...currentBody];

        return {
          ...prev,
          snake: newSnake,
          score: isEaten ? prev.score + 10 : prev.score,
          food: isEaten ? generateFood(newSnake) : prev.food,
        };
      });
    };

    // A slightly tighter bound on max speed, and gentler scaling to prevent crazy speeds
    const currentSpeed = Math.max(70, 150 - (gameState.score * 0.3));
    const interval = setInterval(moveSnake, currentSpeed); 
    return () => clearInterval(interval);
  }, [gameState.gameOver, isPaused, gameState.score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl px-4 lg:px-0">
      <div className="flex justify-between w-full mb-6 max-w-[512px] items-end">
        <div className="flex flex-col items-start border-l-2 border-[#1a1a1a] pl-4">
          <span className="text-xs uppercase tracking-widest text-[#666] font-digital">Current Session</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-digital text-white leading-none tracking-tighter">SCORE:</span>
            <div className="text-3xl font-digital text-[#00ffff] leading-none tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,255,0.4)] animate-pulse">
              {gameState.score.toString().padStart(6, '0')}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-[#666] font-digital">Status</span>
          <div className="text-2xl font-digital text-white leading-none tracking-tighter mt-1">
            {isPaused ? <span className="text-[#ff00ff] animate-glitch inline-block">PAUSED</span> : <span className="text-[#00ffff]">PLAYING</span>}
          </div>
        </div>
      </div>
      
      <div 
        className="relative bg-[#020202] border-2 border-[#00ffff]/30 shadow-[0_0_50px_rgba(0,255,255,0.05)] overflow-hidden w-full max-w-[512px] aspect-square"
      >
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
             const x = i % GRID_SIZE;
             const y = Math.floor(i / GRID_SIZE);
             const isSnake = gameState.snake.some(s => s[0] === x && s[1] === y);
             const isFood = gameState.food[0] === x && gameState.food[1] === y;

             return (
               <div 
                 key={i} 
                 className={`w-full h-full flex items-center justify-center`}
               >
                 {isSnake && (
                   <div className="w-full h-full bg-[#00ffff] border border-black shadow-[0_0_10px_#00ffff]"></div>
                 )}
                 {isFood && (
                   <div className="w-3/4 h-3/4 bg-[#ff00ff] rounded-full shadow-[0_0_20px_#ff00ff] animate-pulse"></div>
                 )}
               </div>
             );
          })}
        </div>

        {gameState.gameOver && (
          <div className="absolute inset-0 bg-[#050505]/95 flex flex-col items-center justify-center z-20 backdrop-blur-md border-[4px] border-[#1a1a1a]">
            <h2 
              className="text-[#ff00ff] text-5xl md:text-6xl font-digital mb-4 uppercase tracking-widest text-center drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] animate-glitch relative glitch-wrapper"
              data-text="SYSTEM FAILURE"
            >
              SYSTEM FAILURE
            </h2>
            <p className="text-white font-digital text-3xl md:text-4xl mb-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              FINAL SCORE: <span className="text-[#00ffff] animate-pulse">{gameState.score.toString().padStart(6, '0')}</span>
            </p>
            <button 
               onClick={resetGame}
              className="px-8 py-4 bg-[#0a0a0a] text-[#e0e0e0] border border-[#222] font-digital text-2xl tracking-[0.2em] hover:border-[#00ffff] hover:text-[#00ffff] transition-all hover:bg-[#111] hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] active:scale-95 hover:animate-glitch"
            >
              REBOOT_SEQUENCE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const BiomeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const creatures = useGameStore(state => state.creatures);
  const biome = useGameStore(state => state.biome);
  const tickSim = useGameStore(state => state.tickSim);
  const placeCreature = useGameStore(state => state.placeCreature);
  const setBiome = useGameStore(state => state.setBiome);
  
  const [selectedMeme, setSelectedMeme] = useState('doge');

  useEffect(() => {
    let animationFrameId: number;
    let lastTick = performance.now();

    const render = (time: number) => {
      // Tick logic
      if (time - lastTick > 1000) { // Tick every 1s
        tickSim();
        lastTick = time;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle resize
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background based on biome
      ctx.fillStyle = getBiomeColor(biome);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw creatures
      creatures.forEach(c => {
         drawMeme(ctx, c, canvas.width, canvas.height);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());
    return () => cancelAnimationFrame(animationFrameId);
  }, [creatures, biome, tickSim]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate normalized coordinates (0.0 to 1.0)
    const x = (e.clientX - rect.left) / canvas.width;
    const y = (e.clientY - rect.top) / canvas.height;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    placeCreature(selectedMeme as any, x, y);
  };

  return (
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
      />
  );
};

function getBiomeColor(biome: string) {
  switch (biome) {
    case 'doge_forest': return '#d1fae5'; // emerald-100
    case 'pepe_swamp': return '#bbf7d0'; // green-200
    case 'based_mountains': return '#e5e7eb'; // gray-200
    case 'rug_desert': return '#fef08a'; // yellow-200
    case 'moon_valley': return '#e0e7ff'; // indigo-100
    default: return '#f3f4f6';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawMeme(ctx: CanvasRenderingContext2D, creature: any, width: number, height: number) {
  const pixelX = creature.x * width;
  const pixelY = creature.y * height;
  
  // Gentle hover animation based on time
  const hoverOffset = Math.sin((Date.now() - creature.bornAt) / 300) * 5;

  ctx.save();
  ctx.translate(pixelX, pixelY + hoverOffset);
  
  ctx.beginPath();
  ctx.arc(0, 0, 20 + creature.level * 2, 0, Math.PI * 2);
  
  switch(creature.type) {
    case 'doge': ctx.fillStyle = '#f59e0b'; break; // amber-500
    case 'pepe': ctx.fillStyle = '#10b981'; break; // emerald-500
    case 'chad': ctx.fillStyle = '#6366f1'; break; // indigo-500
    case 'wojak': ctx.fillStyle = '#9ca3af'; break; // gray-400
    case 'apu': ctx.fillStyle = '#34d399'; break; // emerald-400
    case 'gigachad': ctx.fillStyle = '#1e3a8a'; break; // blue-900
    default: ctx.fillStyle = '#000';
  }
  
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw face simple
  ctx.fillStyle = '#fff';
  if (creature.type === 'doge') {
    // Doge face
    ctx.fillText("Ð", -5, 5);
  } else if(creature.type === 'pepe') {
    ctx.fillText("🐸", -8, 5);
  } else if (creature.type === 'chad') {
     ctx.fillText("😎", -8, 5);
  } else if (creature.type === 'wojak') {
     ctx.fillText("😭", -8, 5);
  } else if(creature.type === 'apu') {
     ctx.fillText("🐸", -8, 5);
  } else if(creature.type === 'gigachad') {
     ctx.fillText("🗿", -8, 5);
  } else {
     ctx.fillText("?", -5, 5);
  }
  
  // Level indicator
  ctx.fillStyle = '#000';
  ctx.font = '10px Arial';
  ctx.fillText(`Lv.${creature.level}`, -10, -25 - creature.level * 2);

  ctx.restore();
}

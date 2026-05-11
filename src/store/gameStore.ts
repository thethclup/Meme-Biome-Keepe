import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MemeType = 'doge' | 'pepe' | 'chad' | 'wojak' | 'apu' | 'gigachad';
export type BiomeType = 'doge_forest' | 'pepe_swamp' | 'based_mountains' | 'rug_desert' | 'moon_valley';

export interface Creature {
  id: string;
  type: MemeType;
  x: number;
  y: number;
  level: number;
  bornAt: number;
  lastFedAt: number;
}

export interface GameState {
  // Resources
  hype: number;
  memeticEnergy: number;
  chaosLevel: number;
  virality: number;

  // Ecosystem
  biome: BiomeType;
  creatures: Creature[];
  
  // Progress
  prestigeLevel: number;
  lastPlayedAt: number;

  // Actions
  addHype: (amount: number) => void;
  addEnergy: (amount: number) => void;
  addChaos: (amount: number) => void;
  setBiome: (biome: BiomeType) => void;
  placeCreature: (type: MemeType, x: number, y: number) => void;
  feedCreature: (id: string) => void;
  evolveCreature: (id: string) => void;
  tickSim: () => void;
  
  // Reset
  prestige: () => void;
}

const MEME_COSTS: Record<MemeType, { hype: number, energy: number }> = {
  doge: { hype: 10, energy: 0 },
  pepe: { hype: 20, energy: 5 },
  chad: { hype: 0, energy: 50 },
  wojak: { hype: 5, energy: 10 },
  apu: { hype: 15, energy: 15 },
  gigachad: { hype: 100, energy: 100 }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      hype: 100,
      memeticEnergy: 50,
      chaosLevel: 0,
      virality: 1.0,
      biome: 'doge_forest',
      creatures: [],
      prestigeLevel: 0,
      lastPlayedAt: Date.now(),

      addHype: (amount) => set((state) => ({ hype: state.hype + amount * state.virality })),
      addEnergy: (amount) => set((state) => ({ memeticEnergy: state.memeticEnergy + amount * state.virality })),
      addChaos: (amount) => set((state) => ({ chaosLevel: Math.max(0, Math.min(100, state.chaosLevel + amount)) })),
      setBiome: (biome) => set({ biome }),
      
      placeCreature: (type, x, y) => set((state) => {
        const cost = MEME_COSTS[type];
        if (state.hype >= cost.hype && state.memeticEnergy >= cost.energy) {
          return {
            hype: state.hype - cost.hype,
            memeticEnergy: state.memeticEnergy - cost.energy,
            creatures: [...state.creatures, {
              id: Math.random().toString(36).substring(7),
              type,
              x,
              y,
              level: 1,
              bornAt: Date.now(),
              lastFedAt: Date.now()
            }]
          }
        }
        return state;
      }),

      feedCreature: (id) => set((state) => ({
        creatures: state.creatures.map(c => 
          c.id === id ? { ...c, lastFedAt: Date.now() } : c
        ),
        memeticEnergy: state.memeticEnergy - 5 
      })),

      evolveCreature: (id) => set((state) => ({
        creatures: state.creatures.map(c =>
          (c.id === id && state.memeticEnergy >= 20) 
            ? { ...c, level: c.level + 1 } 
            : c
        ),
        memeticEnergy: state.memeticEnergy - 20
      })),

      tickSim: () => set((state) => {
        const now = Date.now();
        const delta = (now - state.lastPlayedAt) / 1000; // seconds
        
        if (delta < 0.1) return state; // Don't tick too fast

        let newHype = state.hype;
        let newEnergy = state.memeticEnergy;
        let newChaos = state.chaosLevel;

        state.creatures.forEach(c => {
          // Simulation logic
          const multiplier = c.level * state.virality * state.prestigeLevel ? state.prestigeLevel * 2 : 1;
          
          if (c.type === 'doge') { newHype += 0.5 * multiplier * delta; newEnergy -= 0.1 * delta; }
          if (c.type === 'pepe') { newChaos += 0.2 * delta; newEnergy += 0.5 * multiplier * delta; }
          if (c.type === 'chad') { newHype -= 0.5 * delta; newEnergy += 1.0 * multiplier * delta; }
          if (c.type === 'wojak') { newChaos -= 0.5 * delta; newHype -= 0.2 * delta; }
          if (c.type === 'apu') { newHype += 0.2 * delta; newEnergy += 0.2 * multiplier * delta; }
          if (c.type === 'gigachad') { newHype += 2.0 * multiplier * delta; newChaos -= 1.0 * delta; }
        });

        // Decay
        if (newChaos > 80) newHype -= 1.0 * delta; // Too much chaos = hype decay
        if (newChaos < 10) newEnergy -= 0.5 * delta; // Too little chaos = energy stagnancy

        return {
          hype: Math.max(0, newHype),
          memeticEnergy: Math.max(0, newEnergy),
          chaosLevel: Math.max(0, Math.min(100, newChaos)),
          lastPlayedAt: now
        };
      }),

      prestige: () => set((state) => ({
        hype: 100,
        memeticEnergy: 50,
        chaosLevel: 0,
        creatures: [],
        prestigeLevel: state.prestigeLevel + 1,
        virality: state.virality + 0.5
      }))
    }),
    {
      name: 'meme-biome-keeper-storage',
    }
  )
);

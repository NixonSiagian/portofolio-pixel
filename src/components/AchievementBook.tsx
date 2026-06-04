import React from "react";
import { soundEngine } from "../audio";
import { Trophy, ShieldAlert, Sparkles, X, CheckCircle2, Lock } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  desc: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  points: number;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "entered", title: "✓ Welcome Workspace Traveler", desc: "Step inside the active 2.5D portfolio chamber environment.", rarity: "Common", points: 10 },
  { id: "botanist", title: "🌱 Environmentalist", desc: "Interact with the cozy plants inside Nixon's workspace twice.", rarity: "Common", points: 15 },
  { id: "desktop_os", title: "💻 Cyber Hacker", desc: "Unlock and boot the retro Portfolio OS desktop simulator inside the Laptop.", rarity: "Rare", points: 25 },
  { id: "used_terminal", title: "📟 Terminal Hacker", desc: "Inquire naturally with instructions through the green command-line terminal.", rarity: "Rare", points: 25 },
  { id: "future_vision", title: "🔭 Visionary", desc: "Inspect future milestones inside the Future Vision Observatory.", rarity: "Epic", points: 40 },
  { id: "visited_all", title: "🗺️ Cartographer", desc: "Walk through and discover all 5 major structural division rooms.", rarity: "Epic", points: 40 },
  { id: "fragment_collector", title: "💎 Memory Archeologist", desc: "Unearth and absorb all hidden memory fragments floating in corners.", rarity: "Epic", points: 50 },
  { id: "contacted", title: "✉️ Direct Mail Dispatch", desc: "Accessed the SMTP electronic mail transmission panel.", rarity: "Common", points: 15 },
  { id: "found_secret", title: "🗝️ Secret Room Explorer", desc: "Gathered key quests to unlock the Master Legendary Chamber Room.", rarity: "Legendary", points: 100 }
];

interface AchievementBookProps {
  unlockedIds: string[];
  onClose: () => void;
}

export function AchievementBook({ unlockedIds = [], onClose }: AchievementBookProps) {
  const score = ALL_ACHIEVEMENTS.reduce((acc, ach) => {
    return acc + (unlockedIds.includes(ach.id) ? ach.points : 0);
  }, 0);

  const totalPoints = ALL_ACHIEVEMENTS.reduce((acc, ach) => acc + ach.points, 0);
  const percentComplete = Math.round((unlockedIds.length / ALL_ACHIEVEMENTS.length) * 100) || 0;

  return (
    <div className="bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] font-mono text-zinc-300">
      
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-sm font-black tracking-widest text-[#FFC03D]">ACHIEVEMENT COLLECTION</span>
        </div>
        <button 
          onClick={() => {
            soundEngine.playClose();
            onClose();
          }}
          className="p-1 px-3 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-500 hover:text-white rounded-lg cursor-pointer select-none transition-all"
        >
          X CLOSE
        </button>
      </div>

      {/* Progress Status Header */}
      <div className="bg-zinc-900/40 border border-zinc-900/80 p-4 rounded-2xl my-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">TOTAL SCORE SECURED</p>
            <p className="text-xl font-black text-[#FFC03D]">{score} <span className="text-[10px] text-zinc-600">/ {totalPoints} EXP</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase font-bold">ACHIEVEMENTS SECURED</p>
            <p className="text-lg font-black text-emerald-400">{unlockedIds.length} <span className="text-xs text-zinc-600">/ {ALL_ACHIEVEMENTS.length}</span></p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold">
            <span>EXPLORATION RATE</span>
            <span>{percentComplete}%</span>
          </div>
          <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
            <div 
              className="bg-gradient-to-r from-amber-500 via-emerald-400 to-indigo-500 h-full transition-all duration-1000"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges List Scroll */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
        {ALL_ACHIEVEMENTS.map((ach) => {
          const unlocked = unlockedIds.includes(ach.id);
          
          return (
            <div 
              key={ach.id} 
              className={`border p-3.5 rounded-2xl transition-all duration-300 flex items-start gap-3.5 relative overflow-hidden ${
                unlocked 
                  ? "bg-[#101E17]/40 border-emerald-950 shadow-[0_4px_20px_rgba(16,185,129,0.03)]" 
                  : "bg-zinc-950/60 border-zinc-900/80 text-zinc-500"
              }`}
            >
              {/* Highlight flash element */}
              {unlocked && (
                <div className="absolute top-0 right-0 p-1 bg-emerald-500/10 text-emerald-400 rounded-bl text-[8px] font-bold px-2 tracking-widest uppercase">
                  ACTIVE
                </div>
              )}

              {/* Icon Container */}
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                unlocked
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  : "bg-zinc-900/60 border-zinc-800/40 text-zinc-650"
              }`}>
                {unlocked ? (
                  <CheckCircle2 className="w-5 h-5 animate-pulse" />
                ) : (
                  <Lock className="w-5 h-5 opacity-40" />
                )}
              </div>

              {/* Details text */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-bold ${unlocked ? "text-white" : "text-zinc-600 line-through"}`}>
                    {ach.title}
                  </h4>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                    ach.rarity === "Legendary" ? "bg-rose-950/50 text-rose-400 border border-rose-900/40" :
                    ach.rarity === "Epic" ? "bg-indigo-950/50 text-indigo-400 border border-indigo-900/40" :
                    ach.rarity === "Rare" ? "bg-amber-950/40 text-amber-400 border border-amber-900/40" :
                    "bg-zinc-900 text-zinc-400"
                  }`}>
                    {ach.rarity}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed text-zinc-400">
                  {ach.desc}
                </p>
                <div className="text-[9px] font-semibold text-zinc-500 flex items-center gap-1">
                  <span>REWARD EXP:</span>
                  <span className={unlocked ? "text-[#FFC03D]" : "text-zinc-650 font-normal"}>
                    +{ach.points} pts
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

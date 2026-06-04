import React from "react";
import { soundEngine } from "../audio";
import { Map, MapPin, Zap, X, ShieldAlert, Sparkles } from "lucide-react";

interface AreaNode {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  unlockCondition: string;
}

const WORLD_AREAS: AreaNode[] = [
  { id: "workspace", name: "Main Workspace", x: 800, y: 300, description: "Oak computer desk, skills bookshelves, audio synthesizer controllers.", unlockCondition: "Always available" },
  { id: "projects", name: "Project Lab", x: 800, y: -160, description: "Dual monitors workspace displaying operational client portfolios.", unlockCondition: "Always available" },
  { id: "experience", name: "Career Hall", x: 300, y: 300, description: "Framed diplomas, career chronological timelines.", unlockCondition: "Always available" },
  { id: "achievement", name: "Achievement Gallery", x: 1300, y: 300, description: "Trophy cabinets, collection books dashboards tracker status.", unlockCondition: "Discover by walking east" },
  { id: "observatory", name: "Future Vision Observatory", x: 1300, y: -160, description: "Glass ceiling look-out showing product roadmap blueprints (2026-2030).", unlockCondition: "Unlocked via northern pathway" },
  { id: "contact", name: "Contact Lounge", x: 800, y: 740, description: "Retro TV screens, feedback terminal forms, outbound dispatch gate.", unlockCondition: "Discover by walking south" },
  { id: "secret", name: "Secret Legendary Room", x: 1300, y: 740, description: "Hidden vault storing high-caliber case files, exclusive letters, and hidden achievements.", unlockCondition: "Unlock by finishing all quests" }
];

interface FastTravelMapProps {
  discoveredIds: string[];
  completedQuestsCount: number;
  onTeleport: (x: number, y: number, areaId: string) => void;
  onClose: () => void;
}

export function FastTravelMap({ discoveredIds = [], completedQuestsCount, onTeleport, onClose }: FastTravelMapProps) {
  const handleTravelClick = (area: AreaNode) => {
    // Check lock conditions
    const isSecretLocked = area.id === "secret" && completedQuestsCount < 5;
    const isDiscovered = discoveredIds.includes(area.id) || area.id === "workspace" || area.id === "projects" || area.id === "experience";

    if (area.id === "secret" && isSecretLocked) {
      soundEngine.playBeep(220, 0.15, "triangle");
      return;
    }

    if (!isDiscovered && area.id !== "secret") {
      soundEngine.playBeep(330, 0.12, "sine");
      return;
    }

    // Teleport player
    soundEngine.playBeep(1200, 0.1, "sine");
    setTimeout(() => {
      soundEngine.playBeep(1800, 0.14, "triangle");
    }, 85);
    
    // Warp fly-through triggers
    onTeleport(area.x, area.y, area.id);
  };

  const discoveryCount = WORLD_AREAS.filter(a => discoveredIds.includes(a.id) || ["workspace", "projects", "experience"].includes(a.id)).length;
  const discoveryPercent = Math.round((discoveryCount / WORLD_AREAS.length) * 100);

  return (
    <div className="bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] w-full max-w-2xl overflow-hidden flex flex-col font-mono text-zinc-300">
      
      {/* Target heading */}
      <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-black tracking-widest text-[#FFC03D]">HYPERLOOP FAST TRAVEL NETWORK</span>
        </div>
        <button 
          onClick={() => {
            soundEngine.playClose();
            onClose();
          }}
          className="p-1 px-3 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-500 hover:text-white rounded-lg cursor-pointer transition-all"
        >
          X EXIT MAP
        </button>
      </div>

      {/* Exploration stats bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900/40 p-4 border border-zinc-900 rounded-2xl gap-3 my-4">
        <div className="space-y-1">
          <p className="text-[10px] text-zinc-500 uppercase font-bold">WORLD DISCOVERY ENGINE</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#FFC03D]">{discoveryPercent}% Explored</span>
            <span className="text-[10px] text-zinc-500">({discoveryCount} / {WORLD_AREAS.length} sectors)</span>
          </div>
        </div>

        {/* Mini gauge rewards list */}
        <div className="flex gap-2.5 text-[8px] uppercase">
          <div className={`p-1.5 px-2 rounded-md border ${discoveryPercent >= 25 ? "bg-emerald-950/20 border-emerald-900/45 text-emerald-400 font-bold" : "border-zinc-800 text-zinc-650"}`}>
            25% (Lo-Fi Track)
          </div>
          <div className={`p-1.5 px-2 rounded-md border ${discoveryPercent >= 50 ? "bg-emerald-950/20 border-emerald-900/45 text-emerald-400 font-bold" : "border-zinc-800 text-zinc-650"}`}>
            50% (Meters Room)
          </div>
          <div className={`p-1.5 px-2 rounded-md border ${discoveryPercent >= 75 ? "bg-[#291e12] border-amber-900/45 text-[#FFC03D] font-bold animate-pulse" : "border-zinc-800 text-zinc-650"}`}>
            100% (Secret ending)
          </div>
        </div>
      </div>

      {/* Grid of locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1">
        {WORLD_AREAS.map((area) => {
          const isSecret = area.id === "secret";
          const isSecretLocked = isSecret && completedQuestsCount < 5;
          const isUnlocked = discoveredIds.includes(area.id) || ["workspace", "projects", "experience"].includes(area.id) || (isSecret && !isSecretLocked);

          return (
            <div 
              key={area.id}
              onClick={() => handleTravelClick(area)}
              className={`p-4 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between text-left ${
                isUnlocked 
                  ? "bg-zinc-900/45 border-zinc-850 hover:border-indigo-500 hover:bg-indigo-950/10 cursor-pointer"
                  : "bg-zinc-950/80 border-zinc-950 text-zinc-650 select-none cursor-not-allowed"
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${isUnlocked ? "text-indigo-400 animate-pulse" : "text-zinc-650"}`} />
                    <h4 className={`text-xs font-bold ${isUnlocked ? "text-white group-hover:text-amber-400" : "text-zinc-600"}`}>
                      {area.name}
                    </h4>
                  </div>
                  {isUnlocked ? (
                    <span className="flex items-center gap-0.5 text-[8px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-900/40">
                      <Zap className="w-2 h-2 text-amber-400" />
                      FAST TRAVEL AVAILABLE
                    </span>
                  ) : (
                    <span className="text-[8px] uppercase bg-zinc-900 text-zinc-550 p-1 rounded font-black">
                      LOCKED
                    </span>
                  )}
                </div>

                <p className="text-[10px] leading-relaxed text-zinc-400 min-h-[30px] pt-1">
                  {isUnlocked ? area.description : `Tether offline. ${area.unlockCondition}.`}
                </p>
              </div>

              {/* Status details footer inside nodes */}
              {isUnlocked && (
                <div className="border-t border-zinc-900/60 pt-2 mt-2 flex justify-between items-center text-[8px] text-zinc-500">
                  <span>COORDINATES: X:{area.x} Y:{area.y}</span>
                  <span className="text-indigo-400 group-hover:underline flex items-center gap-0.5">
                    WARP NOW &rarr;
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

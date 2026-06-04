import React, { useState } from "react";
import { motion } from "motion/react";
import { Code, TrendingUp, Sparkles, Target, Activity, Zap, Check } from "lucide-react";

const SKILL_NODES = [
  // Digital Marketing
  { id: "dm_core", category: "Digital Marketing", title: "Digital Marketing Strategy", x: 200, y: 50, unlocked: true },
  { id: "dm_meta", category: "Digital Marketing", title: "Meta Ads", parent: "dm_core", x: 100, y: 150, unlocked: true },
  { id: "dm_google", category: "Digital Marketing", title: "Google Ads", parent: "dm_core", x: 300, y: 150, unlocked: true },
  { id: "dm_seo", category: "Digital Marketing", title: "SEO", parent: "dm_google", x: 250, y: 250, unlocked: false },
  { id: "dm_ana", category: "Digital Marketing", title: "Analytics", parent: "dm_meta", x: 150, y: 250, unlocked: true },
  
  // Development
  { id: "dev_core", category: "Development", title: "Frontend Engineering", x: 600, y: 50, unlocked: true },
  { id: "dev_html", category: "Development", title: "HTML & CSS", parent: "dev_core", x: 500, y: 150, unlocked: true },
  { id: "dev_js", category: "Development", title: "JavaScript", parent: "dev_html", x: 500, y: 250, unlocked: true },
  { id: "dev_react", category: "Development", title: "React", parent: "dev_js", x: 500, y: 350, unlocked: true },
  { id: "dev_ts", category: "Development", title: "TypeScript", parent: "dev_react", x: 450, y: 450, unlocked: false },
  { id: "dev_next", category: "Development", title: "Next.js", parent: "dev_react", x: 550, y: 450, unlocked: false },
  
  // Design
  { id: "des_core", category: "Design", title: "UI/UX Design", x: -200, y: 50, unlocked: true },
  { id: "des_figma", category: "Design", title: "Figma", parent: "des_core", x: -300, y: 150, unlocked: true },
  { id: "des_research", category: "Design", title: "UX Research", parent: "des_core", x: -100, y: 150, unlocked: true },
  { id: "des_brand", category: "Design", title: "Branding", parent: "des_figma", x: -350, y: 250, unlocked: false },
  { id: "des_proto", category: "Design", title: "Prototyping", parent: "des_research", x: -50, y: 250, unlocked: false },

  // Business
  { id: "bus_core", category: "Business", title: "Business Strategy", x: 1000, y: 50, unlocked: true },
  { id: "bus_comm", category: "Business", title: "Communication", parent: "bus_core", x: 900, y: 150, unlocked: true },
  { id: "bus_lead", category: "Business", title: "Leadership", parent: "bus_core", x: 1100, y: 150, unlocked: true },
  { id: "bus_prob", category: "Business", title: "Problem Solving", parent: "bus_lead", x: 1050, y: 250, unlocked: false },
];

export function SkillTreeModal() {
  const [unlockedNodes, setUnlockedNodes] = useState<string[]>(SKILL_NODES.filter(n => n.unlocked).map(n => n.id));
  const [inspectedNode, setInspectedNode] = useState<any>(null);

  const handleNodeClick = (node: any) => {
    // If it has a parent and parent is unlocked, we can unlock it
    if (!unlockedNodes.includes(node.id)) {
      if (!node.parent || unlockedNodes.includes(node.parent)) {
        setUnlockedNodes([...unlockedNodes, node.id]);
        setInspectedNode(node);
      }
    } else {
      setInspectedNode(node);
    }
  };

  return (
    <div className="relative w-full h-[60vh] overflow-auto bg-black border-2 border-zinc-800 rounded-xl hide-scrollbar overflow-x-scroll">
      <div className="absolute top-4 left-4 z-10 p-4 bg-zinc-950/90 border border-zinc-800 rounded-lg">
        <h3 className="text-amber-500 font-bold mb-1">RPG Skill Tree</h3>
        <p className="text-xs text-zinc-400">Click connected nodes to unlock them.</p>
        <p className="text-[10px] text-emerald-400 mt-2">XP: {unlockedNodes.length * 100}</p>
      </div>

      <div className="relative min-w-[1500px] min-h-[600px] mt-10 ml-96 transform translate-x-12 translate-y-12">
        {/* Draw lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {SKILL_NODES.filter(n => n.parent).map((node) => {
            const parent = SKILL_NODES.find(n => n.id === node.parent);
            if (!parent) return null;
            const isUnlockedLine = unlockedNodes.includes(node.id);
            return (
              <line
                key={"line-" + node.id}
                x1={parent.x + 60}
                y1={parent.y + 25}
                x2={node.x + 60}
                y2={node.y + 25}
                stroke={isUnlockedLine ? "#FFC03D" : "#333"}
                strokeWidth={isUnlockedLine ? 3 : 1}
                strokeDasharray={isUnlockedLine ? "0" : "5,5"}
              />
            );
          })}
        </svg>

        {/* Draw nodes */}
        {SKILL_NODES.map((node) => {
          const isUnlocked = unlockedNodes.includes(node.id);
          const isUnlockable = !isUnlocked && (!node.parent || unlockedNodes.includes(node.parent));

          return (
            <motion.button
              key={node.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNodeClick(node)}
              className={`absolute w-[120px] h-[50px] flex items-center justify-center p-2 text-xs font-bold font-mono transition-all ${
                isUnlocked 
                  ? "bg-gradient-to-r from-zinc-900 to-zinc-800 border-2 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(255,192,61,0.3)] z-10" 
                  : isUnlockable 
                    ? "bg-zinc-900 border-2 border-emerald-500/50 text-emerald-400 cursor-pointer animate-pulse z-10"
                    : "bg-black border border-zinc-800 text-zinc-600 cursor-not-allowed z-0"
              }`}
              style={{ left: node.x, top: node.y, borderRadius: '8px' }}
            >
               {isUnlocked && <Check className="w-3 h-3 absolute top-1 left-1 text-amber-500" />}
               <span className="text-center leading-tight">{node.title}</span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Inspected Node Modal */}
      {inspectedNode && (
        <div className="absolute top-1/4 right-8 w-64 bg-zinc-950 border-2 border-amber-500 rounded-xl p-4 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.8)]">
          <h4 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" /> {inspectedNode.title}
          </h4>
          <p className="text-xs text-zinc-300 mb-2 border-b border-zinc-800 pb-2">Category: {inspectedNode.category}</p>
          <div className="text-[11px] text-zinc-400 space-y-1">
             <p>Experience: Professional</p>
             <p>Tools Used: Assorted {inspectedNode.category} Stack</p>
             <p>Projects: Active in 4+ Projects</p>
             <p className="text-emerald-400 font-bold mt-2 pt-2 border-t border-zinc-800">+100 XP Mined</p>
          </div>
          <button onClick={() => setInspectedNode(null)} className="mt-4 w-full bg-zinc-900 text-zinc-400 hover:text-white py-1 rounded text-xs border border-zinc-800 hover:border-zinc-700">Dismiss</button>
        </div>
      )}
    </div>
  );
}

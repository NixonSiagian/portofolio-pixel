import React, { useState, useEffect } from "react";
import { soundEngine } from "../audio";
import { 
  Laptop, Smartphone, ArrowLeft, ExternalLink, Sparkles, 
  RotateCcw, ShieldCheck, Zap, ArrowRight, Layers 
} from "lucide-react";
import { Project } from "../types";

interface ProjectShowcaseCinemaProps {
  project: Project;
  onClose: () => void;
}

export function ProjectShowcaseCinema({ project, onClose }: ProjectShowcaseCinemaProps) {
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop");
  const [isScrolling, setIsScrolling] = useState(true);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [beforeAfterToggle, setBeforeAfterToggle] = useState<"before" | "after">("after");

  // Auto scrolling simulation loop
  useEffect(() => {
    let interval: any;
    if (isScrolling) {
      interval = setInterval(() => {
        setScrollAmount((prev) => (prev >= 100 ? 0 : prev + 0.35));
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isScrolling]);

  const handleDeviceChange = (type: "desktop" | "mobile") => {
    soundEngine.playBeep(700, 0.05, "sine");
    setDeviceType(type);
    setScrollAmount(0);
  };

  // Build simulated screens corresponding to projects
  const renderSimulatedContent = () => {
    if (project.id === "alcho-foods") {
      return (
        <div className="w-full bg-[#1c121e] text-[#f7e8ee] p-4 text-[10px] space-y-4 font-sans select-none">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-rose-500/20 pb-2">
            <span className="font-bold tracking-wider text-amber-400">🍷 ALCHO BOUTIQUE</span>
            <div className="flex gap-2 text-[7px] text-rose-300">
              <span>FLAVORS</span>
              <span>CARTS</span>
            </div>
          </div>
          {/* Hero space */}
          <div className="text-center py-6 space-y-2 bg-gradient-to-b from-[#351a37] to-transparent rounded-lg">
            <h1 className="text-sm font-black text-white italic tracking-tight">SENSORY REVELATION</h1>
            <p className="text-[7px] text-zinc-400 max-w-xs mx-auto">Craft organic botanical elixirs brewed with standard garden ingredients.</p>
            <div className="inline-block px-3 py-1 bg-amber-500 text-black text-[7px] font-bold rounded-full">SHOP BOTTLES</div>
          </div>
          {/* Flavor catalog */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#2a1b2e] p-2 rounded border border-rose-500/10">
              <div className="h-16 bg-[#40203f] rounded flex items-center justify-center text-white font-bold text-[8px]">AMBER INFUSION</div>
              <div className="flex justify-between items-center mt-1 text-[8px]">
                <span>Vanilla Lavender</span>
                <span className="text-amber-400">$34.00</span>
              </div>
            </div>
            <div className="bg-[#2a1b2e] p-2 rounded border border-[#FF3D57]/10">
              <div className="h-16 bg-[#4a1824] rounded flex items-center justify-center text-white font-bold text-[8px]">ROSE ELIXIR</div>
              <div className="flex justify-between items-center mt-1 text-[8px]">
                <span>Cherry Hibiscus</span>
                <span className="text-[#FF3D57]">$38.00</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (project.id === "marketing-funnels") {
      return (
        <div className="w-full bg-zinc-950 text-emerald-400 p-4 text-[10px] space-y-3 font-mono select-none">
          {/* Funnel chart header */}
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="text-[8px] text-zinc-500 uppercase font-bold text-emerald-500">🛰️ FUNNEL TRACKER GA4</span>
            <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded text-[7px]">LIVE TELEMETRY</span>
          </div>
          {/* Graphs */}
          <div className="p-3 bg-zinc-900/60 border border-zinc-900 rounded-lg space-y-2.5">
            <div className="flex justify-between text-[7px] text-zinc-400">
              <span>Meta Ads CTR Rate</span>
              <span className="text-emerald-400 font-bold">+5.82% Peak</span>
            </div>
            <div className="w-full bg-zinc-950 h-16 rounded overflow-hidden relative flex items-end p-1 gap-1">
              <div className="bg-[#10B981] w-[14%] h-[35%] animate-pulse" />
              <div className="bg-[#10B981] w-[14%] h-[50%]" />
              <div className="bg-[#10B981] w-[14%] h-[42%]" />
              <div className="bg-[#10B981] w-[14%] h-[72%]" />
              <div className="bg-[#10B981] w-[14%] h-[60%]" />
              <div className="bg-[#10B981] w-[14%] h-[85%] animate-pulse" />
              <div className="bg-[#10B981] w-[14%] h-[95%]" />
            </div>
          </div>
          {/* Campaigns lists */}
          <div className="space-y-1.5">
            <div className="flex justify-between p-1.5 bg-zinc-900/40 rounded border border-zinc-900 text-[8px]">
              <span className="text-white">&gt; campaign_ad_set_A</span>
              <span className="text-emerald-400 font-bold">3.8x ROAS</span>
            </div>
            <div className="flex justify-between p-1.5 bg-zinc-900/40 rounded border border-zinc-900 text-[8px]">
              <span className="text-white">&gt; campaign_seo_landers</span>
              <span className="text-emerald-400 font-bold">12% Conv</span>
            </div>
          </div>
        </div>
      );
    } else {
      // Default website preview template
      return (
        <div className="w-full bg-zinc-950 text-zinc-300 p-4 text-[10px] space-y-4 font-sans select-none">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="font-black text-indigo-400">⚛️ QUANTUM LANDER</span>
            <span className="text-zinc-650 text-[8px]">INTEGRATIONS COMPLETE</span>
          </div>
          <div className="py-8 bg-zinc-900/30 rounded-xl border border-zinc-900 text-center space-y-3 p-4">
            <div className="inline-block px-2 py-0.5 bg-indigo-950 border border-indigo-500/30 rounded text-indigo-400 text-[7px] uppercase font-bold tracking-wider">SPEED SCORE TEST</div>
            <h1 className="text-xs uppercase font-black text-white">100/100 SPEED CORE WEB VITALS</h1>
            <p className="text-[8px] text-zinc-500">Perfect accessibility, light-optimized bundles, instant conversions.</p>
          </div>
          <div className="w-full h-24 bg-zinc-900/10 rounded border border-dashed border-zinc-900 flex items-center justify-center text-[8px] text-zinc-500 uppercase">
            Scrolling Portfolio Section Preview
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070509]/98 backdrop-blur-2xl flex flex-col md:flex-row font-mono text-zinc-300 overflow-hidden">
      
      {/* LEFT PANEL: Project brief & details case study */}
      <div className="w-full md:w-[420px] bg-zinc-950 border-r border-zinc-900/80 p-6 flex flex-col justify-between overflow-y-auto shrink-0 space-y-6">
        
        {/* Back and title spacing */}
        <div className="space-y-6">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-500 hover:text-white bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg active:scale-95 transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; Exit Projects OS Cinema</span>
          </button>

          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-amber-400 tracking-widest bg-amber-950/40 border border-amber-900/40 px-2 py-0.5 rounded-md">
              {project.category}
            </span>
            <h2 className="text-lg font-black tracking-tight text-white leading-tight">
              {project.title}
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-zinc-400 font-sans">
            {project.description}
          </p>

          {/* Key Metric Glow Box */}
          {project.metric && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-zinc-900/50 border border-indigo-900/30 shadow-[0_5px_15px_rgba(99,102,241,0.05)] space-y-1">
              <span className="text-[9px] text-indigo-400 uppercase font-black tracking-wider block">KEY MARKETING IMPACT METRICS</span>
              <p className="text-xs font-black text-white italic">{project.metric}</p>
            </div>
          )}

          {/* Core Technologies */}
          <div className="space-y-2">
            <span className="text-[9px] text-zinc-500 font-black tracking-wider uppercase block">CORE TECH MATRIX</span>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((t, idx) => (
                <span key={idx} className="bg-zinc-900 px-2 py-1 rounded text-[9px] text-zinc-400 border border-zinc-800/40">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Before / After Case Timeline */}
        <div className="bg-zinc-900/30 p-4 border border-zinc-900 rounded-2xl space-y-3 font-sans mt-auto">
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className="text-zinc-500 uppercase font-bold tracking-wider">DIAGNOSTIC SNAPSHOT</span>
            {/* Toggle before vs after feedback */}
            <div className="flex border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden font-bold">
              <button 
                onClick={() => {
                  soundEngine.playBeep(440, 0.05, "sine");
                  setBeforeAfterToggle("before");
                }}
                className={`px-2 py-0.5 text-[8px] uppercase ${beforeAfterToggle === "before" ? "bg-rose-950 text-rose-300 border-r border-[#FF3D57]/30" : "text-zinc-600"}`}
              >
                Before
              </button>
              <button 
                onClick={() => {
                  soundEngine.playBeep(440, 0.05, "sine");
                  setBeforeAfterToggle("after");
                }}
                className={`px-2 py-0.5 text-[8px] uppercase ${beforeAfterToggle === "after" ? "bg-emerald-950 text-emerald-300" : "text-zinc-600"}`}
              >
                Optimized
              </button>
            </div>
          </div>

          <div className="text-[10px] space-y-1">
            {beforeAfterToggle === "before" ? (
              <div className="space-y-1.5 text-rose-300/80 italic leading-relaxed">
                <p>• Bounce rate was hovering around 64% due to long script delays.</p>
                <p>• Conversion pixels misaligned; missing attribution telemetry codes.</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-emerald-400 bg-emerald-950/20 p-2 border border-emerald-900/20 rounded-lg leading-relaxed">
                <p className="font-bold">• Re-engineered into virtual DOM hydration (Vite-optimized builds).</p>
                <p>• Placed perfect schema tags + direct funnel event callbacks.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT PANEL: Cinematic Interactive Wireframe Screen Simulator */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative">
        {/* Particle grids backdrop */}
        <div className="absolute inset-0 bg-radial-grid opacity-15 pointer-events-none" />

        {/* Dynamic Controls bar */}
        <div className="absolute top-4 inset-x-8 flex justify-between items-center z-20">
          <div className="flex gap-2">
            <button 
              onClick={() => handleDeviceChange("desktop")}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-[10px] uppercase font-bold border transition-all cursor-pointer ${
                deviceType === "desktop" 
                  ? "bg-white text-zinc-950 border-white shadow-xl" 
                  : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800/80 text-zinc-400"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DESKTOP MOCKUP</span>
            </button>
            <button 
              onClick={() => handleDeviceChange("mobile")}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-[10px] uppercase font-bold border transition-all cursor-pointer ${
                deviceType === "mobile" 
                  ? "bg-white text-zinc-950 border-white shadow-xl" 
                  : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800/80 text-zinc-400"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MOBILE MOCKUP</span>
            </button>
          </div>

          <button 
            onClick={() => setIsScrolling(prev => !prev)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold py-2 px-3 border border-zinc-800 rounded-xl text-zinc-450 cursor-pointer"
          >
            <RotateCcw className={`w-3 h-3 ${isScrolling ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
            <span>{isScrolling ? "PAUSE FEED" : "PLAY SCROLL"}</span>
          </button>
        </div>

        {/* IMMERSIVE DEVICE CHASSIS GLOWING FRAME */}
        <div className="relative z-10 w-full max-w-2xl flex items-center justify-center transition-all duration-700">
          
          {deviceType === "desktop" ? (
            /* Desktop Monitor Layout */
            <div className="w-full bg-zinc-900 rounded-3xl p-3 shadow-[0_30px_70px_rgba(0,0,0,0.9)] border border-zinc-800 flex flex-col aspect-[16/10] overflow-hidden">
              {/* Browser control dots tab */}
              <div className="flex items-center gap-1.5 pb-2.5 px-2 border-b border-zinc-950">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
                <span className="bg-zinc-950/80 px-4 py-0.5 text-[7px] text-zinc-500 rounded-md tracking-wider flex-1 text-center font-mono">
                  https://emmanuelnixon.siagian/{project.id}
                </span>
              </div>
              {/* Scrolling webpage viewport */}
              <div className="flex-1 bg-zinc-950 overflow-hidden relative rounded-xl border border-zinc-950/80">
                <div 
                  className="w-full absolute left-0 transition-all duration-300 ease-out" 
                  style={{ top: `-${scrollAmount * 2.2}px` }}
                >
                  {renderSimulatedContent()}
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Device Frame */
            <div className="w-64 bg-zinc-900 rounded-[44px] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.9)] border-4 border-zinc-805 flex flex-col shrink-0 aspect-[9/18] overflow-hidden relative">
              {/* Status capsule notch detail */}
              <div className="w-28 h-5.5 bg-zinc-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20 flex justify-between items-center px-4 font-sans text-[6px] text-zinc-500">
                <span>09:41</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              {/* Scrolling page viewport inside phone */}
              <div className="flex-1 bg-zinc-950 overflow-hidden relative rounded-[32px] border border-zinc-950/50 mt-1">
                <div 
                  className="w-full absolute left-0 transition-all duration-300 ease-out" 
                  style={{ top: `-${scrollAmount * 2.8}px` }}
                >
                  {renderSimulatedContent()}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Immersive HUD guidelines details */}
        <div className="absolute bottom-4 text-[9px] text-zinc-600 font-bold tracking-widest text-center uppercase pointer-events-none">
          ⚡ IMMERSIVE LIVE SCROLLING ACTIVE EMULATION
        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "../audio";
import { Terminal, Shield, Cpu, ChevronRight, CornerDownLeft, Sparkles } from "lucide-react";

interface NixonTerminalProps {
  onClose?: () => void;
  onOpenSection?: (section: "about" | "projects" | "skills" | "experience" | "resume" | "contact") => void;
  onTriggerAchievement?: (id: string, title: string, desc: string) => void;
}

export function NixonTerminal({ onClose, onOpenSection, onTriggerAchievement }: NixonTerminalProps) {
  const [history, setHistory] = useState<{ type: "input" | "output" | "system"; text: string }[]>(() => {
    try {
      const saved = sessionStorage.getItem("nixon_terminal_history");
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [
      { type: "system", text: "NIXON CORE INTEGRATED TERMINAL [v4.12.98.6]" },
      { type: "system", text: "SECURITY PROTOCOLS LOADED. CREDENTIALS VERIFIED." },
      { type: "output", text: "Greetings, Explorer. I am the Nixon AI Mainframe representing Emmanuel's technical workspace." },
      { type: "output", text: "Type 'help' for available commands, or type 'about nixon' to begin." }
    ];
  });
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem("nixon_terminal_cmd_history");
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { sessionStorage.setItem("nixon_terminal_history", JSON.stringify(history)); } catch (e) {}
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    try { sessionStorage.setItem("nixon_terminal_cmd_history", JSON.stringify(commandHistory)); } catch (e) {}
  }, [commandHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    soundEngine.playBeep(980, 0.04, "square");
    
    const newHistory = [...history, { type: "input" as const, text: `> ${cmd}` }];
    setCommandHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInputVal("");

    const normalizedCmd = cmd.toLowerCase();

    let reply = "";
    let systemTask = () => {};

    if (normalizedCmd === "help") {
      reply = `Available terminal operations:
  about nixon       - Display executive biography & target summary
  show projects     - Lists client-side build highlights
  show skills       - View core dev & engineering frameworks stack
  show experience   - Review career milestones & company campaigns
  contact           - Open communications dispatch channel
  download resume   - Quick-load professional resume file
  future goals      - Look into future visions & startup concepts
  clear             - Reset terminal telemetry feed
  help              - Display this diagnostic matrix`;
    } else if (normalizedCmd === "clear") {
      setHistory([]);
      return;
    } else if (normalizedCmd.includes("about") || normalizedCmd.includes("nixon") && !normalizedCmd.includes("show")) {
      reply = `EMMANUEL NIXON SIAGIAN — CHIEF ENGINEER & MARKETING STRATEGIST
----------------------------------------------------------------------
Role: Growth-focused Product Builder & Digital Optimization Specialist
Expertise: Bridging heavy technical React codebases with analytical SEO, conversion rate optimization (CRO), and multi-channel campaign architectures.
Philosophy: "Code like an engineer, optimize like a marketing director."`;
      systemTask = () => {
        if (onOpenSection) onOpenSection("about");
        onTriggerAchievement?.("used_terminal", "📟 Terminal Hacker", "Executed complex parameters through the retro AI mainframe.");
      };
    } else if (normalizedCmd === "show projects") {
      reply = `LAUNCHING SIMULATED OS REPOSITORY...
Loading major portfolio builds:
[1] STRETCH LAB ARCHIVE - Interactive CRM platform with Google Forms hook
[2] LIMO SERVICES - Premium route scheduling & booking framework
[3] DENTAL CLINIC HUD - Custom clinic check-ins and appointments tracker
Opening Projects room now...`;
      systemTask = () => {
        setTimeout(() => { if (onOpenSection) onOpenSection("projects"); }, 1200);
        onTriggerAchievement?.("used_terminal", "📟 Terminal Hacker", "Executed complex parameters through the retro AI mainframe.");
      };
    } else if (normalizedCmd === "show skills") {
      reply = `RE-ROUTING ANALYTICAL CODES...
Retrieving digital skill sectors:
- Frontend Core: React, Next.js, Vite, TypeScript, Tailwind CSS
- Data Telemetry: Google Analytics 4, Meta Pixel, Tag Manager (GTM)
- Search Engine: Advanced Technical SEO, Core Web Vitals audit, Semrush
Accessing Skills archive...`;
      systemTask = () => {
        setTimeout(() => { if (onOpenSection) onOpenSection("skills"); }, 1200);
        onTriggerAchievement?.("used_terminal", "📟 Terminal Hacker", "Executed complex parameters through the retro AI mainframe.");
      };
    } else if (normalizedCmd === "show experience") {
      reply = `OPENING CHRONOLOGICAL CAREER RECORDS...
Accessing agencies archives, ROAS optimizations, and lead conversions timeline...`;
      systemTask = () => {
        setTimeout(() => { if (onOpenSection) onOpenSection("experience"); }, 1200);
        onTriggerAchievement?.("used_terminal", "📟 Terminal Hacker", "Executed complex parameters through the retro AI mainframe.");
      };
    } else if (normalizedCmd === "contact") {
      reply = `DISPATCHING OUTBOUND COMMUNICATION PORT...
Loading SMTP secure dispatch form modal...`;
      systemTask = () => {
        setTimeout(() => { if (onOpenSection) onOpenSection("contact"); }, 1200);
      };
    } else if (normalizedCmd === "download resume") {
      reply = `GENERATING RESUME CV PDF DOWNLOAD TETHER...
Booting CRT resume viewer screen...`;
      systemTask = () => {
        setTimeout(() => { if (onOpenSection) onOpenSection("resume"); }, 1200);
      };
    } else if (normalizedCmd.includes("future") || normalizedCmd.includes("goals") || normalizedCmd.includes("vision")) {
      reply = `OPENING SYSTEM REPORT: FUTURE GOALS (2026-2030)
------------------------------------------------------
- Startup Ideas: Building AI-Powered visual drag-and-drop CRO landers.
- Tech Devs: Mastering WebGPU, three.js canvas optimizations, and hyper-automated analytical web hooks.
- Professional Vision: Directing technical marketing pipelines for international SaaS scaleups.`;
      systemTask = () => {
        onTriggerAchievement?.("future_vision", "🔭 Visionary", "Glimpsed Emmanuel Nixon's inspiring rooftop goals of tomorrow.");
      };
    } else {
      reply = `COMMAND NOT RECOGNIZED: '${cmd}'. Type 'help' to review available mainframe diagnostics.`;
    }

    setHistory(prev => [
      ...prev,
      { type: "input", text: `> ${cmd}` },
      { type: "output", text: reply }
    ]);
    systemTask();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div className="bg-[#040905] border-2 border-[#10B981]/50 w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col font-mono text-xs text-[#10B981] h-[340px] sm:h-[400px]">
      
      {/* Header bar */}
      <div className="bg-[#07150A] border-b border-[#10B981]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#10B981] animate-pulse" />
          <span className="font-bold tracking-widest text-[#10B981]">NIXON_AI_PORTFOLIO_OS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-900/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-900/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 hover:scale-110 transition-transform cursor-pointer" onClick={onClose} title="Exit Term" />
        </div>
      </div>

      {/* Terminal lines feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 select-text scrollbar-thin scrollbar-thumb-emerald-950">
        {history.map((h, i) => (
          <div key={i} className={`whitespace-pre-wrap leading-relaxed ${
            h.type === "input" ? "text-amber-400 font-bold" :
            h.type === "system" ? "text-[#10B981]/60 text-[10px] uppercase border-b border-[#10B981]/10 pb-1" :
            "text-[#10B981]/90"
          }`}>
            {h.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input panel Form */}
      <form onSubmit={handleCommand} className="bg-[#050E06] border-t border-[#10B981]/30 p-3 flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="System command? try 'help'..."
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-amber-300 font-bold placeholder-[#10B981]/20 caret-amber-400 text-xs"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-[10px] text-[#10B981] hover:text-white rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95"
        >
          <span>EXECUTE</span>
          <CornerDownLeft className="w-3 h-3 text-[#10B981]/70" />
        </button>
      </form>
    </div>
  );
}

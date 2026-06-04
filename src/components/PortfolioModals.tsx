import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Briefcase, BookOpen, Award, Tv, Mail, 
  X, ExternalLink, Download, CheckCircle, Flame, 
  TrendingUp, Sparkles, Code, Globe, Play, Heart,
  Send, Compass, Database, Layers
} from "lucide-react";
import { Project, ExperienceItem, SkillCategory } from "../types";
import { soundEngine } from "../audio";
import { DecorModalContent } from "./DecorModalContent";
import { SkillTreeModal } from "./SkillTreeModal";

// Mock Data
export const PROJECTS_DATA: Project[] = [
  {
    id: "alcho-foods",
    title: "Alcho Foods Website",
    category: "Web Development",
    description: "A premium, fully interactive e-commerce and product discovery solution built for a craft boutique beverage brand. Designed from scratch with custom cursor feedback, smooth fluid category transitions, and a highly sensory visual layout.",
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Web Audio API"],
    features: [
      "Dynamic immersive audio ambiance matched to flavor selections",
      "Liquid-smooth catalog filtering and real-time state calculation",
      "Interactive cart checkout flow with micro-feedback alerts"
    ],
    metric: "+42% Conversion Rate Boost & +18% User Session Duration",
    accentColor: "from-amber-500 to-rose-600",
    mockupType: "website"
  },
  {
    id: "marketing-funnels",
    title: "Digital Marketing Multi-Channel Funnel",
    category: "Digital Marketing",
    description: "An integrated client acquisition pipeline coordinating targeted paid media (Meta Ads, Google Search) with rapid-response SEO landing pages. Directed $15,000+ targeted campaign budgets focusing strictly on low CPC and high customer-lifetime-value conversions.",
    technologies: ["Meta Business Suite", "Google Ads Planner", "Semrush", "Google Analytics 4"],
    features: [
      "Dynamic creative iterations achieving a documented 3.8x ROAS",
      "Meta Ads campaign reaching 120,000+ hyper-targeted personas",
      "Integrated conversion tracking mapping precise offline-to-online lead activities"
    ],
    metric: "3.8x Positive ROAS & 2,400+ Quality Leads in 90 Days",
    accentColor: "from-blue-500 to-emerald-500",
    mockupType: "analytics"
  },
  {
    id: "landing-pages",
    title: "Lead Acquisition Lander Fleet",
    category: "UI/UX & Branding",
    description: "A suite of custom, lightweight, high-scoring responsive landing pages engineered for maximum information accessibility and rapid opt-ins. Achieved a perfect 100/100 Core Web Vitals audit ranking.",
    technologies: ["Tailwind CSS", "Astro Engine", "Framer Motion", "Google Tag Manager"],
    features: [
      "Bypass heavy runtime components to guarantee instantaneous page load times",
      "Integrated subtle visual focus locks guiding user focus to capture inputs",
      "Strict compliance with screen-reader accessible standards and high-contrast styling"
    ],
    metric: "24.6% Average Newsletter Sign-up Rate (99 Mobile PageSpeed)",
    accentColor: "from-purple-500 to-pink-500",
    mockupType: "website"
  },
  {
    id: "branding-sprints",
    title: "Visual Identity & Branding Systems",
    category: "UI/UX & Branding",
    description: "Cohesive visual architecture created for fast-scaling local brands and boutique consumer packaged goods (CPG). Formulated comprehensive color theory maps, customized primary grid guidelines, and core digital representation guides.",
    technologies: ["Figma Vector Design", "Adobe Illustrator", "Color Theory maps", "Brand Bible guides"],
    features: [
      "Complete typographic hierarchy grids for diverse social, print, and web media",
      "Bespoke vector iconography suites aligned with clean Stardew/Retro or Sleek modern styles",
      "Production-ready packaging assets and secondary branding kits"
    ],
    metric: "100% Brand Consistency Delivered Across 5 Digital Channels",
    accentColor: "from-yellow-500 to-amber-600",
    mockupType: "branding"
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Lead Digital Strategist & Developer",
    company: "Freelance Consultancy & Design Studio",
    period: "2023 - PRESENT",
    description: "Bridging the gap between front-end web interaction design and business funnel strategy. Implementing highly interactive client portals, landing pages, and search optimization frameworks.",
    bullets: [
      "Architected clean interactive portfolios and customized showcase platforms raising customer engagement scores by 35%.",
      "Integrated Conversion Rate Optimization (CRO) frameworks on existing commercial platforms, translating to direct sales improvements.",
      "Delivered lightweight web products that load in under 500ms, boasting perfect desktop SEO metrics."
    ],
    tags: ["React/TypeScript", "CRO Funnel Audit", "Tailwind CSS", "Search Engine Optimization"],
    iconName: "code"
  },
  {
    id: "exp-2",
    role: "Digital Marketing Specialist",
    company: "Growth Catalyst Agency",
    period: "2021 - 2023",
    description: "Deconstruct customer search intent paths to build high-performance search campaigns, coordinate paid media metrics, and continuous page copy split testing.",
    bullets: [
      "Managed $50k+ annual advertising campaigns on Meta and Google Search with a combined positive conversion index.",
      "Designed high-converting structural landers mapping specifically to campaign target keywords, raising click-through rates.",
      "Conducted systemic A/B copy tests that accelerated monthly capture volume by 18%."
    ],
    tags: ["Paid Ads Strategy", "Copywriting", "A/B Split Testing", "Google Analytics 4"],
    iconName: "trending-up"
  },
  {
    id: "exp-3",
    role: "UX Design & Web Intern",
    company: "Studio Eleven Creative",
    period: "2020 - 2021",
    description: "Created high-fidelity interactive user experiences, wireframed conversion-focused checkout structures, and gathered digital accessibility metrics.",
    bullets: [
      "Collaborated on Figma wireframing and interactive prototyping sprints for consumer goods brands.",
      "Observed user testing heatmaps to identify friction points during desktop checkout flows.",
      "Designed custom micro-interaction feedback loops (success checkmarks, bounce notifications)."
    ],
    tags: ["Figma Prototyping", "UI Wireframing", "User Heatmap Auditing", "Micro-Interactions"],
    iconName: "award"
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Digital Marketing",
    iconName: "trending-up",
    skills: [
      { name: "Paid Acquisition (Meta/Google Ads)", level: 92, tier: "Expert" },
      { name: "Conversion Rate Optimization (CRO)", level: 90, tier: "Expert" },
      { name: "SEO Strategy & Key Matchups", level: 88, tier: "Advanced" },
      { name: "Funnel Strategy & Web Copywriting", level: 95, tier: "Expert" },
      { name: "Growth Analytics (GA4/GTM)", level: 85, tier: "Advanced" }
    ]
  },
  {
    category: "Web Development",
    iconName: "code",
    skills: [
      { name: "React & TypeScript Ecosystem", level: 89, tier: "Expert" },
      { name: "Next.js & Serverless Builders", level: 80, tier: "Advanced" },
      { name: "Tailwind CSS & Utility Sprints", level: 95, tier: "Expert" },
      { name: "HTML5 Canvas & Responsive Engines", level: 85, tier: "Advanced" },
      { name: "Web Audio Synthesizers", level: 75, tier: "Intermediate" }
    ]
  },
  {
    category: "UI/UX & Branding Style",
    iconName: "sparkles",
    skills: [
      { name: "Figma High-Fidelity Canvas", level: 94, tier: "Expert" },
      { name: "Bespoke Vector Layouts", level: 88, tier: "Advanced" },
      { name: "Cozy Micro-Animations", level: 92, tier: "Expert" },
      { name: "Palette Mapping & Branding Books", level: 90, tier: "Expert" }
    ]
  }
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: string | null;
  mode: "rpg" | "cinematic";
  isDevMode?: boolean;
}

export function PortfolioModals({ isOpen, onClose, section, mode, isDevMode = false }: ModalProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(PROJECTS_DATA[0]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", msg: "" });
  const [formSent, setFormSent] = useState(false);
  
  // Interactive Story levels tracking state
  const [experienceMode, setExperienceMode] = useState<"story" | "timeline">("story");
  const [activeChapter, setActiveChapter] = useState(0);

  // Simulated PC Desktop OS States
  const [bootProgress, setBootProgress] = useState(0);
  const [isOsBooted, setIsOsBooted] = useState(false);
  const [openAppWindow, setOpenAppWindow] = useState<"safari" | "excel" | "figma" | "terminal" | null>(null);
  const [cmdLogs, setCmdLogs] = useState<string[]>([
    "System deployed successfully.", 
    "Welcome to Nixon Portfolio OS v4.1.", 
    "Type 'help' to review active commands."
  ]);
  const [cmdInput, setCmdInput] = useState("");

  // Simulated CRT TV States
  const [tvStaticOn, setTvStaticOn] = useState(true);

  // Trigger loading countdown when Projects Desk opens
  useEffect(() => {
    if (!isOpen || section !== "projects") {
      setIsOsBooted(false);
      setBootProgress(0);
      setOpenAppWindow(null);
      return;
    }

    // Interactive beep sequence representing retro PC motherboard post clicks
    soundEngine.playBeep(400, 0.08, "triangle");
    setTimeout(() => soundEngine.playBeep(600, 0.06, "sine"), 120);
    setTimeout(() => soundEngine.playBeep(800, 0.1, "triangle"), 200);

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        const step = Math.floor(Math.random() * 12) + 8;
        if (prev + step >= 100) {
          clearInterval(interval);
          setIsOsBooted(true);
          soundEngine.playBeep(987.77, 0.14, "sine");
          setTimeout(() => soundEngine.playBeep(1318.51, 0.25, "triangle"), 80);
          return 100;
        }
        return prev + step;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, section]);

  // TV static raster interference flicker countdown
  useEffect(() => {
    if (!isOpen || section !== "resume") {
      setTvStaticOn(true);
      return;
    }

    const staticTimer = setTimeout(() => {
      setTvStaticOn(false);
      soundEngine.playBeep(523.25, 0.15, "triangle");
    }, 650);

    return () => clearTimeout(staticTimer);
  }, [isOpen, section]);

  if (!isOpen || !section) return null;

  const titleFontClass = mode === "rpg" ? "font-game text-xs uppercase text-cozy-gold leading-normal tracking-wide" : "font-display text-xl font-bold tracking-tight text-white";
  const bodyFontClass = mode === "rpg" ? "font-mono text-xs leading-relaxed text-cozy-light" : "font-sans text-sm tracking-wide text-zinc-300 leading-relaxed";

  const isRpg = mode === "rpg";

  const handleClose = () => {
    soundEngine.playClose();
    onClose();
  };

  const handleEmailCopy = () => {
    soundEngine.playBeep(880, 0.1, "sine");
    navigator.clipboard.writeText("nixonsiagian578@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playBeep(1200, 0.2, "triangle");
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormState({ name: "", email: "", msg: "" });
      handleClose();
    }, 2500);
  };

  // Commands processor helper inside the simulated Computer Terminal
  const executeTerminalCmd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmd = cmdInput.trim().toLowerCase();
    let reply = "";
    soundEngine.playBeep(700, 0.05, "sine");

    if (cmd === "help") {
      reply = "COMMANDS: [about] Displays owner profile, [list] Lists portfolio projects, [hack] Toggles DEV status, [achievements] Displays unlocks, [clear] Wipes display logs.";
    } else if (cmd === "about") {
      reply = "EMMANUEL NIXON SIAGIAN: Multi-channel ad architect and frontend specialist based in Jakarta.";
    } else if (cmd === "list") {
      reply = "REPOSITORY: [alcho-foods] Boutique gourmet beverage store, [marketing-funnels] 3.8x ROAS analytics pipeline, [landing-pages] 100/100 Core metrics landers.";
    } else if (cmd === "hack") {
      reply = "STATUS DETECTED: [DEVELOPER HACK OVERRIDE ACTIVE]. Welcome high-level workspace admin.";
    } else if (cmd === "clear") {
      setCmdLogs([]);
      setCmdInput("");
      return;
    } else if (cmd === "achievements") {
      reply = isDevMode 
        ? "UNLOCKED: [Botanist Explorer, Cozy Symphonist, Entered Portfolio, Weather Architect, Cyber Hacker]. Status: Complete!"
        : "UNLOCKED: [Entered Portfolio]. Tip: Tap the potted plant 5 times inside the room directory!";
    } else {
      reply = `Unknown signal: '${cmd}'. Type 'help' for directory nodes.`;
    }

    setCmdLogs((prev) => [...prev, `> ${cmdInput}`, reply]);
    setCmdInput("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        
        {/* Blur shield backdrop overlay */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className={`absolute inset-0 ${isRpg ? 'bg-black/85 backdrop-blur-xs' : 'bg-zinc-950/80 backdrop-blur-md'}`}
        />

        {/* Cinematic dialog modal window */}
        <motion.div
          id="modal-window"
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className={`relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto ${
            isRpg 
              ? 'border-[6px] border-[#3F221E] bg-[#1E0F0B] text-[#FDF6E2] p-4 sm:p-6 shadow-[0_0_0_6px_#0C080A,0_20px_50px_rgba(0,0,0,0.9)] rounded-none pixelated' 
              : 'border border-zinc-800 bg-zinc-900/90 text-white rounded-2xl shadow-2xl backdrop-blur-xl'
          }`}
          style={isRpg ? { backgroundImage: 'radial-gradient(#2D1714 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' } : {}}
        >
          
          {/* Header element bar */}
          <div className={`flex items-center justify-between mb-5 pb-3.5 ${isRpg ? 'border-b-4 border-[#3F221E]' : 'border-b border-zinc-800'}`}>
            <div className="flex items-center gap-3">
              {section === "about" && <User className={`${isRpg ? 'text-amber-400' : 'text-[#FFC03D]'} w-5 h-5 animate-pulse`} />}
              {section === "projects" && <Briefcase className={`${isRpg ? 'text-[#FFC03D]' : 'text-amber-400'} w-5 h-5`} />}
              {section === "skills" && <BookOpen className="text-emerald-400 w-5 h-5" />}
              {section === "experience" && <Award className="text-amber-400 w-5 h-5" />}
              {section === "resume" && <Tv className="text-sky-400 w-5 h-5 animate-bounce" />}
              {section === "contact" && <Mail className="text-pink-400 w-5 h-5" />}
              {section?.startsWith("decor_") && <Sparkles className="text-purple-400 w-5 h-5 animate-pulse" />}
              
              <h2 className={titleFontClass}>
                {section === "about" && "Workspace Diary / About Emmanuel"}
                {section === "projects" && "Portfolio OS Desktop Simulator v4.1"}
                {section === "skills" && "The Skill Bookshelf"}
                {section === "experience" && "Wall of Experience Timeline"}
                {section === "resume" && "CRT Broadcast Television"}
                {section === "contact" && "Signal Transmitter Gateway"}
                {section?.startsWith("decor_") && "Immersive Discovery"}
              </h2>
            </div>

            <button
              id="close-modal-btn"
              onClick={handleClose}
              className={`p-1.5 cursor-pointer transition-all ${
                isRpg 
                  ? 'bg-[#5C211A] border-4 border-[#1E0F0B] hover:bg-[#8B2C21] text-white active:translate-y-0.5' 
                  : 'text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full'
              }`}
              title="Close modal and return back"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Core Content area */}
          <div className="min-h-[46vh]">
            
            {/* 1. ABOUT ME SECTION */}
            {section === "about" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Portrait bio card */}
                <div className="md:col-span-4 flex flex-col items-center text-center">
                  <div className={`p-2 mb-4 bg-gradient-to-br from-[#FFC03D] via-pink-500 to-indigo-500 shadow-xl ${isRpg ? 'border-4 border-amber-600' : 'rounded-3xl'}`}>
                    <div className="w-36 h-36 relative rounded bg-[#100B11] flex items-center justify-center overflow-hidden">
                      {/* Pixels Character Portrait Vector Representation */}
                      <svg viewBox="0 0 64 64" className="w-full h-full pixelated">
                        <rect x="0" y="0" width="64" height="64" fill="#180C14" />
                        <rect x="16" y="18" width="32" height="30" fill="#DFC2B2" />
                        <path d="M12 18 L16 10 L24 18 L32 10 L40 18 L48 10 L52 18 Z" fill="#2E1C0C" />
                        <rect x="22" y="26" width="4" height="4" fill="#0E080F" />
                        <rect x="38" y="26" width="4" height="4" fill="#0E080F" />
                        <rect x="18" y="24" width="12" height="6" fill="none" stroke="#FFC03D" strokeWidth="2.2" />
                        <rect x="34" y="24" width="12" height="6" fill="none" stroke="#FFC03D" strokeWidth="2.2" />
                        <rect x="30" y="26" width="4" height="2" fill="#FFC03D" />
                        <rect x="28" y="38" width="8" height="2" fill="#9B2C2C" />
                        <rect x="10" y="48" width="44" height="16" fill="#2E4C7E" />
                        <rect x="25" y="48" width="14" height="5" fill="#FDF6E2" />
                      </svg>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-1 ${isRpg ? 'font-game text-emerald-400' : 'text-white'}`}>
                    Emmanuel Nixon
                  </h3>
                  <p className="text-[#FFC03D] text-[10px] font-mono tracking-widest uppercase mb-4">
                    Digital Marketing & Web Dev
                  </p>

                  <div className={`w-full p-4 rounded-xl text-left ${isRpg ? 'bg-[#2E1810] border-2 border-cozy-wood/60' : 'bg-zinc-800/50 border border-zinc-800'}`}>
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-zinc-300 font-mono">
                      <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
                      HQ CO-ORDINATES
                    </div>
                    <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                      🟢 Remote Hub: Jakarta, ID <br />
                      🟢 Status: Open to joint ventures, audit contracts & digital marketing consultations.
                    </p>
                  </div>
                </div>

                {/* Narrative Profile sheet description */}
                <div className="md:col-span-8 space-y-5 text-left">
                  <div className={`p-5 rounded-2xl ${isRpg ? 'bg-[#0E0604] border border-cozy-wood/40' : 'bg-zinc-950/30 border border-zinc-800/40'}`}>
                    <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${isRpg ? 'text-cozy-gold uppercase font-mono' : 'text-indigo-400'}`}>
                      <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                      THE COGNITIVE CONVERSION ARCHITECT
                    </h4>
                    <p className={bodyFontClass}>
                      I am Emmanuel Nixon Siagian, a specialized digital asset engineer focusing strictly on the interface overlap where code styling meets customer acquisition metrics. Unlike typical developers who write structural layouts in a vacuum, I wire my pages directly to Google Analytics thresholds, low cost per acquisition indices, and Meta campaign guidelines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl ${isRpg ? 'bg-[#2D1711] border border-cozy-wood/20' : 'bg-zinc-800/30 border border-zinc-800'}`}>
                      <h5 className="text-xs font-bold text-amber-400 font-mono uppercase mb-1">Developer Execution</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Rendering highly responsive, lightweight React structures with pristine typography, 100/100 Core metrics audit readiness, and organic SEO.
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-2xl ${isRpg ? 'bg-[#2D1711] border border-cozy-wood/20' : 'bg-zinc-800/30 border border-zinc-800'}`}>
                      <h5 className="text-xs font-bold text-emerald-400 font-mono uppercase mb-1">Growth Acquisition</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Orchestrating split tests, formulating copywriting hooks, analyzing search volumes, and runningMeta campaigns to raise client return on ad spend (ROAS).
                      </p>
                    </div>
                  </div>

                  <blockquote className="border-l-4 border-[#FFC03D] pl-4 py-1.5 italic bg-[#FFC03D]/5 text-zinc-300 text-xs font-mono">
                    "I believe interface design acts either as a vector of growth or as conversion friction. My goal is to build layouts that hold attention and trigger actions."
                  </blockquote>
                </div>

              </div>
            )}

            {/* 2. PROJECTS SECTION: RETRO PORTFOLIO COMPUTER SIMULATOR OS */}
            {section === "projects" && (
              <div className="w-full">
                
                {/* BOOTING SEQUENCE SIMULATOR DISPLAY */}
                {!isOsBooted ? (
                  <div className="h-[50vh] bg-black text-[#10B981] font-mono p-6 rounded-lg text-left flex flex-col justify-between crt border-2 border-zinc-800">
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <p className="text-zinc-500 animate-pulse">&gt; POWERING UP DESK MAIN SYSTEMS MODEL 2026...</p>
                      <p>&gt; BIOS REVISION GATEWAY OK.</p>
                      <p>&gt; EMM_NIXON_OS STACK DETECTED AND ENGAGING...</p>
                      <p>&gt; MOUNTING: PROJECTS REPOSITORY [/var/www/alcho-foods, /var/www/funnels]</p>
                      <p>&gt; REGISTERING COZY INTERACTIVE ASSET NODES...</p>
                      {bootProgress > 40 && <p className="text-[#FFC03D]">&gt; HACK EXTRAS COMPASS TERMINAL ENABLED...</p>}
                      {bootProgress > 80 && <p className="text-sky-400">&gt; COMPILING COZY GRAPHICS MEMORY MATRIX CODES...</p>}
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase">
                        <span>Loading Bios Registers</span>
                        <span>{bootProgress}%</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <div className="h-full bg-[#10B981] transition-all duration-100" style={{ width: `${bootProgress}%` }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  
                  /* REALISTIC OPERATING SYSTEM ENVIRONMENT SHELL */
                  <div className="w-full h-full bg-[#1C1425] border-4 border-zinc-950 p-3 sm:p-5 text-left text-[#FDF6E2] font-mono relative overflow-hidden rounded shadow-inner" style={{ backgroundImage: "radial-gradient(#291C36 1.5px, transparent 1.5px)", backgroundSize: "16px 16px" }}>
                    
                    {/* Status Taskbar indicator */}
                    <div className="p-2.5 bg-zinc-950 rounded border-2 border-zinc-800 flex justify-between items-center text-[10px] uppercase tracking-wider mb-5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <span>System online • Desktop connected</span>
                      </div>
                      <div className="flex items-center gap-4 text-zinc-500 font-mono text-[9px]">
                        <span>COZY_OS v4.1</span>
                        <span>BAT: 100%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-5 relative z-10 min-h-[40vh]">
                      
                      {/* Left: Beautiful Grid of App Icons */}
                      <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-3.5 h-fit pb-4 border-b md:border-b-0 md:border-r border-zinc-800/80 md:pr-4">
                        
                        {/* Desktop Icon 1: Safari / Immersive Website Mockup */}
                        <button
                          onClick={() => {
                            soundEngine.playBeep(880, 0.08, "sine");
                            setOpenAppWindow("safari");
                          }}
                          className={`p-3.5 border-2 rounded flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            openAppWindow === "safari" ? "bg-[#FFC03D] text-black border-white font-bold" : "bg-black/40 hover:bg-zinc-900/60 border-zinc-800 hover:border-[#FFC03D]"
                          }`}
                        >
                          <svg className="w-7 h-7 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <span className="text-[9px] uppercase tracking-wider">Web Portal</span>
                        </button>

                        {/* Desktop Icon 2: Excel Spreadsheet campaign planner */}
                        <button
                          onClick={() => {
                            soundEngine.playBeep(880, 0.08, "sine");
                            setOpenAppWindow("excel");
                          }}
                          className={`p-3.5 border-2 rounded flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            openAppWindow === "excel" ? "bg-[#FFC03D] text-black border-white font-bold" : "bg-black/40 hover:bg-zinc-900/60 border-zinc-800 hover:border-[#FFC03D]"
                          }`}
                        >
                          <svg className="w-7 h-7 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-[9px] uppercase tracking-wider">ROI Planner</span>
                        </button>

                        {/* Desktop Icon 3: Figma Illustrator designs */}
                        <button
                          onClick={() => {
                            soundEngine.playBeep(880, 0.08, "sine");
                            setOpenAppWindow("figma");
                          }}
                          className={`p-3.5 border-2 rounded flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            openAppWindow === "figma" ? "bg-[#FFC03D] text-black border-white font-bold" : "bg-black/40 hover:bg-zinc-900/60 border-zinc-800 hover:border-[#FFC03D]"
                          }`}
                        >
                          <svg className="w-7 h-7 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[9px] uppercase tracking-wider">Figma Design</span>
                        </button>

                        {/* Desktop Icon 4: Developer command.exe line app */}
                        <button
                          onClick={() => {
                            soundEngine.playBeep(880, 0.08, "sine");
                            setOpenAppWindow("terminal");
                          }}
                          className={`p-3.5 border-2 rounded flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            openAppWindow === "terminal" ? "bg-[#FFC03D] text-black border-white font-bold" : "bg-black/40 hover:bg-zinc-900/60 border-zinc-800 hover:border-[#FFC03D]"
                          }`}
                        >
                          <svg className="w-7 h-7 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[9px] uppercase tracking-wider">Terminal CLI</span>
                        </button>

                      </div>

                      {/* Right: Dynamic Interactive Window pane container */}
                      <div className="col-span-12 md:col-span-8 flex flex-col justify-stretch">
                        
                        <AnimatePresence mode="wait">
                          {!openAppWindow ? (
                            <motion.div 
                              key="desktop-home"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="h-full flex flex-col justify-center items-center p-6 text-center text-zinc-500 border border-dashed border-zinc-800 rounded bg-[#130E1A]/40"
                            >
                              <Compass className="w-8 h-8 text-indigo-400 mb-3 animate-spin" />
                              <h4 className="text-xs uppercase tracking-widest text-[#FFC03D] font-bold">Workspace Monitor Active</h4>
                              <p className="text-[10px] max-w-sm leading-relaxed mt-1">
                                Click any app icon folder on the left panel to launch simulated mockups, Google Campaign planners, vector branding systems, or terminal debug codes.
                              </p>
                            </motion.div>
                          ) : (
                            
                            /* ACTIVE FLOATING APP WINDOW */
                            <motion.div
                              key={openAppWindow}
                              initial={{ opacity: 0, scale: 0.95, y: 15 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 15 }}
                              className="bg-black/85 border-2 border-zinc-850 p-4 h-full flex flex-col justify-between text-left rounded shadow-2xl relative"
                            >
                              
                              {/* Window Top Controls Header */}
                              <div className="flex justify-between items-center pb-2 border-b border-zinc-900 mb-3 text-[9px] uppercase font-bold text-[#FFC03D]">
                                <span>&gt;_{openAppWindow}.exe</span>
                                <button 
                                  onClick={() => setOpenAppWindow(null)}
                                  className="text-zinc-650 hover:text-[#FFC03D] border border-zinc-800 hover:border-[#FFC03D] px-1 bg-zinc-900 cursor-pointer"
                                >
                                  CLOSE [X]
                                </button>
                              </div>

                              {/* APP INTERACTIVE VIEWPORT 1: SAFARI WEB BROWSER MOCKUP */}
                              {openAppWindow === "safari" && (
                                <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                                  <div className="bg-zinc-900 border border-zinc-850 rounded p-3 text-[10px] space-y-2.5">
                                    <div className="flex items-center justify-between text-[#FFC03D]">
                                      <span className="font-extrabold">&gt;_ ALCHO FOODS (CATALOG DISCOVERY)</span>
                                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 font-bold">1.2s Load time</span>
                                    </div>
                                    <p className="text-[9.5px] text-zinc-400 leading-normal">
                                      A premium custom product catalog boutique designed for specialized juices. Formulated with complex vector checkouts, color fluid filters and custom Audio synthesis.
                                    </p>
                                    <div className="grid grid-cols-3 gap-2.5 text-[8.5px] text-zinc-200">
                                      <div className="bg-zinc-950 p-2 border border-zinc-805 text-center rounded">
                                        <span className="block font-bold">Elder Rose</span>
                                        <span className="block text-[#FFC03D] mt-0.5">$11.50</span>
                                      </div>
                                      <div className="bg-zinc-950 p-2 border border-zinc-850 text-center rounded">
                                        <span className="block font-bold">Ginger Amiel</span>
                                        <span className="block text-[#FFC03D] mt-0.5">$9.00</span>
                                      </div>
                                      <div className="bg-zinc-950 p-2 border border-emerald-500/40 text-center rounded bg-emerald-950/20">
                                        <span className="block font-semibold">Mint Tonic</span>
                                        <span className="block text-emerald-400 mt-0.5">SELECTED</span>
                                      </div>
                                    </div>
                                    <p className="text-[8.5px] font-bold text-emerald-400">&gt; OUTCOME: +42% Conversion Rates &amp; Perfect Pagespeed Audit scores.</p>
                                    
                                    <button 
                                      onClick={() => {
                                        soundEngine.playBeep(880, 0.12, "sine");
                                        window.dispatchEvent(new CustomEvent("trigger-cinema", { detail: "alcho-foods" }));
                                      }}
                                      className="w-full mt-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold uppercase rounded text-[7.5px] tracking-wider cursor-pointer transition-colors active:translate-y-0.5"
                                    >
                                      🎬 LAUNCH IMMERSIVE 3D CINEMA SIMULATOR
                                    </button>
                                  </div>
 
                                  <div className="bg-zinc-900 border border-zinc-850 rounded p-3 text-[10px] space-y-2">
                                    <div className="flex items-center justify-between text-[#FFC03D]">
                                      <span className="font-bold">&gt;_ ACQUISITION LANDERS FLEET</span>
                                      <span className="text-[8px] text-zinc-500">Perfect 100 Audit</span>
                                    </div>
                                    <p className="text-[9.5px] text-zinc-400 leading-normal">
                                      A fleet of lightweight, accessibility compliant landing pages designed for high conversion volume capture during traffic peaks.
                                    </p>
                                    <p className="text-[8.5px] font-bold text-emerald-400">&gt; OUTCOME: 24.6% Average Leads Capture Index &amp; 99 Mobile PageSpeed.</p>
                                    
                                    <button 
                                      onClick={() => {
                                        soundEngine.playBeep(880, 0.12, "sine");
                                        window.dispatchEvent(new CustomEvent("trigger-cinema", { detail: "landing-pages" }));
                                      }}
                                      className="w-full mt-1.5 py-1.5 bg-indigo-650 hover:bg-indigo-500 text-white font-mono font-bold uppercase rounded text-[7.5px] tracking-wider cursor-pointer transition-colors active:translate-y-0.5"
                                    >
                                      🎬 LAUNCH IMMERSIVE 3D CINEMA SIMULATOR
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* APP INTERACTIVE VIEWPORT 2: EXCEL SPREADSHEET ROI ANALYTICS */}
                              {openAppWindow === "excel" && (
                                <div className="space-y-3.5 flex-1">
                                  <div className="bg-zinc-950 p-2 text-[8px] text-zinc-500 uppercase flex justify-between border border-zinc-900">
                                    <span>Workspace: Campaign_ROAS_Audit.xls</span>
                                    <span className="text-[#FFC03D]">ROAS multiplier: 3.8x</span>
                                  </div>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-[9px] text-zinc-400 border-collapse">
                                      <thead>
                                        <tr className="bg-zinc-900 border-b border-zinc-800 text-[#FFC03D]">
                                          <th className="p-1 border border-zinc-800 text-left font-bold">CHANNEL</th>
                                          <th className="p-1 border border-zinc-800 text-right font-bold">AD SPEND</th>
                                          <th className="p-1 border border-zinc-800 text-right font-bold">REACH</th>
                                          <th className="p-1 border border-zinc-800 text-right font-bold">CONV</th>
                                          <th className="p-1 border border-zinc-800 text-right font-bold">ROAS VALUE</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border-b border-zinc-850">
                                          <td className="p-1 border border-zinc-850">Meta Ads</td>
                                          <td className="p-1 border border-zinc-850 text-right">$8,500</td>
                                          <td className="p-1 border border-zinc-850 text-right">120,000</td>
                                          <td className="p-1 border border-zinc-850 text-right">1,620</td>
                                          <td className="p-1 border border-zinc-850 text-right text-emerald-400">4.1x</td>
                                        </tr>
                                        <tr className="border-b border-zinc-850">
                                          <td className="p-1 border border-zinc-850">Google Search</td>
                                          <td className="p-1 border border-zinc-850">Google Ads</td>
                                          <td className="p-1 border border-zinc-850 text-right">$6,500</td>
                                          <td className="p-1 border border-zinc-850 text-right">30,000</td>
                                          <td className="p-1 border border-zinc-850 text-right">790</td>
                                          <td className="p-1 border border-zinc-850 text-right text-emerald-400">3.4x</td>
                                        </tr>
                                        <tr className="bg-emerald-950/20 font-bold border-b border-zinc-800">
                                          <td className="p-1 border border-zinc-800 text-white">TOTALS</td>
                                          <td className="p-1 border border-zinc-800 text-right text-white">$15,000</td>
                                          <td className="p-1 border border-zinc-800 text-right text-white">150,000</td>
                                          <td className="p-1 border border-zinc-800 text-right text-emerald-400">2,410</td>
                                          <td className="p-1 border border-zinc-800 text-right text-[#FFC03D]">3.8x COMB</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <p className="text-[9px] text-zinc-400 leading-normal">
                                    &gt; Technical Highlight: Lead tracking is fully anchored in GA4, Google Tag Manager event triggers, and pixel conversions, reducing tracking leaks by 94%.
                                  </p>
                                </div>
                              )}

                              {/* APP INTERACTIVE VIEWPORT 3: BRAND DESIGN GUIDELINE MOCK */}
                              {openAppWindow === "figma" && (
                                <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                                  <div className="bg-zinc-950 rounded border border-zinc-850 p-3 text-[10px] space-y-3">
                                    <div className="flex justify-between items-center text-[#FFC03D]">
                                      <span>&gt;_ TYPOGRAPHY SYSTEM</span>
                                      <span className="text-[7.5px] text-zinc-500">OAK COZY BRAND</span>
                                    </div>
                                    <div className="space-y-1.5 border-l-2 border-[#FFC03D] pl-3">
                                      <p className="text-sm font-bold text-white">Space Grotesk</p>
                                      <p className="text-[8.5px] text-zinc-400">Primary headings font representation. Swiss-style bold modern, high information density.</p>
                                      <p className="text-xs font-mono text-zinc-300">JetBrains Mono</p>
                                      <p className="text-[8.5px] text-zinc-400">Technical data labels, achievements, numbers.</p>
                                    </div>
                                  </div>

                                  <div className="bg-zinc-950 rounded border border-zinc-850 p-3 text-[10px] space-y-2">
                                    <span className="block text-[#FFC03D] font-bold">&gt;_ COLOR MATRIX</span>
                                    <div className="grid grid-cols-4 gap-2.5">
                                      <div className="flex flex-col items-center">
                                        <div className="w-5 h-5 rounded-full bg-[#1E1218] border border-white/20" />
                                        <span className="text-[7px] text-zinc-500 mt-1">#1E1218</span>
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <div className="w-5 h-5 rounded-full bg-[#8B5A2B] border border-white/20" />
                                        <span className="text-[7px] text-zinc-500 mt-1">#8B5A2B</span>
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <div className="w-5 h-5 rounded-full bg-[#FFC03D] border border-white/20" />
                                        <span className="text-[7px] text-zinc-500 mt-1">#FFC03D</span>
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <div className="w-5 h-5 rounded-full bg-[#305F41] border border-white/20" />
                                        <span className="text-[7px] text-zinc-500 mt-1">#305F41</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* APP INTERACTIVE VIEWPORT 4: DEVELOPER CLI TERMINAL */}
                              {openAppWindow === "terminal" && (
                                <div className="space-y-3.5 flex-1 flex flex-col justify-between text-left text-xs font-mono text-[#00FF66]">
                                  <div className="bg-black/95 border border-zinc-850 p-2.5 rounded h-[20vh] overflow-y-auto space-y-1 text-[10px]">
                                    {cmdLogs.map((log, lIdx) => (
                                      <p key={lIdx}>{log}</p>
                                    ))}
                                  </div>

                                  <form onSubmit={executeTerminalCmd} className="flex gap-2.5 items-center border border-zinc-900 rounded bg-[#09050F] px-2.5 py-1.5">
                                    <span className="text-emerald-400 font-bold select-none text-[10px]">&gt;</span>
                                    <input 
                                      type="text"
                                      value={cmdInput}
                                      onChange={(e) => setCmdInput(e.target.value)}
                                      className="bg-transparent border-0 outline-none text-[10px] text-[#00FF66] font-mono flex-1 focus:ring-0 focus:outline-none"
                                      placeholder="Type 'help' and press Enter..."
                                    />
                                    <button type="submit" className="text-[8px] bg-emerald-950 border border-emerald-500 px-2 py-0.5 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:font-bold select-none cursor-pointer">
                                      RUN
                                    </button>
                                  </form>
                                </div>
                              )}

                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* 3. SKILLS SECTION */}
            {section === "skills" && (
              <SkillTreeModal />
            )}

            {/* 4. EXPERIENCE SECTION */}
            {section === "experience" && (
              <div className="space-y-6 text-left">
                {/* Header Selector Tabs */}
                <div className="flex border border-zinc-800 p-1 bg-zinc-950 rounded-2xl max-w-sm font-mono text-[10px] uppercase font-bold text-zinc-400 select-none">
                  <button
                    onClick={() => {
                      soundEngine.playBeep(600, 0.05, "sine");
                      setExperienceMode("story");
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      experienceMode === "story" 
                        ? "bg-[#FFC03D] text-black font-black" 
                        : "hover:text-white"
                    }`}
                  >
                    🚀 Interactive Story
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playBeep(600, 0.05, "sine");
                      setExperienceMode("timeline");
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      experienceMode === "timeline" 
                        ? "bg-[#FFC03D] text-black font-black" 
                        : "hover:text-white"
                    }`}
                  >
                    📜 Chrono-Timeline
                  </button>
                </div>

                {experienceMode === "story" ? (
                  /* PREMIUM 5-CHAPTER ADAPTIVE STORY WORKFLOW */
                  <div className="bg-zinc-900/10 border border-zinc-900/60 rounded-3xl p-5 space-y-4 font-mono relative overflow-hidden">
                    {/* Chapter metadata headers */}
                    <div className="flex justify-between items-center text-[10px] text-zinc-550 border-b border-zinc-900 pb-3">
                      <span className="font-bold tracking-widest text-amber-400 font-mono">
                        {(() => {
                          const chapters = [
                            "CHAPTER 1: THE BEGINNING",
                            "CHAPTER 2: MARKETING ACUMEN",
                            "CHAPTER 3: WEB CODE SPRINT",
                            "CHAPTER 4: HYBRID BLUEPRINT",
                            "CHAPTER 5: HORIZON OBSERVATORY"
                          ];
                          return chapters[activeChapter];
                        })()}
                      </span>
                      <span className="bg-zinc-900 text-zinc-400 px-2.5 py-0.5 rounded-full text-[9px] font-black">
                        {activeChapter + 1} / 5 COMPLETE
                      </span>
                    </div>

                    {/* Active story contents */}
                    {(() => {
                      const STORY_CHAPTERS = [
                        {
                          title: "The Beginning — Digital Roots",
                          period: "2020 - 2021",
                          role: "UX Design & Web Intern",
                          company: "Studio Eleven Creative",
                          badge: "🌱 Foundations",
                          desc: "Emmanuel's journey began with a deep curiosity for interaction principles. He entered Studio Eleven wireframing consumer checkouts, mapping click-heatmaps, and deploying basic HTML layouts.",
                          outcome: "Result: Mastered visual alignment, pixel-grid fidelity, and atomic structures."
                        },
                        {
                          title: "Marketing Acumen — Funnel Dynamics",
                          period: "2021 - 2023",
                          role: "Digital Marketing Specialist",
                          company: "Growth Catalyst Agency",
                          badge: "🚀 Broadened Horizons",
                          desc: "Recognizing that code is useless without conversion, Emmanuel mastered high-performance search engine marketing (SEM) and coordinate ads. He audited search metrics and Meta conversion indexes.",
                          outcome: "Result: Managed $50k+ annual creative assets budgets, netting 3.8x ROAS."
                        },
                        {
                          title: "Web Engineering — Custom Core Builds",
                          period: "2023 - 2024",
                          role: "Full-Stack React Developer",
                          company: "Freelance Innovation Labs",
                          badge: "💻 Tech-Integration",
                          desc: "Unifying layout design with speed performance metrics, Emmanuel engineered React-optimized landing pages that compile instantly to boast a documented 100/100 Core Web Vitals index.",
                          outcome: "Result: Built modular, responsive web apps carrying zero heavy tracking frameworks bloat."
                        },
                        {
                          title: "Strategic Growth — Synergic Director",
                          period: "2024 - PRESENT",
                          role: "Lead Digital Strategist & Developer",
                          company: "Independent Consultancy",
                          badge: "👑 Growth Blueprint",
                          desc: "Now acting at the perfect strategic intersection: advising startups and scaleups on how to connect robust React user interfaces with GA4 tracking metrics and Meta Business Suite APIs.",
                          outcome: "Result: Raised client acquisition metrics by an average of +35% with schema codes."
                        },
                        {
                          title: "Horizon Vision — Advanced Obs",
                          period: "2026 & BEYOND",
                          role: "Director of Technical Engineering",
                          company: "Nixon World",
                          badge: "🔭 High Orbit Future",
                          desc: "Steering towards AI-powered landing generators, mastering WebGPU, and leading scaleup products from genesis to IPO. Committed to building beautiful web environments with minimal overhead.",
                          outcome: "Result: Directing the next echelon of high-performance conversion products."
                        }
                      ];

                      const current = STORY_CHAPTERS[activeChapter];

                      return (
                        <div className="space-y-3.5 py-1.5">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                              {current.badge}
                            </span>
                            <span className="text-xs text-white font-bold">{current.title}</span>
                          </div>

                          <div className="text-[10px] text-zinc-500 font-mono space-y-1">
                            <p>Role: <span className="text-zinc-300 font-bold">{current.role}</span></p>
                            <p>Hub: <span className="text-zinc-300">{current.company}</span> | Timeline: <span className="text-zinc-300">{current.period}</span></p>
                          </div>

                          <p className="text-xs font-sans text-zinc-400 leading-relaxed pt-1.5 border-t border-zinc-900">
                            {current.desc}
                          </p>

                          <div className="bg-[#101E17]/40 border border-emerald-950/50 p-3 rounded-xl">
                            <p className="text-[10.5px] italic text-emerald-400 font-bold leading-relaxed">
                              {current.outcome}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Progress Dots Indicator */}
                    <div className="flex justify-center gap-2 py-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <button
                          key={i}
                          onClick={() => {
                            soundEngine.playBeep(440, 0.04, "sine");
                            setActiveChapter(i);
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                            activeChapter === i ? "bg-[#FFC03D] scale-125" : "bg-zinc-800 hover:bg-zinc-700"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Slider Buttons */}
                    <div className="flex justify-between items-center pt-2.5 border-t border-zinc-900 text-[10px]">
                      <button
                        disabled={activeChapter === 0}
                        onClick={() => {
                          soundEngine.playBeep(400, 0.05, "sine");
                          setActiveChapter(prev => prev - 1);
                        }}
                        className={`py-1.5 px-3 rounded-lg border font-bold cursor-pointer transition-all ${
                          activeChapter === 0 
                            ? "border-zinc-900 text-zinc-750 opacity-15 cursor-not-allowed" 
                            : "border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                        }`}
                      >
                        &larr; Prev Chapter
                      </button>

                      <button
                        onClick={() => {
                          soundEngine.playBeep(880, 0.05, "sine");
                          if (activeChapter === 4) {
                            soundEngine.playInteract();
                            setActiveChapter(0); // circular loop
                          } else {
                            setActiveChapter(prev => prev + 1);
                          }
                        }}
                        className="py-1.5 px-3 rounded-lg border border-zinc-800 hover:border-zinc-700 font-bold hover:text-white text-zinc-400 cursor-pointer"
                      >
                        {activeChapter === 4 ? "Restart Story &larr;" : "Next Chapter &rarr;"}
                      </button>
                    </div>

                  </div>
                ) : (
                  /* CLASSIC CHRONO TIMELINE TREE */
                  <div className="relative border-l-2 border-zinc-800 ml-4 pl-6 space-y-6 text-left">
                    {EXPERIENCE_DATA.map((item, idx) => (
                      <div key={item.id} className="relative">
                        
                        {/* Node marker */}
                        <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          isRpg 
                            ? 'bg-[#E8B08A] border-[#1E1218] text-black font-semibold text-[8px]'
                            : 'bg-indigo-500 border-zinc-900 text-white'
                        }`}>
                          {idx + 1}
                        </span>

                        {/* Metadata Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div>
                            <h4 className={`text-sm font-bold inline-block mr-2 ${isRpg ? 'text-cozy-gold font-mono uppercase' : 'text-white'}`}>
                              {item.role}
                            </h4>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              isRpg ? 'bg-amber-400/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-300'
                            }`}>
                              {item.company}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">
                            {item.period}
                          </span>
                        </div>

                        {/* Description info */}
                        <p className="text-[10.5px] font-mono italic text-zinc-400 mb-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Bullet elements */}
                        <ul className="space-y-1.5 ml-2 mb-3">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs text-zinc-350 flex items-start gap-1.5 leading-relaxed">
                              <span className="text-[#FFC03D] select-none mt-0.5">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pb-4">
                          {item.tags.map((tag) => (
                            <span 
                              key={tag}
                              className={`text-[8px] font-mono px-2 py-0.5 ${
                                isRpg ? 'bg-[#2E1810] border border-cozy-wood/30 text-[#FDF6E2]' : 'bg-zinc-800 text-zinc-500 rounded'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. RESUME / COZY CRT TV BROADCAST SECTION */}
            {section === "resume" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Simulated television display frame */}
                <div className="md:col-span-7">
                  
                  {tvStaticOn ? (
                    
                    /* Flickering horizontal noise static raster during power on delay */
                    <div className="h-[45vh] bg-zinc-950 border-4 border-[#3B201A] rounded-xl flex items-center justify-center relative overflow-hidden crt">
                      <div className="text-[10px] text-zinc-400 font-mono animate-pulse flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-ping inline-block" />
                        CRT COIL TUBE PRE-MAGNETIZING...
                      </div>
                    </div>
                  ) : (
                    
                    /* STUNNING COMPLETED HIGH-CONTRAST CRT MONITOR */
                    <div className="relative border-4 border-[#3B201A] bg-[#0A050B] p-4 rounded-xl crt shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] overflow-hidden">
                      <div className="space-y-3.5 relative z-10 text-left font-mono text-[10.5px] text-[#A6E3E9]">
                        <div className="flex justify-between border-b border-[#30E3CA]/20 pb-1.5 items-center">
                          <h4 className="text-[#30E3CA] text-xs font-extrabold animate-pulse">
                            &gt;_ NIXON_BROADCAST_CV.EXE
                          </h4>
                          <span className="text-[7.5px] bg-[#30E3CA]/15 text-[#30E3CA] px-1 font-bold">RF CH-04</span>
                        </div>
                        
                        <div>
                          <span className="text-zinc-500 uppercase block text-[8px] tracking-wide">Summary profile</span>
                          <p className="leading-relaxed text-[#D2E9F3]">
                            Lead digital architect bridging the critical gap between front-end web interfaces and meta ad funnels. Optimizing pages for lightning load times while structuring copy hooks to drive high ROAS metrics.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-2.5">
                          <div>
                            <span className="text-zinc-500 uppercase block text-[8px]">Primary Email</span>
                            <span className="font-bold">nixonsiagian578@gmail.com</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase block text-[8px]">Local Base</span>
                            <span className="font-bold">Jakarta, Indonesia</span>
                          </div>
                        </div>

                        <div className="border-t border-zinc-900 pt-2.5 space-y-1">
                          <span className="text-zinc-500 uppercase block text-[8px]">CORE CREDENTIAL METRICS</span>
                          <div className="flex flex-wrap gap-1">
                            <span className="bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 text-[7.5px] text-[#30E3CA]">3.8x Campaign ROAS</span>
                            <span className="bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 text-[7.5px] text-[#30E3CA]">Perfect 100 SEO indices</span>
                            <span className="bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 text-[7.5px] text-[#30E3CA]">GA4 Funnel tracking</span>
                          </div>
                        </div>
                      </div>

                      {/* Blinking raster scanlines shadow */}
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-[#30E3CA]/8 shadow-[0_0_6px_rgba(48,227,202,0.4)] animate-scanline pointer-events-none" />
                    </div>
                  )}

                </div>

                <div className="md:col-span-5 flex flex-col justify-center space-y-4 p-4 text-center">
                  <h4 className={`text-base font-bold ${isRpg ? 'text-cozy-gold' : 'text-white'}`}>
                    Acquire Professional CV
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Acquire Emmanuel Nixon's full standard offline paper resume, detailed project specifications, recommendations, and credentials to share with your business directors.
                  </p>

                  <a 
                    id="cv-download-btn"
                    href="mailto:nixonsiagian578@gmail.com?subject=Emmanuel%20Nixon%20Resume%20Request"
                    onClick={() => soundEngine.playBeep(1000, 0.15, "triangle")}
                    className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-bold transition-transform active:translate-y-0.5 cursor-pointer ${
                      isRpg 
                        ? 'bg-[#FFC03D] hover:bg-[#FFE06F] text-black border-4 border-[#1E0F0B] font-game shadow-[2px_2px_0_0_#1E1218]' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow'
                    }`}
                  >
                    <Download className="w-4.5 h-4.5" />
                    Send Dispatch Request CV Email
                  </a>

                  <p className="text-[10px] text-zinc-500 italic font-mono uppercase">
                    Automatic transmittal response instantly dispatched.
                  </p>
                </div>
              </div>
            )}

            {/* 6. CONTACT / TRANSMISSION FORM */}
            {section === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-7">
                
                {/* Form fields layout */}
                <div className="md:col-span-7">
                  <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#FFC03D] block mb-1 font-bold">Sender Name</label>
                      <input 
                        required
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className={`w-full text-xs p-3 focus:outline-none ${
                          isRpg 
                            ? 'bg-[#120609] border-2 border-cozy-wood/65 focus:border-[#FFC03D] text-white font-mono' 
                            : 'bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-1 focus:ring-pink-500'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#FFC03D] block mb-1 font-bold">Return Address / Email</label>
                      <input 
                        required
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className={`w-full text-xs p-3 focus:outline-none ${
                          isRpg 
                            ? 'bg-[#120609] border-2 border-cozy-wood/65 focus:border-[#FFC03D] text-white font-mono' 
                            : 'bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-1 focus:ring-pink-500'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#FFC03D] block mb-1 font-bold">Signal Message Payload</label>
                      <textarea 
                        required
                        rows={4}
                        value={formState.msg}
                        onChange={(e) => setFormState({ ...formState, msg: e.target.value })}
                        className={`w-full text-xs p-3 focus:outline-none ${
                          isRpg 
                            ? 'bg-[#120609] border-2 border-cozy-wood/65 focus:border-[#FFC03D] text-white font-mono' 
                            : 'bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:ring-1 focus:ring-pink-500'
                        }`}
                        placeholder="Hi Emmanuel! I'd love to collaborate on a digital campaign revamp or web portal construction..."
                      />
                    </div>

                    {formSent ? (
                      <div className="py-3 px-4 text-xs font-bold text-center bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg font-mono">
                        ✉️ BROADCAST ACQUIRED! Message transmitted successfully acrossJakarta servers.
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className={`w-full py-3.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                          isRpg 
                            ? 'bg-pink-650 hover:bg-pink-600 border-4 border-black font-game text-white shadow-[2px_2px_0_0_#1E1218] active:translate-y-0.5' 
                            : 'bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-display font-medium'
                        }`}
                      >
                        <Send className="w-4 h-4 animate-bounce" />
                        TRANSMIT SIGNAL Payload
                      </button>
                    )}
                  </form>
                </div>

                {/* Social media connections info */}
                <div className="md:col-span-5 flex flex-col justify-between text-left">
                  <div className={`p-4 rounded-xl space-y-4 ${isRpg ? 'bg-[#2D1612] border border-cozy-wood/30' : 'bg-zinc-800/20 border border-zinc-800'}`}>
                    <h5 className={`text-xs font-bold ${isRpg ? 'text-[#FFC03D] font-mono' : 'text-white'}`}>
                      Primary Mailbox
                    </h5>
                    
                    <button
                      id="copy-email-box"
                      onClick={handleEmailCopy}
                      className={`w-full p-3 text-xs text-left font-mono border flex items-center justify-between transition-all cursor-pointer ${
                        isRpg 
                          ? 'bg-[#1A0B09] border-cozy-wood/35 hover:bg-[#3C1E19] text-white' 
                          : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-indigo-400 rounded-xl'
                      }`}
                      title="Copy email back to clipboard"
                    >
                      <span className="truncate">nixonsiagian578@gmail.com</span>
                      <span className="text-[10px] text-pink-400 shrink-0 select-none ml-2 font-bold hover:underline">
                        {copiedEmail ? "COPIED" : "COPY"}
                      </span>
                    </button>

                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                      Whether you're looking to audits existing checkout funnels, consult on upcoming Google Ads configurations, or implement complex TypeScript web portal builds, let's connect!
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-850">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block mb-2 font-bold">
                      External Relays
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <a 
                        target="_blank"
                        rel="noreferrer"
                        href="https://linkedin.com"
                        className={`p-2 border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isRpg 
                            ? 'bg-[#170E20] hover:bg-[#251A30] border-indigo-500/40 text-[#FDF6E2]' 
                            : 'bg-zinc-800/30 hover:bg-zinc-800 border-zinc-800 text-zinc-300 rounded-lg'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        LinkedIn
                      </a>
                      <a 
                        target="_blank"
                        rel="noreferrer"
                        href="https://github.com"
                        className={`p-2 border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isRpg 
                            ? 'bg-[#0E1520] hover:bg-[#152030] border-sky-500/40 text-[#FDF6E2]' 
                            : 'bg-zinc-800/30 hover:bg-zinc-800 border-zinc-800 text-zinc-300 rounded-lg'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 7. IMMERSIVE DECOR DISCOVERIES */}
            {section?.startsWith("decor_") && (
              <DecorModalContent id={section.replace("decor_", "")} />
            )}

          </div>

          {/* Dialog Footnote */}
          <div className={`mt-6 pt-3 text-center border-t text-[10px] font-mono text-zinc-500 flex justify-between items-center ${
            isRpg ? 'border-[#3D1E1A]' : 'border-zinc-800'
          }`}>
            <span>PORTFOLIO_OWNER: EMMANUEL NIXON</span>
            <span className="flex items-center gap-1">
              Built with React &amp; Framer Motion <Heart className="w-3 h-3 text-rose-500" />
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { 
  Volume2, VolumeX, Gamepad2, Compass, Sparkles, MessageSquare,
  Laptop, BookOpen, Clock, Heart, Move, Music, HelpCircle, ArrowRight, ArrowDown, ExternalLink, Mail, CheckCircle, Award, Layout, Zap, Flame, Trophy, HelpCircle as HelpIcon, ShieldAlert, X
} from "lucide-react";
import { soundEngine } from "./audio";
import { RetroGameMap } from "./components/RetroGameMap";
import { CinematicTour } from "./components/CinematicTour";
import { PortfolioModals, PROJECTS_DATA } from "./components/PortfolioModals";
import { MobileVirtualControls } from "./components/MobileVirtualControls";

// Immersive HUD Additions imports
import { NixonTerminal } from "./components/NixonTerminal";
import { AchievementBook } from "./components/AchievementBook";
import { FastTravelMap } from "./components/FastTravelMap";
import { ProjectShowcaseCinema } from "./components/ProjectShowcaseCinema";

// Dynamic Count Up Utility Component
export function CountUp({ end, suffix = "", prefix = "", duration = 1500 }: { end: number, suffix?: string, prefix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing: easeOutQuad
      const easedProgress = progress * (2 - progress);
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animationId = requestAnimationFrame(animate);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [end, duration]);

  return <span ref={ref} className="font-mono text-2xl sm:text-4xl font-extrabold text-[#FFC03D]">{prefix}{count}{suffix}</span>;
}

export default function App() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [soundFXOn, setSoundFXOn] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Day/Night and Weather states (Supports 4 cycles: morning, afternoon, golden-hour, night)
  const [timeMode, setTimeMode] = useState<"morning" | "afternoon" | "golden-hour" | "night">("night");
  const [weatherMode, setWeatherMode] = useState<"sunny" | "rainy" | "cloudy" | "foggy">("sunny");
  const [showMobileAtmosphere, setShowMobileAtmosphere] = useState(false);

  // Portfolio Quest tracker state
  const [completedQuests, setCompletedQuests] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("emmanuel_nixon_quests");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Nixon AI Assistant NPC Chat System
  const [showNixonAI, setShowNixonAI] = useState(false);
  const [nixonMessage, setNixonMessage] = useState("Hi! I'm Nixon AI, Emmanuel's interactive workspace avatar. I can guide you to explore different areas, show stats, or boot the laptop OS!");
  const [nixonOptions, setNixonOptions] = useState([
    { label: "💻 Boot Laptop OS (Projects)", action: "projects" },
    { label: "🛠️ View Skills Bookshelf", action: "skills" },
    { label: "📜 Read Experience Timeline", action: "experience" },
    { label: "📺 Power on TV (Resume)", action: "resume" },
    { label: "⚡ Help, how do I move?", action: "controls" }
  ]);

  // Achievement tracker
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("emmanuel_nixon_achievements");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastNotification, setToastNotification] = useState<{ id: string; title: string; desc: string } | null>(null);
  const [nearbyObjFromGame, setNearbyObjFromGame] = useState<any | null>(null);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);

  // Immersive HUD panels triggering states
  const [showTerminal, setShowTerminal] = useState(false);
  const [showTravelMap, setShowTravelMap] = useState(false);
  const [showAchievementBook, setShowAchievementBook] = useState(false);
  const [activeCinemaProject, setActiveCinemaProject] = useState<any | null>(null);
  const [discoveredSectors, setDiscoveredSectors] = useState<string[]>(["workspace"]);
  const [teleportTarget, setTeleportTarget] = useState<{ x: number; y: number } | null>(null);

  // Mouse trajectory for ambient parallax glow (Awwwards design)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax Scroll Tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Framer Motion spring transforms for inertia-driven scroll effects
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  // Transforms for speed-layer independent parallax depth
  const bgTranslateY = useTransform(smoothProgress, [0, 1], [0, -320]);     // Background (0.2x speed)
  const glowTranslateY = useTransform(smoothProgress, [0, 1], [0, -220]);   // Custom Gradient (0.3x)
  const particleTranslateY = useTransform(smoothProgress, [0, 1], [0, -120]);// Particles (0.5x)
  const decoTranslateY = useTransform(smoothProgress, [0, 1], [0, -60]);     // Decorative (0.7x)
  const contentTranslateY = useTransform(smoothProgress, [0, 1], [0, 0]);   // Content (1x)
  const foreTranslateY = useTransform(smoothProgress, [0, 1], [0, 45]);      // Foreground elements (1.2x)

  // Zoom factor mapping representing the "LIVE GAME TRAILER" scroll zoom
  const trailerZoom = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [1.1, 1.4, 1.8, 1.5, 1.25]);
  const trailerPanX = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [320, 240, 120, 480, 320]);
  const trailerPanY = useTransform(smoothProgress, [0, 0.25, 0.5, 0.75, 1], [210, 190, 120, 200, 210]);

  // Handle system day & night based on browser hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setTimeMode("morning");
    } else {
      setTimeMode("night");
    }

    // Set a random weather setting on load
    const options: ("sunny" | "rainy" | "cloudy" | "foggy")[] = ["sunny", "rainy", "cloudy", "foggy"];
    const randomWeather = options[Math.floor(Math.random() * options.length)];
    setWeatherMode(randomWeather);

    const handleTouch = () => {
      setIsTouchDevice(true);
    };
    window.addEventListener("touchstart", handleTouch, { once: true });

    // HTML5 native fullscreen change triggers
    const handleFullscreenChange = () => {
      setIsFullscreenActive(
        !!(document.fullscreenElement || 
           (document as any).webkitFullscreenElement || 
           (document as any).mozFullScreenElement || 
           (document as any).msFullscreenElement)
      );
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Track mouse coordinates for interactive glow tilting
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 25;
      const y = (e.clientY - innerHeight / 2) / 25;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic cinema cinematic triggers listener
    const handleTriggerCinema = (e: any) => {
      const projId = e.detail;
      const proj = PROJECTS_DATA.find(p => p.id === projId);
      if (proj) {
        setActiveModal(null);
        setActiveCinemaProject(proj);
      }
    };
    window.addEventListener("trigger-cinema", handleTriggerCinema);

    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("trigger-cinema", handleTriggerCinema);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Unlock achievement notifier
  const triggerAchievementUnlock = (id: string, title: string, desc: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("emmanuel_nixon_achievements", JSON.stringify(updated));

      // Play joyful retro notification chord
      soundEngine.playBeep(523.25, 0.1, "sine");
      setTimeout(() => soundEngine.playBeep(659.25, 0.1, "triangle"), 80);
      setTimeout(() => soundEngine.playBeep(783.99, 0.12, "sine"), 160);
      setTimeout(() => soundEngine.playBeep(1046.50, 0.25, "triangle"), 240);

      // Show floating glassmorphism popup toast
      setToastNotification({ id, title, desc });
      setTimeout(() => {
        setToastNotification(null);
      }, 5000);

      return updated;
    });
  };

  // Sync Audio engine with toolbar status
  const toggleSoundFX = () => {
    const nextVal = !soundFXOn;
    setSoundFXOn(nextVal);
    soundEngine.setSoundFXEnabled(nextVal);
    if (nextVal) {
      soundEngine.playBeep(880, 0.08, "sine");
    }
  };

  const toggleMusic = () => {
    if (musicOn) {
      soundEngine.stopAmbientMusic();
      setMusicOn(false);
    } else {
      soundEngine.startAmbientMusic();
      setMusicOn(true);
      soundEngine.playBeep(659.25, 0.15, "triangle");
      triggerAchievementUnlock("music", "🎧 Symphonist", "Tuned into high-fidelity custom lofi background soundtrack.");
    }
  };

  // Portfolio Quest completion tracker logic
  const markQuestComplete = (key: string) => {
    const validQuests = ["about", "resume", "projects", "experience", "contact"];
    if (!validQuests.includes(key)) return;

    setCompletedQuests((prev) => {
      if (prev.includes(key)) return prev;
      const updated = [...prev, key];
      localStorage.setItem("emmanuel_nixon_quests", JSON.stringify(updated));

      // Play soft positive achievement notification beep
      soundEngine.playBeep(659.25, 0.08, "triangle");
      setTimeout(() => soundEngine.playBeep(880, 0.1, "sine"), 65);

      if (updated.length === 5) {
        setTimeout(() => {
          triggerAchievementUnlock(
            "quest_champion",
            "🏆 Portfolio Quest Champion",
            "Discovered every chamber within Emmanuel Nixon Siagian's world. Outstanding explorer!"
          );
        }, 1100);
      }
      return updated;
    });
  };

  const openSectionWithQuest = (sect: typeof activeModal) => {
    setActiveModal(sect);
    if (sect) {
      markQuestComplete(sect);
    }
  };

  // Fullscreen helper operations
  const requestDocumentFullscreen = () => {
    const docEl = document.documentElement;
    try {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).msRequestFullscreen) {
        (docEl as any).msRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request disallowed or blocked by workspace iframe context.", err);
    }
  };

  const exitDocumentFullscreen = () => {
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen exit aborted.", err);
    }
  };

  // Big CTA game entry trigger with high-class immersive visual zoom sequences
  const handleLaunchGame = () => {
    setConsoleLines([]);
    soundEngine.playInteract();
    setIsLaunching(true);
    
    // Play retro synthesizer rising frequency wave sequence
    let currentFreq = 220;
    const soundInterval = setInterval(() => {
      currentFreq += 70;
      soundEngine.playBeep(currentFreq, 0.035, "sine");
      if (currentFreq >= 990) {
        clearInterval(soundInterval);
      }
    }, 40);

    // Request full screen
    requestDocumentFullscreen();

    // Cinematic console typewriter outputs sequential stack
    const sequenceLines = [
      "Initializing Nixon World...",
      "Loading Career Journey...",
      "Loading Projects...",
      "Loading Interactive Experience...",
      "Welcome, Explorer. Proceeding to active chamber."
    ];

    sequenceLines.forEach((text, index) => {
      setTimeout(() => {
        setConsoleLines(prev => [...prev, `> ${text}`]);
        soundEngine.playBeep(523.25 + (index * 85), 0.04, "square");
      }, 350 * index);
    });

    setTimeout(() => {
      setIsGameActive(true);
      setIsLaunching(false);
      triggerAchievementUnlock("entered", "✓ Welcome Workspace Traveler", "Entered the fully active 2.5D portfolio playroom chamber.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 350 * sequenceLines.length + 420);
  };

  const handleExitGame = () => {
    soundEngine.playClose();
    setIsExiting(true);
    exitDocumentFullscreen();

    // Play retro drop synthesizer sequence
    let currentFreq = 880;
    const interval = setInterval(() => {
      currentFreq -= 75;
      soundEngine.playBeep(currentFreq, 0.04, "triangle");
      if (currentFreq <= 220) {
        clearInterval(interval);
      }
    }, 40);

    setTimeout(() => {
      setIsGameActive(false);
      setIsExiting(false);
    }, 950);
  };

  // Nixon NPC interaction option routing
  const handleNixonAction = (action: string) => {
    soundEngine.playBeep(700, 0.05, "sine");
    if (action === "projects") {
      setNixonMessage("Brilliant! Opening the custom simulated operating system shell on the desk's laptop. Accessing projects repository...");
      setTimeout(() => {
        openSectionWithQuest("projects");
        triggerAchievementUnlock("desktop_os", "💻 Cyber Hacker", "Unlocked and booted the retro Portfolio OS desktop mockup simulator!");
      }, 800);
    } else if (action === "skills") {
      setNixonMessage("Browsing the golden bookshelf parameters! Opening skills dossier detailing react packages, GA4 tracking and brand layout systems.");
      setTimeout(() => {
        openSectionWithQuest("skills");
      }, 800);
    } else if (action === "experience") {
      setNixonMessage("Taking down framed employment awards dossiers. Opening career timeline level checklist.");
      setTimeout(() => {
        openSectionWithQuest("experience");
      }, 800);
    } else if (action === "resume") {
      setNixonMessage("Re-routing cathode signals. Powering on the cozy CRT Television set to scan CV details.");
      setTimeout(() => {
        openSectionWithQuest("resume");
      }, 800);
    } else if (action === "controls") {
      setNixonMessage("To explore the chamber manually, expand into FULL active mode, press WASD or Arrow Keys, and get near items to click. Try custom Day/Night and Weather buttons!");
    }
  };

  // secret potted plant clicked
  const [plantClicks, setPlantClicks] = useState(0);
  const handleSecretPlantClick = () => {
    const nextVal = plantClicks + 1;
    setPlantClicks(nextVal);
    soundEngine.playBeep(440 + nextVal * 120, 0.06, "triangle");

    if (nextVal >= 5) {
      triggerAchievementUnlock("botanist", "🌱 Botanist Explorer", "Discovered the potted plant cozy secret easter egg! Developer Mode Unlocked.");
      setNixonMessage("AHA! You tapped the cozy potted plant 5 times! You have unlocked Secret Developer Hack Mode. A bonus matrix terminal command app is now loading inside the Laptop OS!");
    }
  };

  return (
    <div ref={containerRef} id="app-root-container" className="min-h-screen relative bg-[#060408] text-[#FDF6E2] selection:bg-rose-500/30 overflow-x-hidden">
      
      {/* 1. SEAMLESS DEEP PARALLAX CLOUD & GRADIENT LAYERS */}
      <div className="absolute inset-x-0 top-0 h-[1700px] pointer-events-none overflow-hidden z-0">
        
        {/* Parallax Background Layer - Soft Dark Grid Pattern (0.2x speed) */}
        <motion.div 
          style={{ y: bgTranslateY }}
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"
        />

        {/* Parallax Gradient Layer - Glimmering cosmic lighting orbs (0.3x speed) */}
        <motion.div 
          style={{ y: glowTranslateY }}
          className="absolute inset-x-0 top-0 h-[800px] bg-[radial-gradient(ellipse_at_30%_15%,rgba(139,92,246,0.1)_0%,transparent_55%),radial-gradient(ellipse_at_80%_45%,rgba(244,63,94,0.08)_0%,transparent_50%)]"
        />

        {/* Parallax Particles Layer - Slow Floating Cyber Dust Circles (0.5x speed) */}
        <motion.div 
          style={{ y: particleTranslateY }}
          className="absolute top-[8%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px]"
        />
        <motion.div 
          style={{ y: particleTranslateY }}
          className="absolute top-[35%] right-[5%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[140px]"
        />

        {/* Parallax Decorative Frame Layer (0.7x speed) */}
        <motion.div 
          style={{ y: decoTranslateY }}
          className="absolute top-[20%] left-12 w-2 h-24 bg-gradient-to-b from-purple-500/30 to-transparent hidden md:block"
        />
        <motion.div 
          style={{ y: decoTranslateY }}
          className="absolute top-[28%] right-12 w-24 h-0.5 bg-gradient-to-r from-transparent to-rose-500/30 hidden md:block"
        />
      </div>

      {/* STICKY LUXURY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-900/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div 
          onClick={handleExitGame}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Animated Interactive Crystal Jewel Shield */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC03D] via-rose-500 to-indigo-500 p-[1.5px] shadow-[0_0_15px_rgba(255,192,61,0.25)] flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:rotate-12">
            <div className="w-full h-full bg-[#0E0B10] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-[#FFC03D] animate-pulse" />
            </div>
          </div>
          <div className="text-left leading-none">
            <span className="font-display text-base font-bold tracking-tight text-white group-hover:text-[#FFC03D] duration-200">
              Emmanuel Nixon
            </span>
            <span className="text-[9px] uppercase font-mono tracking-widest block text-zinc-500 mt-1">
              UX Strategist & Digital Marketer
            </span>
          </div>
        </div>

        {/* HUD control bar toolbar elements */}
        <div className="flex items-center gap-2">
          
          {/* Sound click feedback activation button */}
          <button
            id="global-sound-fx-btn"
            onClick={toggleSoundFX}
            className={`p-2 cursor-pointer transition-all active:scale-95 rounded-lg border flex items-center justify-center ${
              soundFXOn 
                ? "bg-zinc-900/70 border-zinc-800 text-[#FFC03D] hover:text-[#FFDF4F] hover:border-zinc-700" 
                : "bg-zinc-950 border-zinc-950 text-zinc-600 hover:text-zinc-500"
            }`}
            title={soundFXOn ? "Mute sound feedbacks" : "Unmute sound feedbacks"}
          >
            {soundFXOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Meditative background custom loop soundtrack button */}
          <button
            id="global-cozy-music-btn"
            onClick={toggleMusic}
            className={`px-3 py-2 cursor-pointer transition-all active:scale-95 rounded-lg border-2 flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-wider font-extrabold ${
              musicOn 
                ? "bg-emerald-950/30 border-emerald-500 text-emerald-400 hover:border-emerald-400" 
                : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
            title="Toggle procedural synthesizer lofi loop music"
          >
            <Music className={`w-3.5 h-3.5 ${musicOn ? "animate-bounce text-emerald-400" : "text-zinc-500"}`} />
            <span className="hidden sm:inline">Cozy Ambiance</span>
          </button>

          {isGameActive && (
            <button
              id="exit-game-nav-btn"
              onClick={handleExitGame}
              className="bg-indigo-650 hover:bg-indigo-600 text-white font-sans font-medium text-xs px-3.5 py-2 tracking-wide rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_4px_10px_rgba(79,70,229,0.3)] hover:scale-[1.03] active:scale-95"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Scroll Dossier</span>
            </button>
          )}

        </div>
      </header>

      {/* FLOATING SUCCESS AND TROPHY ACHIEVEMENT NOTIFICATION BAR */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-4 sm:right-8 z-50 w-full max-w-sm p-4 bg-zinc-950/90 border-2 border-[#FFC03D] rounded-xl shadow-[0_15px_40px_rgba(255,192,61,0.15)] backdrop-blur-xl flex items-start gap-3.5 pointer-events-auto"
          >
            <div className="w-10 h-10 shrink-0 bg-yellow-500/15 border border-[#FFC03D] rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#FFC03D] animate-bounce" />
            </div>
            <div className="text-left flex-1 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#FFC03D] font-bold">
                Achievement Unlocked!
              </div>
              <h4 className="text-xs font-bold text-white font-mono">
                {toastNotification.title}
              </h4>
              <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                {toastNotification.desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING NIXON NPC INTUITIVE ASSISTANT DRAWER */}
      {!isGameActive && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
          
          {/* Chat message box bubble */}
          <AnimatePresence>
            {showNixonAI && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 15 }}
                className="bg-zinc-950/95 border-2 border-indigo-500/50 p-4 w-[280px] sm:w-[320px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl text-left space-y-3 pointer-events-auto select-none font-mono"
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold">
                    <Flame className="w-3.5 h-3.5 text-[#FFC03D] animate-pulse" />
                    <span>NIXON AI ASSISTANT</span>
                  </div>
                  <button 
                    onClick={() => setShowNixonAI(false)}
                    className="p-0.5 hover:bg-zinc-900 rounded-full cursor-pointer text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Speech bubble avatar */}
                <div className="flex gap-2.5 items-start">
                  <div className="w-8 h-8 shrink-0 border border-amber-500 rounded bg-[#2E1810] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 64 64" className="w-full h-full pixelated">
                      <rect x="16" y="16" width="32" height="32" fill="#E8B08A" />
                      <path d="M12 16 L16 8 L24 16 L32 8 L40 16 L48 8 L52 16 Z" fill="#2E1C0C" />
                      <rect x="22" y="24" width="4" height="4" fill="#0C0C12" />
                      <rect x="38" y="24" width="4" height="4" fill="#0C0C12" />
                      <rect x="18" y="22" width="12" height="6" fill="none" stroke="#FFC03D" strokeWidth="2" />
                      <rect x="34" y="22" width="12" height="6" fill="none" stroke="#FFC03D" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="text-[10px] leading-relaxed text-zinc-300 flex-1">
                    {nixonMessage}
                  </p>
                </div>

                {/* Dialogue clickable options */}
                <div className="space-y-1 pt-1.5 border-t border-zinc-900">
                  {nixonOptions.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleNixonAction(opt.action)}
                      className="w-full text-left p-1.5 text-[9px] text-[#FFC03D] hover:bg-indigo-650/40 rounded transition-all flex items-center gap-1 select-none pointer-events-auto cursor-pointer"
                    >
                      <span className="text-zinc-600 font-bold">&gt;</span>
                      <span className="hover:underline">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Circle floating launch button */}
          <button
            id="dock-nixon-ai-btn"
            onClick={() => {
              soundEngine.playBeep(880, 0.08, "triangle");
              setShowNixonAI(prev => !prev);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-650 to-rose-600 hover:from-indigo-600 hover:to-rose-500 shadow-[0_8px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.6)] border-2 border-white/10 flex items-center justify-center text-white cursor-pointer select-none transition-transform active:scale-95 hover:scale-105 pointer-events-auto"
            title="Speak with Nixon AI Assistant avatar"
          >
            <div className="relative">
              <MessageSquare className="w-5.5 h-5.5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>
          </button>

        </div>
      )}

      {/* --- MASTER SWITCHBOARD PANELS VIEWS --- */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          
          {/* VIEW A: UNIFIED LANDING PAGE (Hero + Animated Preview Game Frame + Stats + Milestones Journey) */}
          {!isGameActive ? (
            <motion.div
              key="unified-landing"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              className="w-full"
            >
              
              {/* --- HERO SECTION WITH TILT COMPASS & PARALLAX GLOWS --- */}
              <section className="relative px-4 sm:px-8 max-w-7xl mx-auto pt-8 pb-10 sm:pt-16 sm:pb-16 min-h-[calc(100vh-80px)] flex flex-col justify-center">
                
                {/* Embedded interactive glowing tilts container */}
                <motion.div 
                  style={{ x: mouseX, y: mouseY }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  
                  {/* Left Column: Stunning luxury typography brand copy block */}
                  <div className="lg:col-span-6 space-y-6 text-left relative z-10">
                    
                    {/* Status live badge with atmospheric pulsing glow */}
                    <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/35 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold">
                        OPEN FOR REMOTE SPRINT PROJECTS • 2026 ENGAGEMENTS
                      </span>
                    </div>

                    {/* Highly curated elegant display titles */}
                    <div className="space-y-4">
                      <span className="block text-xs sm:text-sm font-mono tracking-[0.25em] text-[#FFC03D] uppercase font-bold">
                        UX ARCHITECT & WEB CONVERSION AUDITOR
                      </span>
                      <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight leading-none text-white uppercase select-all">
                        EMMANUEL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC03D] via-rose-400 to-indigo-400 drop-shadow-sm">
                          NIXON
                        </span>
                      </h1>
                    </div>

                    {/* Premium multi-disciplinary tag pills */}
                    <div className="flex flex-wrap gap-2.5 text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                      <span className="bg-zinc-900 border border-zinc-800/85 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" /> Digital Marketing Expert
                      </span>
                      <span className="bg-zinc-900 border border-zinc-800/85 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Zap className="w-3 h-3 text-rose-500" /> Frontend Developer
                      </span>
                      <span className="bg-zinc-900 border border-zinc-800/85 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <Award className="w-3 h-3 text-indigo-400" /> Conversion Optimization Auditor
                      </span>
                    </div>

                    {/* Evocative, professional brand introductory summary */}
                    <p className="font-sans text-[#E4E4E5] text-sm sm:text-base leading-relaxed max-w-xl">
                      I write clear, high-scoring React architecture supercharged with digital acquisition copywriting and multi-channel campaign parameters. I configure digital loops that capture user focus, drive low CPC, and compound pipeline revenue.
                    </p>

                    {/* THE CRITICAL PREMIUM ACTION CALL */}
                    <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      
                      {/* Breathtaking luxury tactile active entry CTA buttons */}
                      <button
                        id="enter-interactive-game-btn"
                        onClick={handleLaunchGame}
                        className="group relative cursor-pointer overflow-hidden px-8 py-5 bg-[#2B1713] border-4 border-cozy-wood text-[#FDF6E2] shadow-[0_6px_0_0_#1B0F09] hover:shadow-[0_2px_0_0_#1B0F09] active:shadow-[0_0px_0_0_transparent] hover:border-[#FFC03D] active:translate-y-1 transition-all select-none text-center"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Gamepad2 className="w-5.5 h-5.5 text-[#FFC03D] animate-bounce" />
                          <span className="font-game text-[10px] tracking-wider text-white">
                            ENTER INTERACTIVE PORTFOLIO
                          </span>
                        </div>
                      </button>

                      {/* Informational helpful hints */}
                      <div className="text-left font-mono text-[10px] text-zinc-500 flex items-center gap-2.5 max-w-xs leading-normal">
                        <ArrowRight className="w-5 h-5 text-[#FFC03D] shrink-0" />
                        <span>Seamless 2.5D room boot without page reloads. Supports full mobile joystick or keyboard WASD.</span>
                      </div>

                    </div>

                    {/* Scroll indicators helper */}
                    <div className="pt-10 flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                      <span>scroll down to review statistics & timeline directory</span>
                      <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#FFC03D]" />
                    </div>

                  </div>

                  {/* Right Column: PREVIEW CHAMBER ACTING AS AN AUTOMATED TRAILER */}
                  <div className="lg:col-span-6 flex justify-center items-center relative">
                    
                    {/* Glowing backlight halo behind the RPG viewport frame */}
                    <div className="absolute w-[80%] h-[80%] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

                    {/* Premium gold plate bezel layout frame */}
                    <div className="relative p-3 bg-[#1D1011] border-[6px] border-[#2F1816] shadow-[0_30px_70px_rgba(0,0,0,0.9)] max-w-full rounded-lg">
                      
                      {/* Corner aesthetic gilded alignment plates */}
                      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FFC03D]" />
                      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FFC03D]" />
                      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FFC03D]" />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FFC03D]" />

                      {/* Render RetroGameMap with Autoplay parameter enabled */}
                      <div className="w-[305px] h-[200px] sm:w-[500px] sm:h-[328px] md:w-[540px] md:h-[354px] rounded bg-black overflow-hidden flex items-center justify-center">
                        <RetroGameMap 
                          onInteract={() => {}}
                          activeSection={null}
                          autoplay={true}
                        />
                      </div>

                      {/* Status subfoot indicators */}
                      <div className="mt-3 px-1 flex justify-between items-center text-[8px] font-mono uppercase text-zinc-500 select-none">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#FFC03D] rounded-full inline-block animate-ping" />
                          Walking Terrarium Stream Auto-panning
                        </span>
                        <span>Click Enter Above to play</span>
                      </div>

                    </div>

                  </div>

                </motion.div>

              </section>

              {/* --- PORTFOLIO DYNAMIC STATS SECTION (HIGHLY POLISHED GLASSMORPHISM Grid WITH COUNTUPS) --- */}
              <section className="relative py-12 border-t border-b border-zinc-900/50 bg-zinc-950/20">
                <div className="max-w-6xl mx-auto px-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-zinc-900/15 border border-zinc-800/40 rounded-3xl backdrop-blur-md">
                    
                    <div className="text-center space-y-1.5 border-r border-zinc-800/40 last:border-0 pr-4">
                      <CountUp end={12} prefix="" suffix="+" />
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                        Completed Projects
                      </p>
                    </div>

                    <div className="text-center space-y-1.5 md:border-r border-zinc-800/40 last:border-0 px-4">
                      <CountUp end={150} suffix="K+" />
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                        Campaign Paid Reach
                      </p>
                    </div>

                    <div className="text-center space-y-1.5 border-r border-zinc-800/40 last:border-0 px-4">
                      <CountUp end={38} suffix="0%" />
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#FFC03D] font-bold block">
                        Positive Campaign ROAS
                      </p>
                    </div>

                    <div className="text-center space-y-1.5 last:border-0 pl-4">
                      <CountUp end={99} suffix="/100" />
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#FFC03D] font-bold block">
                        Core Web Score
                      </p>
                    </div>

                  </div>
                </div>
              </section>

              {/* INTERACTIVE COMPASS TIMELINE & LEVEL-BASED CAREER PROGRESSION */}
              <section className="relative px-4 sm:px-8 max-w-6xl mx-auto pt-16 pb-20">
                
                {/* Section titles */}
                <div className="text-center pb-12 space-y-3">
                  <div className="inline-flex gap-1.5 items-center font-mono text-[9px] text-[#FFC03D] bg-yellow-950/30 px-3 py-1.5 rounded-full uppercase tracking-widest border border-yellow-900/40">
                    <Award className="w-3.5 h-3.5" />
                    <span>RPG Career Progression Journey</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
                    CHAMBER DIRECTORY WORKROOM
                  </h2>
                  <p className="text-zinc-450 text-xs sm:text-sm font-sans max-w-lg mx-auto">
                    Sweep down into the static workspace directory. Hover or click custom environments to unlock experiences, skills catalogs, and resume PDF gateways.
                  </p>
                </div>

                {/* Left/Right styled static showcase tour */}
                <CinematicTour
                  onOpenSection={(sect) => {
                    openSectionWithQuest(sect);
                    if (sect === "projects") {
                      triggerAchievementUnlock("desktop_os", "💻 Cyber Hacker", "Unlocked and booted the retro Portfolio OS desktop mockup simulator!");
                    }
                  }}
                />

              </section>

            </motion.div>
          ) : (
            
            /* VIEW B: FULL SCREEN IMMERSIVE ACTIVE EXPERIENCE CHAMBER PLAYROOM (100vw x 100vh) */
            <motion.div
              key="active-rpg-mode"
              initial={{ opacity: 0, scale: 1.12, filter: "blur(18px)" }}
              animate={{ opacity: 1, scale: 1.0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.12, filter: "blur(18px)" }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 w-screen h-screen z-40 bg-[#070408] overflow-hidden flex flex-col"
            >
              
              {/* 1. IMMERSIVE COMPACT TOP HUD NAVIGATION BAR */}
              <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-40 pointer-events-none flex flex-col gap-2 sm:flex-row justify-between items-center select-none font-mono">
                <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
                  <button
                    id="exit-fullscreen-gameroom-btn"
                    onClick={handleExitGame}
                    className="bg-rose-950/85 backdrop-blur-md border border-rose-900/60 text-rose-200 hover:text-white py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-[10px] uppercase font-black cursor-pointer tracking-widest transition-transform active:scale-95"
                  >
                    &larr; EXIT GAME MODE
                  </button>

                  {/* Desktop Fullscreen toggle */}
                  {!isFullscreenActive && (
                    <button
                      onClick={() => {
                        soundEngine.playInteract();
                        requestDocumentFullscreen();
                      }}
                      className="bg-black/85 backdrop-blur-md border border-zinc-900/80 text-amber-500 hover:text-amber-400 py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-[10px] uppercase font-bold cursor-pointer tracking-wider transition-transform active:scale-95"
                    >
                      ⛶ ENTER FULLSCREEN
                    </button>
                  )}

                  {/* Nixon AI Terminal Console Trigger */}
                  <button
                    onClick={() => {
                      soundEngine.playBeep(659.25, 0.05, "sine");
                      setShowTerminal(true);
                    }}
                    className="bg-black/85 backdrop-blur-md border border-zinc-900/80 text-zinc-300 hover:text-[#FFC03D] hover:border-[#FFC03D]/30 py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-[10px] uppercase font-bold cursor-pointer tracking-wider transition-all active:scale-95"
                    title="Futuristic Nixon OS Terminal AI Console"
                  >
                    <Laptop className="w-3.5 h-3.5 text-[#FFC03D]" />
                    <span>Terminal</span>
                  </button>

                  {/* Fast Travel Map Trigger */}
                  <button
                    onClick={() => {
                      soundEngine.playBeep(587.33, 0.05, "sine");
                      setShowTravelMap(true);
                    }}
                    className="bg-black/85 backdrop-blur-md border border-zinc-900/80 text-zinc-300 hover:text-[#FFC03D] hover:border-[#FFC03D]/30 py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-[10px] uppercase font-bold cursor-pointer tracking-wider transition-all active:scale-95"
                    title="Immersive Fast Travel Grid Map"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#FFC03D]" />
                    <span>Travel Map</span>
                  </button>

                  {/* Achievement Journal Trophy Book Trigger */}
                  <button
                    onClick={() => {
                      soundEngine.playBeep(523.25, 0.05, "sine");
                      setShowAchievementBook(true);
                    }}
                    className="bg-black/85 backdrop-blur-md border border-zinc-900/80 text-zinc-300 hover:text-[#FFC03D] hover:border-[#FFC03D]/30 py-2 px-3.5 rounded-xl flex items-center gap-1.5 text-[10px] uppercase font-bold cursor-pointer tracking-wider transition-all active:scale-95"
                    title="Achievement Journal & Trophy Progress"
                  >
                    <Trophy className="w-3.5 h-3.5 text-[#FFC03D]" />
                    <span>Trophies</span>
                  </button>

                </div>
                
                {/* Day / Night and Weather Atmospheric Controllers HUD inside RPG playroom - Hidden on mobile screens */}
                <div className="hidden sm:flex flex-wrap items-center gap-2 pointer-events-auto">
                  <div className="bg-black/85 backdrop-blur-md border border-zinc-900/80 px-3 py-1.5 rounded-xl flex items-center gap-2.5">
                    <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">ATMOSPHERE:</span>
                    {(["morning", "afternoon", "golden-hour", "night"] as const).map((cycle) => (
                      <button 
                        key={cycle}
                        onClick={() => {
                          setTimeMode(cycle);
                          soundEngine.playBeep(880, 0.05, "sine");
                        }}
                        className={`text-[8px] font-mono px-2 py-0.5 uppercase rounded font-bold transition-all ${timeMode === cycle ? "bg-[#FFC03D] text-zinc-950 font-black shadow-[0_0_8px_rgba(255,192,61,0.4)]" : "text-zinc-400 hover:text-zinc-200"}`}
                      >
                        {cycle === "golden-hour" ? "golden hr" : cycle}
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/85 backdrop-blur-md border border-zinc-900/80 px-3 py-1.5 rounded-xl flex items-center gap-2.5">
                    <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold">WEATHER:</span>
                    {(["sunny", "rainy", "cloudy", "foggy"] as const).map((wt) => (
                      <button 
                        key={wt}
                        onClick={() => {
                          setWeatherMode(wt);
                          soundEngine.playBeep(920, 0.05, "triangle");
                          triggerAchievementUnlock("weather_hacker", "🌤️ Weather Architect", `Disrupted natural atmospheric constraints to craft ${wt} weather.`);
                        }}
                        className={`text-[8px] font-mono px-2 py-0.5 uppercase rounded font-bold transition-all ${weatherMode === wt ? "bg-amber-600 text-white font-extrabold" : "text-zinc-400 hover:text-zinc-200"}`}
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[9px] uppercase font-mono tracking-widest text-[#FFC03D] flex items-center gap-2 font-bold bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-900/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                  Chamber Mode Active
                </div>
              </div>

              {/* 1b. COLLAPSIBLE MOBILE ATMOSPHERE DRAWER */}
              {showMobileAtmosphere && (
                <div className="absolute top-24 inset-x-4 z-40 sm:hidden select-none font-mono pointer-events-auto">
                  <div className="bg-black/95 border border-zinc-900/90 p-4 rounded-2xl shadow-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                      <span className="text-[9px] text-[#FFC03D] font-extrabold tracking-widest">ENVIRONMENT CONFIGURATION</span>
                      <button 
                        onClick={() => setShowMobileAtmosphere(false)}
                        className="text-[9px] text-zinc-500 font-bold hover:text-white px-2 py-0.5 rounded border border-zinc-900"
                      >
                        ✕ Close
                      </button>
                    </div>
                    {/* Time control */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Atmosphere Cycle:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {(["morning", "afternoon", "golden-hour", "night"] as const).map((cycle) => (
                          <button
                            key={cycle}
                            onClick={() => {
                              setTimeMode(cycle);
                              soundEngine.playBeep(880, 0.05, "sine");
                            }}
                            className={`text-[8px] py-1.5 uppercase rounded font-bold transition-all text-center ${
                              timeMode === cycle 
                                ? "bg-[#FFC03D] text-black font-black" 
                                : "bg-zinc-950/60 text-zinc-400 border border-zinc-900/40"
                            }`}
                          >
                            {cycle === "golden-hour" ? "gl_hr" : cycle}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Weather control */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Weather Patterns:</span>
                      <div className="grid grid-cols-4 gap-1">
                        {(["sunny", "rainy", "cloudy", "foggy"] as const).map((wt) => (
                          <button
                            key={wt}
                            onClick={() => {
                              setWeatherMode(wt);
                              soundEngine.playBeep(920, 0.05, "triangle");
                              triggerAchievementUnlock("weather_hacker", "🌤️ Weather Architect", "Disrupted natural weather.");
                            }}
                            className={`text-[8px] py-1.5 uppercase rounded font-bold transition-all text-center ${
                              weatherMode === wt 
                                ? "bg-amber-600 text-white font-extrabold" 
                                : "bg-zinc-950/60 text-zinc-400 border border-zinc-900/40"
                            }`}
                          >
                            {wt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. FLOATING QUEST JOURNAL HUD ON THE LEFT SIDE PANEL */}
              <div className="absolute top-[110px] left-4 sm:left-8 z-30 pointer-events-none w-[200px] sm:w-[240px] hidden md:block select-none font-mono">
                <div className="bg-black/85 backdrop-blur-md border border-zinc-900/80 p-4 rounded-2xl flex flex-col gap-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] pointer-events-auto text-left">
                  <div className="flex items-center gap-1.5 text-[9px] text-[#FFC03D] font-bold uppercase tracking-widest pb-2 border-b border-zinc-900/60">
                    <Trophy className="w-4 h-4 text-[#FFC03D] animate-pulse shrink-0" />
                    <span>CHAMBER QUESTS</span>
                  </div>

                  {/* Quest log progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[8px] text-zinc-500">
                      <span>EXPLORATION</span>
                      <span>{completedQuests.length} / 5</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${(completedQuests.length / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Quests list with details */}
                  <div className="space-y-2 pt-1">
                    {[
                      { key: "about", val: "Discover About Me", hint: "Walk to Oak Office Desk" },
                      { key: "resume", val: "Inspect Interactive CV", hint: "Walk to cozy cathode CRT TV" },
                      { key: "projects", val: "Boot simulated nixOS", hint: "Walk to upper display monitors" },
                      { key: "experience", val: "Analyze Employment Log", hint: "Walk to left timeline frames" },
                      { key: "contact", val: "Examine Contact Dispatch", hint: "Walk to bottom glass gateway" }
                    ].map((q) => {
                      const done = completedQuests.includes(q.key);
                      return (
                        <div key={q.key} className="flex items-start gap-2 text-[9px]">
                          <span className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center border font-bold text-[8px] shrink-0 ${done ? "bg-emerald-500/10 border-emerald-500/85 text-emerald-400" : "bg-zinc-900/40 border-zinc-800 text-zinc-650"}`}>
                            {done ? "✓" : "○"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className={`block font-bold tracking-tight leading-none ${done ? "text-zinc-500 line-through" : "text-white"}`}>
                              {q.val}
                            </span>
                            <span className="text-[7.5px] text-zinc-500 block leading-none mt-0.5 font-sans uppercase tracking-[0.03em]">{q.hint}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. GRAPHICS CANVAS VIEWPORT - occupies h-[75vh] on mobile to give a 100% immersive console style layout */}
              <div className="h-[75vh] sm:h-full sm:flex-1 w-full relative z-10 bg-[#070408]">
                <RetroGameMap 
                  onInteract={(sect) => {
                    openSectionWithQuest(sect);
                    if (sect === "projects") {
                      triggerAchievementUnlock("desktop_os", "💻 Cyber Hacker", "Unlocked and booted the retro Portfolio OS desktop mockup simulator!");
                    } else if (sect === "contact") {
                      triggerAchievementUnlock("contacted", "✉️ Direct Dispatch", "Accessed the direct mail gateway interface.");
                    }
                  }}
                  activeSection={activeModal}
                  autoplay={false}
                  dayNight={timeMode}
                  weather={weatherMode}
                  onSecretPlantClick={handleSecretPlantClick}
                  onNearbyObjectChange={(obj) => setNearbyObjFromGame(obj)}
                  
                  // Immersive HUD parameters
                  discoveredSectors={discoveredSectors}
                  onSectorsChange={setDiscoveredSectors}
                  teleportTarget={teleportTarget}
                  onClearTeleport={() => setTeleportTarget(null)}
                  onTriggerAchievement={(id, title, desc) => triggerAchievementUnlock(id, title, desc)}
                />
              </div>

              {/* 4. PREMIUM CONSOLE TOUCH CONTROL PANEL - occupies remaining h-[25vh] on phone screen */}
              <div className="h-[25vh] sm:hidden w-full bg-[#120E16] border-t-2 border-zinc-900/80 shadow-[inset_0_8px_32px_rgba(0,0,0,0.95)] relative overflow-hidden flex items-center justify-between px-6 pointer-events-auto shrink-0 z-30">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,14,22,0.85)_1px,transparent_1px),linear-gradient(90deg,rgba(18,14,22,0.85)_1px,transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none" />
                <MobileVirtualControls 
                  onInteract={() => {
                    if (nearbyObjFromGame) {
                      if (nearbyObjFromGame.section.startsWith("decor_")) {
                        soundEngine.playBeep(440, 0.15, "square");
                        triggerAchievementUnlock("botanist", "🌱 Environmentalist", "Approached and closely inspected Nixon's environmental details.");
                      }
                      if (nearbyObjFromGame.id === "about" || nearbyObjFromGame.id === "resume") {
                        soundEngine.playHeavyInteract();
                      } else {
                        soundEngine.playBeep(587.33, 0.12, "sine");
                      }
                      openSectionWithQuest(nearbyObjFromGame.section);
                    }
                  }}
                  nearbyObject={nearbyObjFromGame}
                  onAtmosphereToggle={() => {
                    setShowMobileAtmosphere(!showMobileAtmosphere);
                    soundEngine.playBeep(659.25, 0.05, "sine");
                  }}
                />
              </div>

              {/* Minimal floating keyboard guidance notes inside the viewport footer */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden md:block select-none font-mono">
                <p className="text-[10px] text-zinc-400 bg-black/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-zinc-900/80">
                  <span>Tactical Keys: </span>
                  <kbd className="px-1 bg-zinc-800 rounded border border-zinc-700 text-[#FFC03D] font-bold mx-0.5">W</kbd>
                  <kbd className="px-1 bg-zinc-800 rounded border border-zinc-700 text-[#FFC03D] font-bold mx-0.5">A</kbd>
                  <kbd className="px-1 bg-zinc-800 rounded border border-zinc-700 text-[#FFC03D] font-bold mx-0.5">S</kbd>
                  <kbd className="px-1 bg-zinc-800 rounded border border-zinc-700 text-[#FFC03D] font-bold mx-0.5">D</kbd>
                  <span className="mx-1">or</span>
                  <kbd className="px-1 bg-zinc-800 rounded border border-zinc-700 text-[#FFC03D] font-bold mx-0.5">ARROWS</kbd>
                  <span className="mx-1.5">•</span>
                  <kbd className="px-1 bg-zinc-800 rounded border border-zinc-700 text-[#FFC03D] font-bold mx-0.5">E</kbd>
                  <span className="ml-1">to interact. click items or Speak to Nixon NPC!</span>
                </p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* --- REUSABLE PORTFOLIO DETAIL DRAWER (MODAL SHIELD) --- */}
      <PortfolioModals
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        section={activeModal}
        mode={isGameActive ? "rpg" : "cinematic"}
        isDevMode={unlockedAchievements.includes("botanist")}
      />

      {/* Nixon AI Terminal modal */}
      {showTerminal && (
        <NixonTerminal onClose={() => setShowTerminal(false)} />
      )}

      {/* World Map & Fast Travel modal */}
      {showTravelMap && (
        <FastTravelMap 
          discoveredIds={discoveredSectors} 
          completedQuestsCount={unlockedAchievements.length}
          onClose={() => setShowTravelMap(false)} 
          onTeleport={(x, y, areaId) => {
            setTeleportTarget({ x, y });
            setShowTravelMap(false);
          }}
        />
      )}

      {/* Trophy & Achievement Book modal */}
      {showAchievementBook && (
        <AchievementBook 
          unlockedIds={unlockedAchievements} 
          onClose={() => setShowAchievementBook(false)} 
        />
      )}

      {/* Project Showcase Cinema overlay */}
      {activeCinemaProject && (
        <ProjectShowcaseCinema 
          project={activeCinemaProject} 
          onClose={() => setActiveCinemaProject(null)} 
        />
      )}

      {/* 2. SUPER ULTRA LUXURY SYSTEM BOOT SCI-FI CINEMATIC OVERLAY */}
      <AnimatePresence>
        {(isLaunching || isExiting) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl select-none font-mono"
          >
            <div className="text-center space-y-6 max-w-sm p-6">
              
              {/* Spinning geometric high-contrast matrix dashboard */}
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-xl border-2 border-dashed border-amber-500 animate-spin" style={{ animationDuration: "3.5s" }} />
                <div className="absolute inset-3 rounded-lg border border-indigo-500/65 animate-pulse" />
                <div className="absolute inset-6 rounded bg-rose-600 shadow-[0_0_15px_rgba(224,30,90,0.6)]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-black tracking-widest text-[#FFC03D] uppercase">
                  {isLaunching ? "BOOTING IMMERSIVE CHAMBER..." : "CLOSING QUANTUM MATRIX..."}
                </h3>
                
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#FFC03D] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#FFC03D] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#FFC03D] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>

              <div className="p-3 bg-zinc-950/90 border border-zinc-900 rounded-lg text-left text-[8.5px] leading-relaxed text-zinc-400 space-y-1 w-64 max-w-xs mx-auto font-mono">
                {isLaunching ? (
                  <>
                    {consoleLines.map((line, idx) => (
                      <p key={idx} className="text-emerald-400 font-bold">{line}</p>
                    ))}
                    {consoleLines.length < 5 && (
                      <p className="text-zinc-650 animate-pulse">&gt; Initializing systems...</p>
                    )}
                  </>
                ) : (
                  <>
                    <p>&gt; SAVE_CHECKSUMS: STATE STABLE</p>
                    <p>&gt; FLUSHING_AUDIO_SAMPLERS: COMPLETE</p>
                    <p>&gt; &copy; 2026 EMMANUEL NIXON SIAGIAN • ONLINE</p>
                  </>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER ACCENTS */}
      <footer className="w-full border-t border-zinc-900/60 bg-zinc-950/95 py-8 px-4 text-center text-[11px] font-mono text-zinc-500 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <p className="font-bold text-zinc-400 text-xs uppercase tracking-wider">Emmanuel Nixon Siagian</p>
            <p className="text-[10px]">Pure Client-Side React SPA • Supercharged with deep parallex and operating system desktop simulators</p>
          </div>
          <div className="flex gap-4 text-zinc-650">
            <span className="hover:text-[#FFC03D] cursor-pointer">Unlocks: {unlockedAchievements.length} / 5</span>
            <span>•</span>
            <span className="hover:text-[#FFC03D] transition-colors cursor-pointer flex items-center gap-1" onClick={() => setActiveModal("contact")}>
              Contact Dispatch Signal &larr;
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

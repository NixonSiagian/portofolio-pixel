import { motion } from "motion/react";
import { 
  ArrowRight, User, Briefcase, BookOpen, Clock, Mail, 
  Sparkles, CheckCircle2, Star, Shield, ArrowUpRight
} from "lucide-react";
import { PROJECTS_DATA, SKILLS_DATA, EXPERIENCE_DATA } from "./PortfolioModals";
import { soundEngine } from "../audio";

interface CinematicTourProps {
  onOpenSection: (section: "about" | "projects" | "skills" | "experience" | "resume" | "contact") => void;
}

export function CinematicTour({ onOpenSection }: CinematicTourProps) {

  const handleBlockClick = (sect: "about" | "projects" | "skills" | "experience" | "resume" | "contact") => {
    soundEngine.playInteract();
    onOpenSection(sect);
  };

  return (
    <div id="cinematic-tour-parent" className="relative space-y-24 py-12 px-4 max-w-6xl mx-auto">
      
      {/* 1. HERO DESK / ABOUT SECTION */}
      <section 
        id="tour-about"
        onClick={() => handleBlockClick("about")}
        className="group relative cursor-pointer border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 p-8 sm:p-12 rounded-3xl transition-all duration-500 hover:border-zinc-700/80 hover:shadow-[0_20px_50px_rgba(30,30,45,0.4)] overflow-hidden"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none group-hover:bg-indigo-500/15 duration-500" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-widest uppercase">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              Environment 01: The Foyer / About Me
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
              Emmanuel Nixon
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              An architect of interactive web experiences and conversion engine loops. I align full-stack performance directly with search visibility and multi-channel campaign ROI.
            </p>

            <div className="flex items-center gap-3 text-sm pt-4">
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                Read Personal Story & Portfolio Goals <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* High-end vector rendering of executive office desk */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                {/* Custom modern minimal luxury desk illustration */}
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl">
                  {/* Glowing office desk lamp */}
                  <path d="M75 55L90 40M90 40H110" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="110" cy="40" r="6" fill="#818CF8" className="animate-pulse" />
                  
                  {/* Desk top */}
                  <rect x="15" y="65" width="90" height="8" rx="2" fill="#3F3F46" />
                  {/* Desk board shadow drawer */}
                  <rect x="25" y="73" width="70" height="12" fill="#27272A" />
                  {/* Steel core legs */}
                  <line x1="30" y1="85" x2="20" y2="115" stroke="#71717A" strokeWidth="4" />
                  <line x1="90" y1="85" x2="100" y2="115" stroke="#71717A" strokeWidth="4" />

                  {/* Sleek aluminum laptop */}
                  <rect x="42" y="52" width="36" height="13" rx="1" fill="#E4E4E7" />
                  <rect x="45" y="54" width="30" height="9" fill="#18181B" />
                  {/* Glowing laptop screen */}
                  <rect x="46" y="55" width="28" height="7" fill="#6366F1" opacity="0.8" />
                  <rect x="38" y="63" width="44" height="2" rx="0.5" fill="#A1A1AA" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAINFRAME PROJECTS */}
      <section 
        id="tour-projects"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs tracking-widest uppercase">
            <Briefcase className="w-4 h-4" />
            Environment 02: Innovation Hub / Projects
          </div>
          <button 
            id="btn-projects-expand"
            onClick={() => handleBlockClick("projects")}
            className="text-xs font-mono text-zinc-450 hover:text-white flex items-center gap-1 group"
          >
            Expand Shell <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS_DATA.map((proj) => (
            <div 
              key={proj.id}
              onClick={() => handleBlockClick("projects")}
              className="group cursor-pointer border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/50 p-6 rounded-2xl transition-all duration-400 hover:border-zinc-700 hover:shadow-xl flex flex-col justify-between h-72 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-rose-500/5 blur-2xl group-hover:bg-rose-500/10 transition-colors" />
              
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                  {proj.category}
                </span>
                <h3 className="font-display text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-normal mt-2 line-clamp-3">
                  {proj.description}
                </p>
              </div>

              {/* Marketing metrics indicator badge */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex justify-between items-center text-[11px]">
                <span className="text-zinc-500">Metric Impact</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {proj.metric?.split("&")[0] || proj.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPERIENCE TIMELINE & SKILLS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Experience Showcase Panel - 7 columns */}
        <div 
          id="tour-experience"
          onClick={() => handleBlockClick("experience")}
          className="lg:col-span-7 group cursor-pointer border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 p-8 rounded-3xl transition-all duration-500 hover:border-zinc-750 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest uppercase mb-6">
              <Clock className="w-4 h-4" />
              Environment 03: Experience Timeline
            </div>

            <div className="space-y-6 relative border-l border-zinc-800 pl-4">
              {EXPERIENCE_DATA.slice(0, 2).map((exp) => (
                <div key={exp.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">{exp.period}</span>
                  <h4 className="font-display text-base font-semibold text-white mt-1">
                    {exp.role}
                  </h4>
                  <p className="text-zinc-400 text-xs font-medium mt-0.5">
                    {exp.company}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 font-semibold flex items-center gap-1.5 text-zinc-400 group-hover:text-amber-400 transition-colors text-xs col-span-2">
            View Complete Employment Histories & Sprints <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Skills books dashboard - 5 columns */}
        <div 
          id="tour-skills"
          onClick={() => handleBlockClick("skills")}
          className="lg:col-span-5 group cursor-pointer border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 p-8 rounded-3xl transition-all duration-500 hover:border-zinc-750 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-6">
              <BookOpen className="w-4 h-4" />
              Environment 04: Skills Core Archive
            </div>

            <div className="space-y-4">
              {SKILLS_DATA.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <span className="text-xs font-semibold text-zinc-300 block">{cat.category}</span>
                  <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-400" 
                      style={{ width: `${idx === 0 ? 92 : idx === 1 ? 88 : 91}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 font-semibold flex items-center gap-1.5 text-zinc-400 group-hover:text-emerald-400 transition-colors text-xs">
            Audit Competency Levels & Technologies <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* 4. RESUME BROADCAST TV */}
      <section 
        id="tour-resume"
        onClick={() => handleBlockClick("resume")}
        className="group cursor-pointer border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 p-8 sm:p-12 rounded-3xl transition-all duration-500 hover:border-zinc-700/80 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs tracking-widest uppercase">
              <Shield className="w-4 h-4" />
              Environment 05: Document Broadcast / Resume
            </div>
            
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              Professional Catalog Download
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
              Save or share my structured career curriculum vitae detailing core ad performances, client success metrics, and direct tool masteries in a streamlined executive PDF format.
            </p>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <button 
              id="btn-cinematic-dl"
              className="py-3 px-6 text-xs font-semibold tracking-wider bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-white rounded-xl shadow group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all pointer-events-none"
            >
              Request CV PDF Document
            </button>
          </div>
        </div>
      </section>

      {/* 5. CONTACT CHANNELS ACCORDION */}
      <section 
        id="tour-contact"
        onClick={() => handleBlockClick("contact")}
        className="group cursor-pointer border border-zinc-800 bg-gradient-to-r from-zinc-900/10 via-zinc-900/30 to-pink-500/5 hover:to-pink-500/10 p-8 rounded-3xl transition-all duration-500 hover:border-pink-500/30 text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 text-pink-400 font-mono text-xs tracking-widest uppercase mb-2">
          <Mail className="w-4 h-4" />
          Environment 06: Contact Gateway Atrium
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Establish Live Connection Link
        </h2>
        
        <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
          Need to formulate SEO layouts, boost meta campaign metrics, or audit existing landing environments? Tap here to send an immediate signal. Let's make things happen!
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 group-hover:translate-x-1.5 transition-transform pt-4">
          Open Digital Mailbox Panel <ArrowRight className="w-4 h-4" />
        </div>
      </section>

    </div>
  );
}

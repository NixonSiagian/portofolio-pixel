import fs from 'fs';

let fileContent = `import React from "react";
import { Clock, Book, Target, Award, Code, Monitor, FileText, Sparkles, Map, Headphones, Briefcase, Eye, Cpu, Database, Flame, Globe, Trophy, Key, Star } from "lucide-react";

interface DecorModalContentProps {
  id: string; // The ID without "decor_" prefix
}

export function DecorModalContent({ id }: DecorModalContentProps) {
  const getDecorData = (decorId: string) => {
    switch (decorId) {
      // WORLD EXPANSION OBJECTS
      case "wall_clock":
        return {
          icon: <Clock className="w-8 h-8 text-amber-500 mb-4 animate-[spin_60s_linear_infinite]" />,
          title: "Standard Time / Dublin",
          subtitle: "Current Local Time: " + new Date().toLocaleTimeString(),
          content: "Time is the ultimate currency. Routine: 9 AM to 1 PM strict 'Creator Hours' with zero meetings to ensure +42% sustained development flow. A fun fact: Parkinson's Law states work expands to fill the time allotted to it.",
          tags: ["Time Management", "Deep Work", "Routine"]
        };
      case "workspace_plant_1":
        return {
          icon: <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />,
          title: "Hanging Pothos Ivy",
          subtitle: "Growth Mindset",
          content: "\\"There are no shortcuts to any place worth going.\\" A reminder that compounding habits create the highest returns in both SEO and life. Fun easter egg: You found the Golden Leaf! (+100 XP)",
          tags: ["Wisdom", "Easter Egg", "Patience"]
        };
      case "workspace_plant_2":
        return {
          icon: <Sparkles className="w-8 h-8 text-emerald-600 mb-4" />,
          title: "Monstera Deliciosa",
          subtitle: "Adaptation",
          content: "In marketing campaigns, sometimes you need to let the data 'breathe' for 72 hours before making aggressive budget cuts. Let the pixel learn just like a plant seeks the sun.",
          tags: ["Campaigns", "Data", "Adaptation"]
        };
      case "tech_books_floor":
        return {
          icon: <Book className="w-8 h-8 text-blue-500 mb-4" />,
          title: "Development Library",
          subtitle: "Frontend & Architecture",
          content: "Categories: React Mastery, Node.js Patterns, CSS Grid, WebGL Performance. Unlocked skills: React Native, GraphQL Integration. Experience level: Principal Engineer.",
          tags: ["Books", "Frontend", "Skills"]
        };
      case "marketing_books":
        return {
          icon: <Target className="w-8 h-8 text-rose-500 mb-4" />,
          title: "Strategic Marketing Library",
          subtitle: "SEO & Consumer Psychology",
          content: "Categories: Google Ads Playbook, CRO Fundamentals, Neuromarketing, Funnel Building. Unlocked tools: Semrush, Meta Ads Manager, GA4.",
          tags: ["Marketing", "SEO", "Business"]
        };
      case "monitor1":
        return {
          icon: <Monitor className="w-8 h-8 text-pink-500 mb-4" />,
          title: "Analytics Dashboard",
          subtitle: "Real-time Metrics",
          content: "Active Users: 1,402. ROAS: 3.8x. Bounce Rate: 28%. The marketing campaigns are firing accurately across 5 digital properties right now.",
          tags: ["Analytics", "Data", "Live"]
        };
      case "monitor2":
        return {
          icon: <Code className="w-8 h-8 text-indigo-500 mb-4" />,
          title: "Development Projects",
          subtitle: "IDE Active",
          content: "Compiling... 0 errors, 0 warnings. Next.js architecture running hot. Docker containers are healthy and deployed globally via Edge network.",
          tags: ["Code", "DevOps", "Healthy"]
        };
      case "desk_drawers":
        return {
          icon: <Trophy className="w-8 h-8 text-yellow-500 mb-4" />,
          title: "Secret Workspace Drawer",
          subtitle: "Hidden Discoveries",
          content: "Inside you find a 2019 SEO Certification, a discontinued startup business plan, and a rare '10,000 hours' milestone badge! You also found an extra coffee bean (+1 Stamina).",
          tags: ["Achievements", "Secrets", "Collectibles"]
        };
      case "posters":
        return {
          icon: <FileText className="w-8 h-8 text-purple-400 mb-4" />,
          title: "Vintage Campaign Posters",
          subtitle: "Every Poster Tells A Story",
          content: "The poster on the left reminds you to 'Ship Early, Ship Often'. The right poster is a snapshot of the first successful SaaS launch in 2021. 'Good design is good business.'",
          tags: ["Inspiration", "Stories", "Milestones"]
        };
      case "windows":
        return {
          icon: <Globe className="w-8 h-8 text-cyan-400 mb-4" />,
          title: "Panoramic Window",
          subtitle: "Outside World",
          content: "The weather outside is perfectly calibrated for coding. Future Vision: Build an AI-assisted marketing OS. Dream project: A fully generative digital agency.",
          tags: ["Vision", "Dreams", "Weather"]
        };
      case "rug":
        return {
          icon: <Star className="w-8 h-8 text-amber-500 mb-4 animate-bounce" />,
          title: "Ancient Persian Rug",
          subtitle: "Hidden Easter Egg!",
          content: "You lifted the rug and found a dusty floppy disk labeled 'Founder_Mantra.exe'. It contains the exact hash algorithm used to secure the very first client. (+5000 XP!).",
          tags: ["Easter Egg", "Reward", "Secrets"]
        };
      case "g_lamp_1":
        return {
          icon: <Sparkles className="w-8 h-8 text-yellow-300 mb-4 animate-pulse" />,
          title: "Floor Lamp of Wisdom",
          subtitle: "Random Advice",
          content: "If your Meta Ads frequency is above 3.5, rotate your creatives immediately. Ad fatigue is the silent budget killer.",
          tags: ["Wisdom", "Marketing", "Tips"]
        };
      case "workspace_speakers":
        return {
          icon: <Headphones className="w-8 h-8 text-indigo-400 mb-4 animate-pulse" />,
          title: "Hi-Fi Audio Rig",
          subtitle: "Music Player",
          content: "Currently Playing: Cinematic Synthwave. Visitors can switch channels: [ Lo-Fi ] [ Ambient ] [ Cinematic ] [ Electronic ]. Audio helps induce flow states.",
          tags: ["Audio", "Flow State", "Vibes"]
        };
      case "trophy_case":
        return {
          icon: <Award className="w-8 h-8 text-yellow-400 mb-4" />,
          title: "Collectibles Cabinet",
          subtitle: "Badges & Progress",
          content: "12/20 Quests completed. 5/5 Projects Launched. You have attained the Rank: 'Analyst'. Keep exploring to reach 'Innovator'!",
          tags: ["Collectibles", "Ranks", "Progress"]
        };
      case "server_rack":
        return {
          icon: <Cpu className="w-8 h-8 text-emerald-500 mb-4" />,
          title: "Core Operations Terminal", 
          subtitle: "Web Core Infrastructure",
          content: "This unit processes CI/CD pipelines, handles Docker containers, and proxies API secure payloads. A 99.9% uptime metric is standard operating procedure.",
          tags: ["DevOps", "CI/CD", "Infrastructure"]
        };

      // NEW RPG FEATURES
      case "city_alcho":
        return {
          icon: <Database className="w-8 h-8 text-red-500 mb-4" />,
          title: "Client City: Alcho Foods Tower",
          subtitle: "Project Building",
          content: "A 40-story commercial skyscraper. Challenge: Low organic traffic. Solution: React-driven interactive catalog. Result: +42% Conversion Rate Boost. Tech: Next.js, Framer Motion.",
          tags: ["Client Area", "E-Commerce", "Success"]
        };
      case "city_marketing":
        return {
          icon: <Target className="w-8 h-8 text-blue-600 mb-4" />,
          title: "Client City: Marketing Agency Hub",
          subtitle: "Agency Operations",
          content: "A sprawling complex managing $15,000+ targeted campaign budgets. The building generates 2,400+ Quality Leads in 90 days. Meta Ads, Google Ads Planner active.",
          tags: ["Agency", "Paid Ads", "Acquisition"]
        };
      case "impact_center":
        return {
          icon: <Flame className="w-8 h-8 text-orange-500 mb-4" />,
          title: "Real-Time Impact Center",
          subtitle: "Live Data Feed",
          content: "Projects Completed: 45+. Campaign Reach: 12M+. Traffic Generated: 400K+. Revenue Impact: $2.4M tracked. Constant streaming analytics powered by custom WebSockets.",
          tags: ["Metrics", "Live", "Impact"]
        };
      case "hall_legend":
        return {
          icon: <Trophy className="w-8 h-8 text-yellow-300 mb-4" />,
          title: "Hall of Legends",
          subtitle: "Greatest Artifacts",
          content: "The Golden Conversion Rate Crown. This legendary artifact was forged during the peak Q4 E-Commerce sprint, increasing ROAS by 3.8x against impossible market algorithms.",
          tags: ["Museum", "Legendary", "Hall of Fame"]
        };
      case "dream_portal":
        return {
          icon: <Sparkles className="w-8 h-8 text-fuchsia-500 mb-4 animate-spin" />,
          title: "Dream Project Portal",
          subtitle: "Vision 2030",
          content: "A swirling vortex showing future startup ideas, generative AI clients, and cross-platform mobile apps. The magic is in execution, not just the dream.",
          tags: ["Future", "Portal", "Vision"]
        };
      case "founder_chamber":
        return {
          icon: <Key className="w-8 h-8 text-amber-500 mb-4" />,
          title: "The Founder Chamber",
          subtitle: "Secret Endgame",
          content: "You've explored the entire world. Congratulations. My personal roadmap envisions bridging complex engineering with beautiful marketing. Thank you for playing and exploring my universe.",
          tags: ["Endgame", "Secret", "Thank You!"]
        };
        
      default:
        // Handle un-prefixed IDs because sometimes we pass them directly from "section" (if we omitted "decor_")
        if (decorId.startsWith("city_")) {
           return {
             icon: <Globe className="w-8 h-8 text-blue-500 mb-4" />,
             title: "Client District Area",
             subtitle: "Under Construction",
             content: "Explore the bustling streets of Client City.",
             tags: ["City", "Projects"]
           }
        }
        return {
          icon: <Sparkles className="w-8 h-8 text-zinc-400 mb-4" />,
          title: "Immersive Object",
          subtitle: "Unknown Item",
          content: "You discovered something intriguing in the portfolio. Every edge case holds a story.",
          tags: ["Easter Egg", "Discovery"]
        };
    }
  };

  // If the id contains "city_" or "impact_" or "hall_" or "dream_" or "founder_", it might have come without the "decor_" prefix if I named it directly.
  const data = getDecorData(id);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[40vh] animate-fade-in transition-all">
      {data.icon}
      <h3 className="text-2xl font-bold text-white tracking-wider mb-2 font-display">{data.title}</h3>
      <h4 className="text-sm text-yellow-500 uppercase tracking-widest font-mono mb-6">{data.subtitle}</h4>
      <p className="text-zinc-300 max-w-lg leading-relaxed text-sm md:text-base font-sans mb-8 border border-zinc-800 p-6 rounded-lg bg-zinc-950/50 shadow-inner">
        {data.content}
      </p>
      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        {data.tags.map(t => (
          <span key={t} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs tracking-wider rounded-full uppercase font-bold">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/DecorModalContent.tsx', fileContent);
console.log("Updated DecorModalContent.tsx");

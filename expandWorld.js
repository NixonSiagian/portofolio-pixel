import fs from 'fs';

const mapFile = 'src/components/RetroGameMap.tsx';
let mapCode = fs.readFileSync(mapFile, 'utf8');

// We will inject new WALKABLE_AREAS, ROOM_OBJECTS, DECORATIONS.
let newWalkableAreas = `
const WALKABLE_AREAS = [
  // Original 5 Rooms
  { x1: 580, y1: 120, x2: 1020, y2: 520, name: "Main Workspace" },
  { x1: 80, y1: 120, x2: 520, y2: 520, name: "Career Hall" },
  { x1: 580, y1: -380, x2: 1020, y2: 80, name: "Project Lab" },
  { x1: 1080, y1: 120, x2: 1520, y2: 520, name: "Achievement Gallery" },
  { x1: 580, y1: 560, x2: 1020, y2: 920, name: "Contact Lounge" },

  // Original Corridors
  { x1: 500, y1: 260, x2: 600, y2: 360, name: "West Corridor" },
  { x1: 1000, y1: 260, x2: 1100, y2: 360, name: "East Corridor" },
  { x1: 750, y1: 70, x2: 850, y2: 130, name: "North Corridor" },
  { x1: 750, y1: 510, x2: 850, y2: 570, name: "South Corridor" },

  // New RPG Expanded Areas
  { x1: 580, y1: -880, x2: 1020, y2: -480, name: "Client City" },
  { x1: -420, y1: 120, x2: -20, y2: 520, name: "Knowledge Library" },
  { x1: 1580, y1: 120, x2: 2020, y2: 520, name: "Hall of Legends" },
  { x1: 580, y1: 1020, x2: 1020, y2: 1420, name: "Real-Time Impact Center" },
  { x1: -420, y1: -380, x2: 80, y2: -20, name: "Dream Project Portal" },

  // New Corridors
  { x1: 750, y1: -480, x2: 850, y2: -380, name: "North-North Corridor" }, // Project Lab to Client City
  { x1: -20, y1: 260, x2: 80, y2: 360, name: "West-West Corridor" }, // Career Hall to Knowledge Library
  { x1: 1520, y1: 260, x2: 1580, y2: 360, name: "East-East Corridor" }, // Achievement Gallery to Hall of Legends
  { x1: 750, y1: 920, x2: 850, y2: 1020, name: "South-South Corridor" }, // Contact Lounge to Impact Center
  { x1: -420, y1: 80, x2: -320, y2: 120, name: "NW Corridor" }, // Knowledge Library to Portal
  { x1: 80, y1: -380, x2: 180, y2: -280, name: "Portal Entry" }, // Portal connected to Career Hall
];
`;

let newRoomObjects = `
const ROOM_OBJECTS: RoomObject[] = [
  // MAIN WORKSPACE (CENTER)
  { id: "desk", name: "Cozy Oak Desk & Nixon Laptop", section: "about", x: 755, y: 220, width: 90, height: 70, color: "#8B5A2B", label: "Workstation View", shortcut: "E", description: "About Me, Current Focus, Tools & Setup." },
  { id: "laptop", name: "Nixon OS Laptop", section: "projects", x: 790, y: 235, width: 25, height: 20, color: "#CCCCCC", label: "Nixon OS", shortcut: "E", description: "Launch Nixon OS - Projects, Portfolio & Showcase." },
  { id: "skills", name: "Golden Skill Bookshelf", section: "skills", x: 640, y: 150, width: 80, height: 60, color: "#5E3F28", label: "Skill Tree", shortcut: "E", description: "Interactive skill tree (Marketing, Dev, Design)." },
  { id: "clock", name: "Time Management Clock", section: "decor_wall_clock", x: 800, y: 130, width: 30, height: 30, color: "#2D1D2C", label: "Local Time & Routine", shortcut: "E", description: "Read work schedule & productivity philosophy." },
  { id: "workspace_plant_1", name: "Hanging Pothos ivy", section: "decor_workspace_plant_1", x: 590, y: 140, width: 24, height: 40, color: "#2C6B37", label: "Inspect Plant", shortcut: "E", description: "Hidden quotes and career advice." },
  { id: "workspace_plant_2", name: "Potted Monstera", section: "decor_workspace_plant_2", x: 1000, y: 160, width: 32, height: 32, color: "#5E3926", label: "Inspect Plant", shortcut: "E", description: "Secret mindset principles." },
  { id: "speakers", name: "Hi-Fi Studio Monitors", section: "decor_workspace_speakers", x: 730, y: 220, width: 14, height: 24, color: "#222", label: "Change Music", shortcut: "E", description: "Switch between Lofi, Ambient, Cinematic music." },
  { id: "rug", name: "Persian Rug", section: "decor_rug", x: 740, y: 290, width: 120, height: 80, color: "#8A3324", label: "Inspect Rug", shortcut: "R", description: "Search for hidden easter eggs." },
  
  // CAREER HALL (LEFT)
  { id: "experience", name: "Chronicle Wall Frames", section: "experience", x: 240, y: 150, width: 110, height: 60, color: "#D4AF37", label: "Career Timeline", shortcut: "E", description: "Interactive milestone tracker." },
  { id: "posters", name: "Career Posters", section: "decor_posters", x: 140, y: 150, width: 60, height: 40, color: "#444", label: "Read Poster", shortcut: "E", description: "Important career lessons & inspirations." },
  { id: "windows", name: "Hall Windows", section: "decor_windows", x: 80, y: 250, width: 20, height: 100, color: "#818CF8", label: "Look Outside", shortcut: "E", description: "Future goals & weather." },

  // PROJECT LAB (TOP)
  { id: "projects_monitor1", name: "Analytics Dashboard Monitor", section: "decor_monitor1", x: 730, y: -310, width: 45, height: 40, color: "#2C3E50", label: "Analytics", shortcut: "E", description: "Monitor 1: Real-time marketing." },
  { id: "projects_monitor2", name: "Dev Projects Monitor", section: "decor_monitor2", x: 785, y: -310, width: 45, height: 40, color: "#2C3E50", label: "Development", shortcut: "E", description: "Monitor 2: Web infrastructure." },
  { id: "drawers", name: "Storage Drawers", section: "decor_desk_drawers", x: 935, y: -260, width: 44, height: 48, color: "#5E3F28", label: "Open Drawers", shortcut: "E", description: "Find rare collectibles & achievements." },
  { id: "server", name: "Core Operations Server", section: "decor_server_rack", x: 595, y: -360, width: 40, height: 75, color: "#111", label: "Server Rack", shortcut: "E", description: "Advanced CI/CD metrics." },

  // ACHIEVEMENT GALLERY (RIGHT)
  { id: "trophies", name: "Trophy Cabinets", section: "decor_trophy_case", x: 1200, y: 145, width: 100, height: 55, color: "#4B3621", label: "View Cabinets", shortcut: "E", description: "Collection of badges and quest progress." },
  { id: "lamps", name: "Floor Lamps", section: "decor_g_lamp_1", x: 1140, y: 140, width: 20, height: 20, color: "#FFD700", label: "Inspect Lamp", shortcut: "E", description: "Random developer wisdom." },

  // CONTACT LOUNGE (BOTTOM)
  { id: "tv", name: "CRT Television", section: "resume", x: 710, y: 700, width: 70, height: 60, color: "#3F3F3F", label: "Resume Center", shortcut: "E", description: "CV Download, Resume Preview, Highlights." },
  { id: "contact", name: "Subtle Teak exit door", section: "contact", x: 885, y: 700, width: 60, height: 80, color: "#5C3D2E", label: "Contact Gateway", shortcut: "E", description: "Reach out via email & transmission form." },

  // KNOWLEDGE LIBRARY (FAR LEFT)
  { id: "dev_books", name: "Development Bookshelf", section: "decor_tech_books_floor", x: -300, y: 150, width: 100, height: 60, color: "#5E3F28", label: "Read Dev Books", shortcut: "E", description: "Frontend, UX/UI, Tools used." },
  { id: "marketing_books", name: "Marketing Bookshelf", section: "decor_marketing_books", x: -150, y: 150, width: 100, height: 60, color: "#5E3F28", label: "Read Marketing Books", shortcut: "E", description: "SEO, Campaigns, Business." },

  // CLIENT CITY (FAR TOP)
  { id: "city_hq", name: "Alcho Foods Headquarters", section: "city_alcho", x: 750, y: -780, width: 100, height: 100, color: "#8B0000", label: "Enter HQ", shortcut: "E", description: "Explore the Alcho Foods project building." },
  { id: "city_marketing", name: "Marketing Agency Bldg", section: "city_marketing", x: 600, y: -680, width: 80, height: 80, color: "#00008B", label: "Enter Agency", shortcut: "E", description: "Marketing campaigns analysis." },

  // HALL OF LEGENDS (FAR RIGHT)
  { id: "legend_artifact", name: "Greatest Artifact", section: "hall_legend", x: 1750, y: 250, width: 50, height: 50, color: "#D4AF37", label: "Inspect Artifact", shortcut: "E", description: "Your best campaign and biggest milestone." },

  // REAL-TIME IMPACT CENTER (FAR BOTTOM)
  { id: "impact_dashboard", name: "Main Data Terminal", section: "impact_center", x: 750, y: 1100, width: 120, height: 60, color: "#1A1A1A", label: "View Metrics", shortcut: "E", description: "Animated conversion & client metrics." },

  // DREAM PROJECT PORTAL (TOP LEFT)
  { id: "dream_portal", name: "Mysterious Portal", section: "dream_portal", x: -200, y: -150, width: 80, height: 80, color: "#800080", label: "Enter Portal", shortcut: "E", description: "Vision 2030, Future Products, Dreams." },

  // SECRET ENDGAME (HIDDEN UNTIL QUESTS COMPLETED)
  { id: "founder_door", name: "The Founder Chamber", section: "founder_chamber", x: 1950, y: 300, width: 40, height: 80, color: "#222222", label: "Founder Chamber", shortcut: "E", description: "True ending of the game." },
];
`;

let newDecorations = `
const DECORATIONS = [
  // Kept Empty because ROOM_OBJECTS are handling interactions now!
];
`;

mapCode = mapCode.replace(/const WALKABLE_AREAS = \[[\s\S]*?\];/, newWalkableAreas);
mapCode = mapCode.replace(/const ROOM_OBJECTS: RoomObject\[\] = \[[\s\S]*?\];/, newRoomObjects);
mapCode = mapCode.replace(/const DECORATIONS = \[[\s\S]*?];/, newDecorations);

fs.writeFileSync(mapFile, mapCode);

console.log("Successfully patched RetroGameMap.tsx with expanded world!");

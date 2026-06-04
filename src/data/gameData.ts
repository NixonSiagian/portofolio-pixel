import { RoomObject } from "../types";

export interface WalkableArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  name: string;
  isOutdoor?: boolean;
}

export const WALKABLE_AREAS: WalkableArea[] = [
  // --- INDOOR: PORTFOLIO HEADQUARTERS ---
  { x1: 580, y1: 120, x2: 1020, y2: 520, name: "Main Workspace" },
  { x1: 80, y1: 120, x2: 520, y2: 520, name: "Career Hall" },
  { x1: 580, y1: -380, x2: 1020, y2: 80, name: "Project Lab" },
  { x1: 1080, y1: 120, x2: 1520, y2: 520, name: "Achievement Gallery" },
  { x1: 580, y1: 560, x2: 1020, y2: 920, name: "Contact Lounge" },
  
  // Corridors
  { x1: 500, y1: 260, x2: 600, y2: 360, name: "West Corridor" },
  { x1: 1000, y1: 260, x2: 1100, y2: 360, name: "East Corridor" },
  { x1: 750, y1: 70, x2: 850, y2: 130, name: "North Corridor" },
  { x1: 750, y1: 510, x2: 850, y2: 570, name: "South Corridor" },

  // --- NEW EXPANDED INDOOR AREAS ---
  { x1: 580, y1: -880, x2: 1020, y2: -480, name: "Strategy War Room" },
  { x1: -420, y1: 120, x2: -20, y2: 520, name: "Knowledge Library" },
  { x1: 1580, y1: 120, x2: 2020, y2: 520, name: "Hall of Legends" },
  { x1: 580, y1: 1020, x2: 1020, y2: 1420, name: "Real-Time Impact Center" },
  { x1: -420, y1: -380, x2: 80, y2: -20, name: "Dream Project Portal" },
  { x1: 1080, y1: -380, x2: 1520, y2: 80, name: "Creative Studio" },
  { x1: 1580, y1: -380, x2: 1900, y2: 80, name: "Founder Office" },

  // New Corridors
  { x1: 750, y1: -480, x2: 850, y2: -380, name: "North-North Corridor" },
  { x1: -20, y1: 260, x2: 80, y2: 360, name: "West-West Corridor" },
  { x1: 1520, y1: 260, x2: 1580, y2: 360, name: "East-East Corridor" },
  { x1: 750, y1: 920, x2: 850, y2: 1020, name: "South-South Corridor" },
  { x1: 1000, y1: -200, x2: 1080, y2: -100, name: "Laboratory Annex" },
  { x1: 1520, y1: -200, x2: 1580, y2: -100, name: "Executive Hall" },

  // --- OUTDOOR AREAS ---
  { x1: 650, y1: 1420, x2: 950, y2: 1600, name: "Building Entrance Path", isOutdoor: true },
  { x1: -1000, y1: 1600, x2: 2500, y2: 2500, name: "Town Square", isOutdoor: true },
  { x1: -500, y1: 2500, x2: 500, y2: 3500, name: "Zen Garden", isOutdoor: true },
  { x1: 1500, y1: 2500, x2: 2500, y2: 3500, name: "Monument Park", isOutdoor: true },
  
  // Outdoor Connections
  { x1: -1000, y1: 2100, x2: -500, y2: 2500, name: "Garden Path", isOutdoor: true },
  { x1: 1000, y1: 2100, x2: 1500, y2: 2500, name: "Monument Path", isOutdoor: true },
];

export const ROOM_OBJECTS: RoomObject[] = [
  // --- MAIN WORKSPACE ---
  { id: "desk", name: "Executive Mahogany Desk", section: "about", x: 755, y: 220, width: 110, height: 75, color: "#4a3324", label: "Workstation", shortcut: "E", description: "Emmanuel's primary workspace. Clean and focused." },
  { id: "laptop", name: "Premium Dev Machine", section: "projects", x: 795, y: 235, width: 30, height: 25, color: "#333", label: "Nixon OS", shortcut: "E", description: "High-spec laptop running local development environments." },
  { id: "skills_shelf", name: "Encyclopedic Bookshelf", section: "skills", x: 640, y: 150, width: 85, height: 65, color: "#312e81", label: "Core Skills", shortcut: "E", description: "Books on Modern Dev, SEO Optimization, and Creative Direction." },
  { id: "coffee_station", name: "Designer Coffee Setup", section: "decor_coffee", x: 600, y: 150, width: 30, height: 30, color: "#fff", label: "Fuel", shortcut: "E", description: "Essential for late-night coding sessions." },
  { id: "monitor_wall", name: "Wall-Mounted Dashboards", section: "decor_monitors", x: 750, y: 130, width: 120, height: 40, color: "#1e293b", label: "Uptime Metrics", shortcut: "E", description: "Displaying real-time conversion stats and server health." },
  { id: "rug_workspace", name: "Silk Workspace Rug", section: "decor_rug", x: 740, y: 320, width: 140, height: 100, color: "#312e81", label: "Rug", shortcut: "R", description: "A fine indigo rug that ties the room together." },
  { id: "plant_desk", name: "Spiky Aloe", section: "decor_plant", x: 840, y: 220, width: 20, height: 30, color: "#22c55e", label: "Plant", shortcut: "E", description: "Low maintenance, high oxygen." },
  { id: "clock_wall", name: "Modern Analog Clock", section: "decor_clock", x: 720, y: 130, width: 30, height: 30, color: "#333", label: "Time", shortcut: "E", description: "The time is always now." },
  { id: "trash_can", name: "Recycle Bin", section: "decor_bin", x: 730, y: 260, width: 15, height: 20, color: "#312e81", label: "Bin", shortcut: "E", description: "Full of half-baked ideas and refactored code." },

  // --- CAREER HALL ---
  { id: "experience_wall", name: "Grand Chronicle Wall", section: "experience", x: 180, y: 140, width: 200, height: 60, color: "#f59e0b", label: "Journey", shortcut: "E", description: "Visual timeline of career milestones from 2020 to present." },
  { id: "statue_achievement", name: "Statue of Grit", section: "decor_statue", x: 420, y: 200, width: 40, height: 60, color: "#94a3b8", label: "Inspiration", shortcut: "E", description: "Commemorating the first major successful marketing campaign." },
  { id: "career_banners", name: "Legacy Banners", section: "decor_banners", x: 80, y: 140, width: 60, height: 100, color: "#5b21b6", label: "Values", shortcut: "E", description: "Banners detailing the core values of Creative Innovation." },
  { id: "exhibit_case_1", name: "Vanguard Trophy", section: "decor_trophy", x: 120, y: 300, width: 30, height: 30, color: "#ffd700", label: "Exhibit", shortcut: "E", description: "Awarded for exceptional user growth strategies." },
  { id: "velvet_rope", name: "Museum Rope", section: "decor_rope", x: 160, y: 220, width: 100, height: 5, color: "#7f1d1d", label: "Rope", shortcut: "E", description: "Please do not touch the exhibits." },

  // --- PROJECT LAB ---
  { id: "server_rack_main", name: "Mainframe Server", section: "decor_server", x: 600, y: -360, width: 50, height: 90, color: "#1e293b", label: "Infrastructure", shortcut: "E", description: "Housing over 50 client websites and custom web applications." },
  { id: "server_rack_sub", name: "Backup Node", section: "decor_server", x: 655, y: -360, width: 40, height: 80, color: "#1e293b", label: "Backup", shortcut: "E", description: "Redundancy is key to 100% uptime." },
  { id: "prototype_bench", name: "R&D Prototype Bench", section: "decor_bench", x: 800, y: -310, width: 120, height: 50, color: "#1e1b4b", label: "Lab Work", shortcut: "E", description: "Where experimental UI components and scripts are born." },
  { id: "hologram_projector", name: "Project Preview Hologram", section: "projects", x: 700, y: -200, width: 40, height: 40, color: "#06b6d4", label: "Live Preview", shortcut: "E", description: "A floating display showing the latest project in development." },
  { id: "tech_poster_1", name: "Algorithm Blueprint", section: "decor_poster", x: 950, y: -360, width: 40, height: 50, color: "#1e293b", label: "Blueprint", shortcut: "E", description: "A complex map of a lead generation engine." },

  // --- KNOWLEDGE LIBRARY ---
  { id: "bookshelf_dev", name: "The Coders Bible", section: "skills", x: -380, y: 150, width: 80, height: 60, color: "#451a03", label: "Dev Books", shortcut: "E", description: "Shelves full of books about Rust, Go, and React." },
  { id: "bookshelf_marketing", name: "Growth Grimoire", section: "skills", x: -250, y: 150, width: 80, height: 60, color: "#451a03", label: "Marketing Books", shortcut: "E", description: "Shelves full of books about Psychology and Persuasion." },
  { id: "study_table", name: "Research Desk", section: "decor_desk", x: -350, y: 350, width: 120, height: 60, color: "#78350f", label: "Study", shortcut: "E", description: "A quiet place for deep research and reading." },
  { id: "reading_lamp", name: "Bankers Lamp", section: "decor_lamp", x: -280, y: 355, width: 15, height: 15, color: "#166534", label: "Light", shortcut: "E", description: "Emits a soft green glow." },

  // --- ACHIEVEMENT GALLERY ---
  { id: "trophy_pedestal_1", name: "Gold SEO Cup", section: "decor_trophy", x: 1100, y: 150, width: 30, height: 40, color: "#f59e0b", label: "Award", shortcut: "E", description: "For hitting #1 ranking for high-volume keywords." },
  { id: "trophy_pedestal_2", name: "Tech Innovator Plaque", section: "decor_trophy", x: 1200, y: 150, width: 30, height: 40, color: "#94a3b8", label: "Award", shortcut: "E", description: "Recognized for building accessible web solutions." },
  { id: "gallery_bench", name: "Velvet Seat", section: "decor_bench", x: 1250, y: 350, width: 80, height: 30, color: "#7f1d1d", label: "Sit", shortcut: "E", description: "Admire the achievements from this comfortable seat." },

  // --- CONTACT LOUNGE ---
  { id: "luxury_sofa", name: "Chesterfield Sofa", section: "decor_sofa", x: 740, y: 750, width: 120, height: 50, color: "#450a0a", label: "Relax", shortcut: "E", description: "Deep crimson leather. Extremely comfortable." },
  { id: "lounge_table", name: "Marble Coffee Table", section: "decor_table", x: 775, y: 710, width: 50, height: 30, color: "#d1d5db", label: "Table", shortcut: "E", description: "Holding a fresh copy of Nixon's Resume." },
  { id: "bookshelf_lounge", name: "Philosophy Nook", section: "decor_books", x: 600, y: 600, width: 60, height: 120, color: "#451a03", label: "Books", shortcut: "E", description: "Philosophy and business strategy books." },

  // --- CREATIVE STUDIO ---
  { id: "easel_1", name: "Digital Canvas", section: "decor_easel", x: 1150, y: -300, width: 40, height: 60, color: "#fff", label: "Art", shortcut: "E", description: "A high-end drawing tablet with a stylus." },
  { id: "branding_wall", name: "Brand Identity Board", section: "decor_board", x: 1300, y: -360, width: 150, height: 60, color: "#f8fafc", label: "Moodboard", shortcut: "E", description: "Current branding concepts for Jakarta startups." },
  { id: "studio_plant", name: "Swiss Cheese Plant", section: "decor_plant", x: 1450, y: -310, width: 40, height: 40, color: "#166534", label: "Plant", shortcut: "E", description: "Adds life to the creative space." },

  // --- FOUNDER OFFICE ---
  { id: "executive_seat", name: "Founder's Throne", section: "about", x: 1750, y: -300, width: 60, height: 60, color: "#5b21b6", label: "Legacy", shortcut: "E", description: "Where the vision for the future is crafted." },
  { id: "secret_file", name: "Vision 2030 Roadmap", section: "decor_roadmap", x: 1850, y: -350, width: 30, height: 40, color: "#fff", label: "Redacted", shortcut: "E", description: "Top secret plans for global digital transformation." },
  { id: "office_window_large", name: "Floor-to-Ceiling Window", section: "decor_window", x: 1820, y: -200, width: 10, height: 150, color: "#93c5fd", label: "The View", shortcut: "E", description: "Overlooking the virtual city of Jak-OS." },

  // --- STRATEGY WAR ROOM ---
  { id: "war_table", name: "Grand Strategy Table", section: "decor_table", x: 700, y: -750, width: 200, height: 100, color: "#1e293b", label: "Tactics", shortcut: "E", description: "Where high-stakes marketing campaigns are planned." },
  { id: "war_map", name: "Market Dominance Map", section: "decor_map", x: 750, y: -850, width: 100, height: 60, color: "#ffd700", label: "The Map", shortcut: "E", description: "Showing current market share in the SEA region." },

  // --- REAL-TIME IMPACT CENTER ---
  { id: "impact_screen_large", name: "Master Command Center", section: "decor_impact", x: 650, y: 1050, width: 280, height: 120, color: "#0f172a", label: "Global Impact", shortcut: "E", description: "Visualizing million-dollar business growth across all handled accounts." },
  { id: "analytics_terminal", name: "SEO Insights Terminal", section: "experience", x: 600, y: 1250, width: 60, height: 40, color: "#1e293b", label: "Insights", shortcut: "E", description: "Analyzing search intent and organic traffic patterns." },
  { id: "data_server_cluster", name: "Analytics Cluster", section: "decor_server", x: 950, y: 1100, width: 50, height: 100, color: "#1e293b", label: "Cluster", shortcut: "E", description: "Processing billions of data points daily." },

  // --- OUTDOOR: TOWN SQUARE ---
  { id: "central_fountain", name: "The Fountain of Ideas", section: "decor_fountain", x: 750, y: 2000, width: 100, height: 100, color: "#0ea5e9", label: "Refresh", shortcut: "R", description: "A beautiful marble fountain. The sound is calming." },
  { id: "memorial_arch", name: "The Visionary Arch", section: "decor_arch", x: 750, y: 1600, width: 120, height: 40, color: "#312e81", label: "Welcome", shortcut: "E", description: "A grand entrance arch to the Nixon Portfolio HQ." },
  { id: "bench_square_1", name: "Park Bench", section: "decor_bench", x: 600, y: 1900, width: 40, height: 20, color: "#4a3324", label: "Rest", shortcut: "E", description: "A place to sit and think about the next big build." },
  { id: "bench_square_2", name: "Park Bench", section: "decor_bench", x: 900, y: 1900, width: 40, height: 20, color: "#4a3324", label: "Rest", shortcut: "E", description: "Perfect for watching the virtual sunset." },
  { id: "flower_bed_1", name: "Blooming Garden", section: "decor_flower", x: 450, y: 2200, width: 100, height: 40, color: "#e879f9", label: "Flowers", shortcut: "E", description: "Beautiful purple orchids." },
  { id: "flower_bed_2", name: "Blooming Garden", section: "decor_flower", x: 1050, y: 2200, width: 100, height: 40, color: "#e879f9", label: "Flowers", shortcut: "E", description: "Beautiful purple orchids." },
  { id: "lantern_post_1", name: "Iron Street Lamp", section: "decor_lamp", x: 700, y: 1750, width: 10, height: 10, color: "#fef08a", label: "Lamp", shortcut: "E", description: "Guides travelers in the night." },
  { id: "lantern_post_2", name: "Iron Street Lamp", section: "decor_lamp", x: 900, y: 1750, width: 10, height: 10, color: "#fef08a", label: "Lamp", shortcut: "E", description: "Guides travelers in the night." },
  { id: "statue_founder_outdoor", name: "Bronze Bust of Ambition", section: "decor_statue", x: 785, y: 2350, width: 30, height: 50, color: "#92400e", label: "Ambition", shortcut: "E", description: "Stay hungry, stay foolish." },
  
  // --- ADDED DENSITY OBJECTS ---
  { id: "plant_1", name: "Lush Potted Plant", section: "decor_plant", x: 600, y: 300, width: 25, height: 40, color: "#166534", label: "Plant", shortcut: "E", description: "Brings a bit of life to the workspace." },
  { id: "plant_2", name: "Lush Potted Plant", section: "decor_plant", x: 1000, y: 300, width: 25, height: 40, color: "#166534", label: "Plant", shortcut: "E", description: "Brings a bit of life to the workspace." },
  { id: "poster_1", name: "Tech Poster", section: "decor_poster", x: 650, y: 120, width: 30, height: 45, color: "#1e293b", label: "Poster", shortcut: "E", description: "A minimalist print of a vintage terminal." },
  { id: "poster_2", name: "Ad Campaign Poster", section: "decor_poster", x: 950, y: 130, width: 35, height: 50, color: "#1e293b", label: "Poster", shortcut: "E", description: "Highlighting successful growth loops." },
  { id: "rug_hall", name: "Long Runner Rug", section: "decor_rug", x: 100, y: 280, width: 350, height: 40, color: "#7f1d1d", label: "Rug", shortcut: "E", description: "Softens the sound of footsteps in the hall." },
  { id: "books_2", name: "Reference Books", section: "decor_books", x: 200, y: 350, width: 40, height: 20, color: "#451a03", label: "Books", shortcut: "E", description: "Stacks of documentation and marketing theory." },
  { id: "cabinet_1", name: "File Cabinet", section: "decor_drawer", x: 480, y: 150, width: 40, height: 50, color: "#3e2723", label: "Cabinet", shortcut: "E", description: "Full of campaign reports and case studies." },
  { id: "trophy_3", name: "Participation Trophy", section: "decor_trophy", x: 1150, y: 350, width: 20, height: 30, color: "#94a3b8", label: "Trophy", shortcut: "E", description: "Everyone's a winner here." },
  { id: "plant_studio", name: "Studio Fern", section: "decor_plant", x: 1200, y: -300, width: 30, height: 45, color: "#166534", label: "Fern", shortcut: "E", description: "Flourishing in the bright studio light." },
  { id: "desk_dev", name: "Auxiliary Workstation", section: "decor_desk", x: 680, y: -350, width: 80, height: 50, color: "#4a3324", label: "Desk", shortcut: "E", description: "A spare station for collaborative coding." },
  { id: "bench_garden_1", name: "Zen Bench", section: "decor_bench", x: -200, y: 2800, width: 50, height: 25, color: "#4a3324", label: "Bench", shortcut: "E", description: "A quiet place to reflect in the tech garden." },
  { id: "statue_monument", name: "The Monument of Code", section: "decor_statue", x: 2000, y: 2800, width: 80, height: 120, color: "#475569", label: "Monument", shortcut: "E", description: "Dedicated to the infinite potential of software." },
  { id: "tree_1", name: "Garden Oak", section: "decor_tree", x: -100, y: 1800, width: 60, height: 100, color: "#14532d", label: "Oak", shortcut: "E", description: "A symbol of steady, organic growth." },
  { id: "tree_2", name: "Garden Oak", section: "decor_tree", x: 1400, y: 1800, width: 60, height: 100, color: "#14532d", label: "Oak", shortcut: "E", description: "A symbol of steady, organic growth." },
  { id: "tree_3", name: "Garden Oak", section: "decor_tree", x: 700, y: 2600, width: 60, height: 100, color: "#14532d", label: "Oak", shortcut: "E", description: "A symbol of steady, organic growth." },
];

export const VISITOR_NPCS_DATA = [
  { id: "npc-sarah", type: "recruiter", name: "Sarah (Product Owner)", startX: 320, startY: 340, msg: "Your conversion metrics are outstanding!", hair: "#D81B60", shirt: "#8E24AA", skin: "#FFCC80" },
  { id: "npc-david", type: "developer", name: "David (DevOps Lead)", startX: 740, startY: -200, msg: "Deployment successful. 100% uptime achieved.", hair: "#212121", shirt: "#00ACC1", skin: "#FFD54F" },
  { id: "npc-celia", type: "designer", name: "Celia (Creative Director)", startX: 1300, startY: 410, msg: "The visual language here is very consistent.", hair: "#FFB300", shirt: "#43A047", skin: "#FFE082" },
  { id: "npc-founder", type: "founder", name: "The Founder", startX: 1750, startY: -280, msg: "The vision is becoming reality. Excellent work.", hair: "#ddd", shirt: "#312e81", skin: "#eee" },
  { id: "npc-merchant", type: "developer", name: "Old Librarian", startX: -200, startY: 300, msg: "Searching for the book of wisdom? It's in the code.", hair: "#555", shirt: "#333", skin: "#ccc" },
];

export const WINDOWS_LIST = [
  { x: 740, y: 120 - 54, w: 120, h: 42, room: "Main Workspace" },
  { x: 220, y: 120 - 54, w: 140, h: 42, room: "Career Hall" },
  { x: 730, y: -380 - 54, w: 140, h: 42, room: "Project Lab" },
  { x: 1210, y: 120 - 54, w: 140, h: 42, room: "Achievement Gallery" },
  { x: 1210, y: -380 - 54, w: 140, h: 42, room: "Creative Studio" },
  { x: 1710, y: -380 - 54, w: 100, h: 42, room: "Founder Office" },
  { x: 750, y: 560 - 54, w: 100, h: 42, room: "Contact Lounge" }
];

export const MEMORY_PILLARS = [
  { id: "mem-2023", year: "2023", title: "Scale Phase", x: 180, y: 260, desc: "Scaled a local business to 5x revenue via targeted SEO and UI revamp." },
  { id: "mem-2024", year: "2024", title: "Full-Stack Era", x: 180, y: 370, desc: "Mastered React + Node.js ecosystem, delivering seamless enterprise apps." },
  { id: "mem-2025", year: "2025", title: "The Present", x: 180, y: 480, desc: "Building the next generation of interactive digital portfolios." },
];

import React, { useEffect, useRef, useState } from "react";
import { soundEngine } from "../audio";
import { RoomObject, Particle, WalkableArea } from "../types";
import { 
  WALKABLE_AREAS, 
  ROOM_OBJECTS, 
  VISITOR_NPCS_DATA, 
  WINDOWS_LIST, 
  MEMORY_PILLARS 
} from "../data/gameData";
import { 
  Keyboard, Eye, DoorOpen, Laptop, Book, Cpu, Award, Trophy,
  Tv, MessageSquare, ShieldAlert, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Star, Sparkles
} from "lucide-react";

interface RetroGameMapProps {
  onInteract: (section: "about" | "projects" | "skills" | "experience" | "resume" | "contact") => void;
  activeSection: string | null;
  autoplay?: boolean;
  dayNight?: "morning" | "afternoon" | "golden-hour" | "night";
  weather?: "sunny" | "rainy" | "cloudy" | "foggy";
  onSecretPlantClick?: () => void;
  onQuestComplete?: (questKey: "about" | "resume" | "projects" | "experience" | "contact") => void;
  onNearbyObjectChange?: (obj: any | null) => void;
  
  // Immersive HUD integration properties
  discoveredSectors?: string[];
  onSectorsChange?: (sectors: string[]) => void;
  teleportTarget?: { x: number; y: number } | null;
  onClearTeleport?: () => void;
  onTriggerAchievement?: (id: string, title: string, desc: string) => void;
}

// Constants moved to src/data/gameData.ts

// Drawing helpers for decorative elements
const drawDecoration = (c: CanvasRenderingContext2D, d: any) => {
  c.save();
  // Drop shadows for floor-based components
  if (d.type !== "clock" && d.type !== "frame" && d.type !== "sticky" && d.type !== "chart") {
    c.fillStyle = "rgba(0, 0, 0, 0.28)";
    c.beginPath();
    c.ellipse(d.x + d.width / 2, d.y + d.height - 2, d.width / 2 + 1, 3.5, 0, 0, Math.PI * 2);
    c.fill();
  }

  const time = Date.now();

  switch (d.type) {
    case "clock": // Wall Clock
      c.fillStyle = "#2D1D2C";
      c.beginPath(); c.arc(d.x + 15, d.y + 15, 12, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#FFF";
      c.beginPath(); c.arc(d.x + 15, d.y + 15, 10, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "#444";
      c.lineWidth = 1.3;
      // hour/minute hands
      const hr = (time / 45000) % (Math.PI * 2);
      const mn = (time / 3800) % (Math.PI * 2);
      c.beginPath();
      c.moveTo(d.x + 15, d.y + 15);
      c.lineTo(d.x + 15 + Math.cos(hr) * 4.5, d.y + 15 + Math.sin(hr) * 4.5);
      c.stroke();
      c.lineWidth = 0.9;
      c.beginPath();
      c.moveTo(d.x + 15, d.y + 15);
      c.lineTo(d.x + 15 + Math.cos(mn) * 7.5, d.y + 15 + Math.sin(mn) * 7.5);
      c.stroke();
      // Tick details
      c.fillStyle = "#333";
      c.fillRect(d.x + 14.5, d.y + 6, 1, 2);
      c.fillRect(d.x + 14.5, d.y + 22, 1, 2);
      break;

    case "hanging-plant": { // Ceiling hanging plants that sway
      c.strokeStyle = "#6B5B52";
      c.lineWidth = 1;
      c.beginPath(); c.moveTo(d.x + 12, d.y - 12); c.lineTo(d.x + 12, d.y); c.stroke();
      c.fillStyle = "#A75D3D";
      c.fillRect(d.x + 4, d.y, 16, 8);
      const sway = Math.sin(time / 270 + d.x) * 2.5;
      c.fillStyle = "#2C6B37";
      c.beginPath();
      c.ellipse(d.x + 12, d.y + 3, 10, 4.5, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#1C4E24";
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(d.x + 7, d.y + 4);
      c.quadraticCurveTo(d.x + 4 + sway / 2, d.y + 15, d.x + 6 + sway, d.y + 26);
      c.moveTo(d.x + 17, d.y + 4);
      c.quadraticCurveTo(d.x + 20 - sway / 2, d.y + 13, d.x + 16 - sway, d.y + 23);
      c.stroke();
      c.fillStyle = "#43964E";
      c.fillRect(d.x + 3 + sway, d.y + 12, 3, 3.5);
      c.fillRect(d.x + 15 - sway, d.y + 15, 3.5, 3);
      break;
    }

    case "plant": { // Floor pot plant sways
      c.fillStyle = "#7A4A33";
      c.fillRect(d.x + 6, d.y + 18, d.width - 12, 14);
      c.fillStyle = "#5E3926";
      c.fillRect(d.x + 4, d.y + 16, d.width - 8, 3.5);
      const breathe = Math.sin(time / 310 + d.x) * 0.024;
      c.save();
      c.translate(d.x + d.width / 2, d.y + 16);
      c.scale(1 + breathe, 1 - breathe);
      c.fillStyle = "#1E5E20";
      c.beginPath();
      c.ellipse(-7, -8, 8, 11, -Math.PI / 5, 0, Math.PI * 2);
      c.ellipse(7, -8, 8, 11, Math.PI / 5, 0, Math.PI * 2);
      c.ellipse(0, -11, 9, 14, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#388E3C";
      c.beginPath();
      c.ellipse(-3.5, -6, 5.5, 8.5, -Math.PI / 5, 0, Math.PI * 2);
      c.ellipse(3.5, -6, 5.5, 8.5, Math.PI / 5, 0, Math.PI * 2);
      c.ellipse(0, -9, 6.5, 11, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
      break;
    }

    case "speakers":
      c.fillStyle = "#1C1C21";
      c.fillRect(d.x, d.y, d.width, d.height);
      c.fillStyle = "#2D2D35";
      c.beginPath(); c.arc(d.x + d.width / 2, d.y + 6, 3.5, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(d.x + d.width / 2, d.y + 16, 5.5, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#09090C";
      c.beginPath(); c.arc(d.x + d.width / 2, d.y + 16, 2.5, 0, Math.PI * 2); c.fill();
      break;

    case "coffee": // Coffee cup sways steam
      c.fillStyle = "#D9534F"; // Red Mug
      c.fillRect(d.x, d.y, d.width, d.height);
      c.fillStyle = "#5c3317"; // Brew surface
      c.fillRect(d.x + 1, d.y, d.width - 2, 1.8);
      c.strokeStyle = "#D9534F";
      c.lineWidth = 1;
      c.beginPath();
      c.arc(d.x + d.width, d.y + 3.5, 2, -Math.PI / 2, Math.PI / 2);
      c.stroke();
      // Steam animation
      const steam = (time / 280) % 7;
      c.strokeStyle = "rgba(255, 255, 255, 0.42)";
      c.lineWidth = 0.85;
      c.beginPath();
      c.moveTo(d.x + d.width / 2, d.y - 1 - steam);
      c.quadraticCurveTo(d.x + d.width / 2 + Math.sin(time / 90) * 1.5, d.y - 4 - steam, d.x + d.width / 2, d.y - 8 - steam);
      c.stroke();
      break;

    case "drawers":
      c.fillStyle = "#6E4D30";
      c.fillRect(d.x, d.y, d.width, d.height);
      c.fillStyle = "#46301D";
      c.fillRect(d.x, d.y, d.width, 3);
      c.fillStyle = "#553B25";
      c.fillRect(d.x + 2, d.y + 14, d.width - 4, 2);
      c.fillRect(d.x + 2, d.y + 28, d.width - 4, 2);
      c.fillStyle = "#CFD8DC";
      c.fillRect(d.x + d.width / 2 - 5, d.y + 6, 10, 2);
      c.fillRect(d.x + d.width / 2 - 5, d.y + 19, 10, 2);
      c.fillRect(d.x + d.width / 2 - 5, d.y + 33, 10, 2);
      break;

    case "server": { // Flashing Server Core Nodes
      c.fillStyle = "#1E293B";
      c.fillRect(d.x, d.y, d.width, d.height);
      c.fillStyle = "#0A0F1D";
      c.fillRect(d.x + 3, d.y + 3, d.width - 6, d.height - 6);
      for (let i = 0; i < 6; i++) {
        const bladeY = d.y + 6 + (i * 11);
        c.fillStyle = "#334155";
        c.fillRect(d.x + 4, bladeY, d.width - 8, 2.5);
        const pulse = Math.sin(time / (120 + i * 40)) > 0;
        c.fillStyle = pulse ? (i % 3 === 0 ? "#10B981" : i % 3 === 1 ? "#3B82F6" : "#EF4444") : "#1E1F29";
        c.fillRect(d.x + d.width - 11, bladeY, 2.5, 1.8);
        c.fillStyle = !pulse ? "#FFC03D" : "#1E1F29";
        c.fillRect(d.x + d.width - 7, bladeY, 2.5, 1.8);
      }
      break;
    }

    case "whiteboard":
      c.fillStyle = "#94A3B8";
      c.fillRect(d.x + 8, d.y, 3, d.height);
      c.fillRect(d.x + d.width - 11, d.y, 3, d.height);
      c.fillStyle = "#F8FAFC";
      c.fillRect(d.x, d.y + 3, d.width, d.height - 10);
      c.strokeStyle = "#334155";
      c.lineWidth = 2;
      c.strokeRect(d.x, d.y + 3, d.width, d.height - 10);
      c.strokeStyle = "#EC4899";
      c.lineWidth = 1.1;
      c.beginPath();
      c.moveTo(d.x + 12, d.y + 12);
      c.lineTo(d.x + d.width / 2, d.y + 24);
      c.lineTo(d.x + d.width - 12, d.y + 12);
      c.stroke();
      c.strokeStyle = "#0EA5E9";
      c.beginPath();
      c.moveTo(d.x + d.width / 2, d.y + 24);
      c.lineTo(d.x + d.width / 2, d.y + d.height - 14);
      c.stroke();
      c.fillStyle = "#0F172A";
      c.font = "bold 5px sans-serif";
      c.fillText("VITE SEO", d.x + 6, d.y + 11);
      break;

    case "books":
      c.fillStyle = "#D9534F"; c.fillRect(d.x, d.y + 13, d.width, 5.5);
      c.fillStyle = "#337AB7"; c.fillRect(d.x + 2, d.y + 8, d.width - 4, 5);
      c.fillStyle = "#5CB85C"; c.fillRect(d.x + 4, d.y + 3, d.width - 8, 5);
      c.fillStyle = "#FFF";
      c.fillRect(d.x + 3, d.y + 14.5, 2, 2);
      c.fillRect(d.x + 5, d.y + 9.5, 2, 2);
      break;

    case "cables":
      c.strokeStyle = "#3B3B42";
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(d.x, d.y);
      c.bezierCurveTo(d.x + d.width / 3, d.y + 6, d.x + (d.width * 2) / 3, d.y - 6, d.x + d.width, d.y);
      c.stroke();
      break;

    case "cabinet":
      c.fillStyle = "#533722";
      c.fillRect(d.x, d.y + 10, d.width, d.height - 10);
      c.fillStyle = "rgba(224, 242, 254, 0.25)";
      c.fillRect(d.x + 4, d.y + 14, d.width - 8, d.height - 27);
      c.strokeStyle = "#E2E8F0";
      c.strokeRect(d.x + 4, d.y + 14, d.width - 8, d.height - 27);
      c.fillStyle = "#FFC03D";
      c.beginPath();
      c.arc(d.x + 20, d.y + 25, 4, 0, Math.PI * 2);
      c.arc(d.x + d.width - 20, d.y + 25, 4, 0, Math.PI * 2);
      c.fill();
      const stPulse = 0.45 + Math.sin(time / 160) * 0.4;
      c.fillStyle = `rgba(255, 255, 255, ${stPulse})`;
      c.fillRect(d.x + d.width / 2, d.y + 22, 2, 2);
      break;

    case "frame":
      c.fillStyle = "#3E2723";
      c.fillRect(d.x, d.y, d.width, d.height);
      c.fillStyle = "#FAFAFA";
      c.fillRect(d.x + 2, d.y + 2, d.width - 4, d.height - 4);
      c.fillStyle = "#2D3748";
      c.fillRect(d.x + 5, d.y + 6, d.width - 10, 1.5);
      c.fillRect(d.x + 5, d.y + 11, d.width - 10, 1);
      c.fillRect(d.x + 5, d.y + 15, d.width - 10, 1);
      c.fillStyle = "#EAB308";
      c.beginPath(); c.arc(d.x + d.width / 2, d.y + d.height - 6, 2, 0, Math.PI * 2); c.fill();
      break;

    case "board":
      c.fillStyle = "#3E2723";
      c.fillRect(d.x + 10, d.y + 28, 4, d.height - 28);
      c.fillRect(d.x + d.width - 14, d.y + 28, 4, d.height - 28);
      c.fillStyle = "#0F172A";
      c.fillRect(d.x, d.y, d.width, 32);
      c.strokeStyle = "#3E2723";
      c.lineWidth = 2.2;
      c.strokeRect(d.x, d.y, d.width, 32);
      c.strokeStyle = "#38BDF8";
      c.lineWidth = 1.3;
      c.beginPath();
      c.moveTo(d.x + 6, d.y + 22);
      c.lineTo(d.x + 20, d.y + 13);
      c.lineTo(d.x + 35, d.y + 24);
      c.lineTo(d.x + 50, d.y + 7);
      c.lineTo(d.x + 72, d.y + 12);
      c.stroke();
      c.fillStyle = "#FFC03D";
      c.font = "bold 4px sans-serif";
      c.fillText("CONVERSION META", d.x + 5, d.y + 6);
      break;

    case "lamp": { // Golden Floor Spot Lamp throwing animated glow cone
      c.fillStyle = "#1E293B";
      c.fillRect(d.x + 4, d.y + d.height - 4, d.width - 8, 4);
      c.fillStyle = "#D4AF37";
      c.fillRect(d.x + d.width / 2 - 1.2, d.y + 7, 2.4, d.height - 11);
      c.fillStyle = "#F8FAFC";
      c.beginPath();
      c.moveTo(d.x + d.width / 2 - 7, d.y + 7);
      c.lineTo(d.x + d.width / 2 + 7, d.y + 7);
      c.lineTo(d.x + d.width / 2 + 4.2, d.y);
      c.lineTo(d.x + d.width / 2 - 4.2, d.y);
      c.closePath();
      c.fill();

      // Spotlight glow cone overlay
      const hum = 0.5 + Math.sin(time / 70) * 0.12 + (Math.random() > 0.99 ? -0.15 : 0);
      const radBeam = c.createRadialGradient(d.x + d.width / 2, d.y - 12, 4, d.x + d.width / 2, d.y - 110, 100);
      radBeam.addColorStop(0, `rgba(255, 235, 120, ${0.44 * hum})`);
      radBeam.addColorStop(0.5, `rgba(251, 191, 36, ${0.16 * hum})`);
      radBeam.addColorStop(1, "rgba(255, 255, 255, 0)");
      c.fillStyle = radBeam;
      c.beginPath();
      c.moveTo(d.x + d.width / 2, d.y);
      c.lineTo(d.x - 60, d.y - 130);
      c.lineTo(d.x + 80, d.y - 130);
      c.closePath();
      c.fill();
      break;
    }

    case "chart":
      c.fillStyle = "#1E293B";
      c.fillRect(d.x, d.y, d.width, d.height);
      c.strokeStyle = "#475569";
      c.strokeRect(d.x, d.y, d.width, d.height);
      c.strokeStyle = "rgba(255, 192, 61, 0.09)";
      c.lineWidth = 0.5;
      for (let i = d.x + 4; i < d.x + d.width; i += 6) {
        c.beginPath(); c.moveTo(i, d.y); c.lineTo(i, d.y + d.height); c.stroke();
      }
      c.strokeStyle = "#10B981";
      c.lineWidth = 1.3;
      c.beginPath();
      c.moveTo(d.x + 4, d.y + d.height - 4);
      c.quadraticCurveTo(d.x + d.width / 2, d.y + d.height - 5, d.x + d.width - 4, d.y + 4);
      c.stroke();
      break;

    case "sticky":
      c.fillStyle = "#3E2723";
      c.fillRect(d.x, d.y, d.width, d.height);
      c.fillStyle = "#FB7185"; c.fillRect(d.x + 4, d.y + 4, 8, 8); // Red
      c.fillStyle = "#FBBF24"; c.fillRect(d.x + 14, d.y + 4, 8, 8); // Yellow
      c.fillStyle = "#34D399"; c.fillRect(d.x + 24, d.y + 4, 8, 8); // Green
      c.fillStyle = "#60A5FA"; c.fillRect(d.x + 9, d.y + 15, 8, 8); // Blue
      c.fillStyle = "#F472B6"; c.fillRect(d.x + 19, d.y + 15, 8, 8); // Pink
      break;

    default:
      c.fillStyle = "#5C3D2E";
      c.fillRect(d.x, d.y, d.width, d.height);
      break;
  }
  c.restore();
};

// Window system outside renderer
const drawWindow = (
  c: CanvasRenderingContext2D,
  wx: number,
  wy: number,
  ww: number,
  wh: number,
  dayNight: string,
  weather: string
) => {
  c.save();
  // Outside wall frame backing shadow
  c.fillStyle = "rgba(0, 0, 0, 0.6)";
  c.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);

  // Background outside sky gradient depending on time of day
  let skyGlow = c.createLinearGradient(wx, wy, wx, wy + wh);
  if (dayNight === "morning") {
    skyGlow.addColorStop(0, "#FDBA74"); // warm peach
    skyGlow.addColorStop(1, "#818CF8"); // sunrise indigo-blue
  } else if (dayNight === "afternoon") {
    skyGlow.addColorStop(0, "#0EA5E9"); // bright sky blue
    skyGlow.addColorStop(1, "#38BDF8"); // soft white-blue daylight
  } else if (dayNight === "golden-hour") {
    skyGlow.addColorStop(0, "#E11D48"); // sunset rose
    skyGlow.addColorStop(0.5, "#F97316"); // amber core
    skyGlow.addColorStop(1, "#581C87"); // dusky lavender
  } else {
    // night
    skyGlow.addColorStop(0, "#090D1A"); // deep starry midnight
    skyGlow.addColorStop(1, "#1E1B4B"); // cosmic navy
  }
  c.fillStyle = skyGlow;
  c.fillRect(wx, wy, ww, wh);

  const time = Date.now();

  // Outside celestial bodies
  if (dayNight === "night") {
    // Twinkling stars
    c.fillStyle = "#FFF";
    for (let i = 0; i < 6; i++) {
      const sx = wx + 10 + (i * 22) % (ww - 20);
      const sy = wy + 6 + (i * 13 + Math.sin(time / 230 + i) * 2.5) % (wh - 14);
      const alpha = 0.2 + Math.abs(Math.sin(time / 200 + i)) * 0.8;
      c.save();
      c.globalAlpha = alpha;
      c.fillRect(sx, sy, 1.5, 1.5);
      c.restore();
    }
    // Silver crescent moon
    c.fillStyle = "#F1F5F9";
    c.beginPath(); c.arc(wx + ww - 24, wy + 12, 4.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#090D1A"; // shadow mask moon shape
    c.beginPath(); c.arc(wx + ww - 21, wy + 12, 4.2, 0, Math.PI * 2); c.fill();
  } else if (dayNight === "morning" || dayNight === "golden-hour") {
    // Glowing orbital disk
    c.fillStyle = dayNight === "morning" ? "#FEF08A" : "#FDA4AF";
    c.beginPath();
    c.arc(wx + ww / 2 - 12, wy + wh - 4, 8, 0, Math.PI * 2);
    c.fill();
  }

  // Scrolling clouds
  const cloudOffset = (time / 160) % (ww + 60);
  if (weather === "cloudy" || weather === "rainy" || weather === "foggy") {
    c.fillStyle = weather === "rainy" ? "rgba(100, 116, 139, 0.44)" : "rgba(241, 245, 249, 0.32)";
    c.beginPath();
    c.arc(wx - 25 + cloudOffset, wy + 14, 7.5, 0, Math.PI * 2);
    c.arc(wx - 14 + cloudOffset, wy + 10, 10.5, 0, Math.PI * 2);
    c.arc(wx - 3 + cloudOffset, wy + 13, 6.5, 0, Math.PI * 2);
    c.fill();
  }

  // Sliding droplets hitting glass panes
  if (weather === "rainy") {
    c.strokeStyle = "rgba(186, 230, 253, 0.38)";
    c.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const dropY = wy + 4 + (time / 7 + i * 18) % (wh - 8);
      const dropX = wx + 12 + (i * 30) % (ww - 24);
      c.beginPath();
      c.moveTo(dropX, dropY);
      c.lineTo(dropX - 1.2, dropY + 5.5);
      c.stroke();
    }
  }

  // Diagonal static window pane glare reflections
  c.fillStyle = "rgba(255, 255, 255, 0.06)";
  c.beginPath();
  c.moveTo(wx + 8, wy);
  c.lineTo(wx + 22, wy);
  c.lineTo(wx + 10, wy + wh);
  c.lineTo(wx - 4, wy + wh);
  c.closePath();
  c.fill();

  c.beginPath();
  c.moveTo(wx + ww - 28, wy);
  c.lineTo(wx + ww - 14, wy);
  c.lineTo(wx + ww - 24, wy + wh);
  c.lineTo(wx + ww - 38, wy + wh);
  c.closePath();
  c.fill();

  // Glass Frame structural borders
  c.strokeStyle = "#4D282E";
  c.lineWidth = 3;
  c.strokeRect(wx, wy, ww, wh);

  // Window grid division cross
  c.strokeStyle = "#381B21";
  c.lineWidth = 1.3;
  c.beginPath();
  c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh);
  c.moveTo(wx, wy + wh / 2); c.lineTo(wx + ww, wy + wh / 2);
  c.stroke();

  c.restore();
};

// Windows, walls definitions removed

export function RetroGameMap({ 
  onInteract, 
  activeSection, 
  autoplay = false,
  dayNight = "night",
  weather = "sunny",
  onSecretPlantClick,
  onQuestComplete,
  onNearbyObjectChange,
  
  discoveredSectors = ["workspace"],
  onSectorsChange,
  teleportTarget = null,
  onClearTeleport,
  onTriggerAchievement
}: RetroGameMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Smooth cinematic camera positions focusing on the much larger map (1600x1000 bounds)
  const cameraXRef = useRef(800);
  const cameraYRef = useRef(320);
  const cameraZoomRef = useRef(1.0);
  const shakeIntensityRef = useRef(0);
  const autoplayTimerRef = useRef(0);

  const [avatarIndex, setAvatarIndex] = useState(0);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const showMiniMapRef = useRef(true);

  useEffect(() => {
    showMiniMapRef.current = showMiniMap;
  }, [showMiniMap]);

  useEffect(() => {
    const handleHeavyShake = (e: Event) => {
      const customEvent = e as CustomEvent;
      const intensity = customEvent.detail?.intensity || 10;
      shakeIntensityRef.current = intensity;
    };
    window.addEventListener("heavy-sound-shaken", handleHeavyShake);
    return () => {
      window.removeEventListener("heavy-sound-shaken", handleHeavyShake);
    };
  }, []);

  const isIntroActiveRef = useRef(true);
  const introTickRef = useRef(0);

  // Monitor teleport actions in real time
  useEffect(() => {
    if (teleportTarget) {
      playerRef.current.x = teleportTarget.x - playerRef.current.width / 2;
      playerRef.current.y = teleportTarget.y - playerRef.current.height / 2;
      cameraXRef.current = teleportTarget.x;
      cameraYRef.current = teleportTarget.y;
      targetMoveRef.current = null;
      shakeIntensityRef.current = 22; // premium visual warp ripple
      if (onClearTeleport) onClearTeleport();
    }
  }, [teleportTarget, onClearTeleport]);

  // Dimensions of canvas tracked dynamically to support true 100vw/100vh viewport ratios
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Player position (virtual coordinates inside the 1600x1000 world box)
  const playerRef = useRef({
    x: 800,
    y: 320,
    vx: 0,
    vy: 0,
    width: 26,
    height: 42,
    speed: 1.2, 
    friction: 0.88,
    maxSpeed: 6.5,
    direction: "down" as "up" | "down" | "left" | "right",
    isMoving: false,
    animFrame: 0,
    animTimer: 0,
    stepTimer: 0,
    blinking: false,
    blinkTimer: 0
  });
  const nixRef = useRef({
    x: 720,
    y: 280,
    targetX: 720,
    targetY: 280,
    hoverOffset: 0,
    messageTimeout: 0,
    currentMessage: "Hello! I am NIX, your AI Companion! Press E to explore.",
    opacity: 0,
  });

  const [debugState, setDebugState] = useState({ x: 800, y: 320, vx: 0, vy: 0, dir: 'down', colliding: false });
  const debugActive = false;



  const targetMoveRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const [nearbyObject, setNearbyObject] = useState<any | null>(null);
  const [nearbyMemory, setNearbyMemory] = useState<typeof MEMORY_PILLARS[0] | null>(null);
  const [isNearImpactCenter, setIsNearImpactCenter] = useState(false);
  const particlesRef = useRef<Particle[]>([]);

  // Selected avatar styles
  const avatars = [
    { name: "Web Wizard", shirt: "#305F41", hair: "#2E1C0C", skin: "#E8B08A" },
    { name: "Ad Strategist", shirt: "#2B4C7E", hair: "#8C4F2B", skin: "#F6C597" },
    { name: "UI Designer", shirt: "#8B2635", hair: "#E6C229", skin: "#DFC2B2" }
  ];

  // Dynamic full-bleed container resizing observer (strictly 100% of available screen space)
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: Math.max(entry.contentRect.width, 320),
          height: Math.max(entry.contentRect.height, 240)
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    if (autoplay) return;

    
    const handleKeyDown = (e: KeyboardEvent) => {
      // FIX: Mobile input and any other interaction instantly cancels intro.
      if (isIntroActiveRef.current && !autoplay) {
         isIntroActiveRef.current = false;
      }
      
      const key = e.key?.toLowerCase();
      if (!key) return;

      
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key)) {
        e.preventDefault();
      }

      keysRef.current[key] = true;
      keysRef.current[e.key] = true;

      // Reset pathing upon manual user inputs
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key) || ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
        targetMoveRef.current = null;
      }

      if (key === "m") {
        soundEngine.playBeep(600, 0.05, "triangle");
        setShowMiniMap((prev) => !prev);
      }

      if (key === "e" && nearbyObject) {
        if (nearbyObject.id === "about" || nearbyObject.id === "resume") {
          soundEngine.playHeavyInteract();
        } else {
          soundEngine.playInteract();
        }
        onInteract(nearbyObject.section);
        if (onQuestComplete) {
          onQuestComplete(nearbyObject.id as any);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
      keysRef.current[e.key] = false;
    };

    
    const handleJoystick = (e: CustomEvent) => {
       const keys = e.detail;
       if (!keys) return;
       
       if (isIntroActiveRef.current && !autoplay) {
         isIntroActiveRef.current = false;
       }

       const possible = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
       possible.forEach(k => {
           keysRef.current[k] = false;
       });
       
       keys.forEach((k: string) => {
           keysRef.current[k.toLowerCase()] = true;
       });
       targetMoveRef.current = null;
    };

    window.addEventListener("vJoystick", handleJoystick as EventListener);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      
      window.removeEventListener("vJoystick", handleJoystick as EventListener);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [nearbyObject, onInteract, autoplay, onQuestComplete]);

  // Main tick and draw rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDestroyed = false;

    // Populate ambient particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: Math.random() * 4000 - 1500,
          y: Math.random() * 4000 - 1500,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: -Math.random() * 0.3 - 0.1,
          opacity: Math.random() * 0.5 + 0.2,
          maxLife: 400 + Math.random() * 400,
          life: Math.random() * 400,
          color: Math.random() > 0.5 ? "#f59e0b" : "#818cf8"
        });
      }
    }

    // Checking collision boundaries in our expanded walkable areas grid
    const isInsideWalkable = (x: number, y: number): boolean => {
      return WALKABLE_AREAS.some(area => x >= area.x1 && x <= area.x2 && y >= area.y1 && y <= area.y2);
    };

    const isCollide = (x: number, y: number, w: number, h: number): boolean => {
      const feetX1 = x + 4;
      const feetX2 = x + w - 4;
      const feetY1 = y + h - 10;
      const feetY2 = y + h - 1;

      // Must fit fully inside walkable coordinates
      if (!isInsideWalkable(feetX1, feetY1) || !isInsideWalkable(feetX2, feetY1) ||
          !isInsideWalkable(feetX1, feetY2) || !isInsideWalkable(feetX2, feetY2)) {
        return true;
      }

      // Hit standard static items
      for (const obj of ROOM_OBJECTS) {
        // Do not collide with floor decorations or trigger items
        if (obj.id.includes('rug') || obj.id.includes('plant') || obj.id.includes('banner') || obj.id.includes('rope')) continue;

        if (
          x + 6 < obj.x + obj.width &&
          x + w - 6 > obj.x &&
          y + h - 15 < obj.y + obj.height &&
          y + h - 2 > obj.y
        ) {
          return true;
        }
      }
      return false;
    };

    // Paint Map function
    const drawMap = (c: CanvasRenderingContext2D) => {
      c.fillStyle = "#0E0608"; // Outer dark void
      c.fillRect(-2000, -2000, 5000, 6000);

      // 1. DRAW SEAMLESS AREA FLOORS
      WALKABLE_AREAS.forEach((area) => {
        c.save();
        
        if (area.isOutdoor) {
          // Outdoor: Town Square / Garden
          c.fillStyle = area.name.includes("Garden") ? "#064e3b" : "#1e1b4b"; 
          c.fillRect(area.x1, area.y1, area.x2 - area.x1, area.y2 - area.y1);
          
          // Add some procedural floor details (cracks/stones)
          c.strokeStyle = "rgba(255,255,255,0.05)";
          c.lineWidth = 1;
          for (let tx = area.x1 + 60; tx < area.x2; tx += 120) {
            for (let ty = area.y1 + 60; ty < area.y2; ty += 120) {
               if (Math.random() > 0.6) {
                 c.strokeRect(tx, ty, 40, 40);
               }
            }
          }
        } else {
          // Indoor
          let floorFill = "#1e1b4b"; 
          let highlight = "#312e81"; 

          if (area.name === "Main Workspace") {
            floorFill = "#0f172a"; highlight = "#1e293b";
          } else if (area.name === "Career Hall") {
            floorFill = "#2b1c31"; highlight = "#4a1d41";
          } else if (area.name === "Project Lab") {
            floorFill = "#0f172a"; highlight = "#06b6d4";
          } else if (area.name === "Knowledge Library") {
            floorFill = "#431407"; highlight = "#78350f"; 
          } else if (area.name === "Founder Office") {
            floorFill = "#1e1b4b"; highlight = "#5b21b6"; 
          }

          c.fillStyle = floorFill;
          c.fillRect(area.x1, area.y1, area.x2 - area.x1, area.y2 - area.y1);
          
          // Grid lines for "digital" feel in some rooms
          if (area.name.includes("Lab") || area.name.includes("Center")) {
            c.strokeStyle = highlight;
            c.globalAlpha = 0.1;
            c.beginPath();
            for(let x = area.x1; x < area.x2; x += 40) {
              c.moveTo(x, area.y1); c.lineTo(x, area.y2);
            }
            for(let y = area.y1; y < area.y2; y += 40) {
              c.moveTo(area.x1, y); c.lineTo(area.x2, y);
            }
            c.stroke();
          }

          // Floor Trim
          c.strokeStyle = highlight;
          c.globalAlpha = 0.4;
          c.strokeRect(area.x1, area.y1, area.x2 - area.x1, area.y2 - area.y1);
        }
        c.restore();

        // DRAW WALL TRIMS
        if (!area.isOutdoor) {
          c.save();
          c.fillStyle = "#0a0a0a";
          c.fillRect(area.x1 - 15, area.y1 - 30, area.x2 - area.x1 + 30, 30);
          c.fillStyle = "#333";
          c.fillRect(area.x1 - 15, area.y1 - 6, area.x2 - area.x1 + 30, 6);
          c.restore();
        }

        // ROOM LABELS (Very Subtle)
        c.save();
        c.fillStyle = "rgba(255, 255, 255, 0.04)";
        c.font = "900 48px sans-serif";
        c.textAlign = "center";
        c.fillText(area.name.toUpperCase(), (area.x1 + area.x2)/2, (area.y1 + area.y2)/2);
        c.restore();
      });

      // Special Decorations
      WINDOWS_LIST.forEach((win) => {
        const area = WALKABLE_AREAS.find(a => a.name === win.room);
        if (area) drawWindow(c, win.x, win.y, win.w, win.h, dayNight || "night", weather || "sunny");
      });

      // Memory Pillars
      MEMORY_PILLARS.forEach((p) => {
        c.save();
        c.fillStyle = "rgba(0,0,0,0.3)";
        c.beginPath(); c.ellipse(p.x, p.y + 10, 15, 5, 0, 0, Math.PI*2); c.fill();
        c.fillStyle = "#f59e0b";
        c.fillRect(p.x - 10, p.y - 20, 20, 30);
        c.fillStyle = "#fff";
        c.font = "bold 10px sans-serif";
        c.textAlign = "center";
        c.fillText(p.year, p.x, p.y);
        c.restore();
      });

      // 5. DRAW ACHIEVEMENT GALLERY ROTATING CENTERPIECE
      c.save();
      const crystalX = 1300;
      const crystalY = 300;
      c.fillStyle = "rgba(0,0,0,0.5)";
      c.beginPath(); c.ellipse(crystalX, crystalY + 24, 20, 6, 0, 0, Math.PI*2); c.fill();
      c.fillStyle = "#4338CA";
      c.fillRect(crystalX - 12, crystalY + 6, 24, 18);
      c.fillStyle = "#FFC03D";
      const hoverBounce = Math.sin(Date.now() / 400) * 4;
      c.beginPath();
      c.moveTo(crystalX, crystalY - 26 + hoverBounce);
      c.lineTo(crystalX + 9, crystalY - 15 + hoverBounce);
      c.lineTo(crystalX, crystalY - 4 + hoverBounce);
      c.lineTo(crystalX - 9, crystalY - 15 + hoverBounce);
      c.closePath();
      c.fill();
      c.restore();

      // ROOM OBJECTS
      ROOM_OBJECTS.forEach((obj) => {
        const hover = nearbyObject?.id === obj.id;
        drawRoomObject(c, obj, hover);
      });

      // DEBUG COLLIDERS
      if (debugActive) {
        c.save();
        c.strokeStyle = "rgba(255, 0, 0, 0.8)";
        c.lineWidth = 2;
        c.strokeRect(playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height);
        c.restore();
      }

      // 8. VIGNETTE & POST-PROCESS
      const vcx = playerRef.current.x + playerRef.current.width / 2;
      const vcy = playerRef.current.y + playerRef.current.height / 2;
      const vignette = c.createRadialGradient(vcx, vcy, 100, vcx, vcy, 600);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.4)");
      c.fillStyle = vignette;
      c.fillRect(vcx - 800, vcy - 600, 1600, 1200);

      c.restore();
    };

    const drawRoomObject = (c: CanvasRenderingContext2D, o: RoomObject, hover: boolean) => {
      c.save();
      const time = Date.now();
      
      // Premium Shadow with soft blur simulation
      c.fillStyle = "rgba(0,0,0,0.3)";
      c.beginPath();
      c.ellipse(o.x + o.width/2, o.y + o.height - 2, o.width/2 + 4, 6, 0, 0, Math.PI*2);
      c.fill();

      if (hover) {
        c.shadowColor = "#f59e0b";
        c.shadowBlur = 20;
        c.strokeStyle = "#f59e0b";
        c.lineWidth = 3;
        c.strokeRect(o.x - 4, o.y - 4, o.width + 8, o.height + 8);
      }

      if (o.id.includes("desk")) {
        // Handcrafted Desk
        c.fillStyle = "#3e2723"; // Darker wood
        c.fillRect(o.x, o.y + 15, o.width, o.height - 15);
        c.fillStyle = "#5d4037"; // Lighter wood top
        c.fillRect(o.x - 5, o.y + 10, o.width + 10, 8);
        
        // Desk details
        c.fillStyle = "rgba(0,0,0,0.2)";
        c.fillRect(o.x + 10, o.y + 18, 20, 2); // Drawer line
        c.fillRect(o.x + o.width - 30, o.y + 18, 20, 2);
        
        // Items on desk
        c.fillStyle = "#222"; // Keyboard
        c.fillRect(o.x + o.width/2 - 20, o.y + 12, 40, 4);
        c.fillStyle = "#f59e0b"; // Coffee Mug
        c.fillRect(o.x + 15, o.y + 2, 8, 8);
        c.fillStyle = "#fff"; // Paper
        c.fillRect(o.x + o.width - 25, o.y + 5, 12, 14);
      } else if (o.id.includes("laptop")) {
        // Detailed Laptop
        c.fillStyle = "#1a1a1a";
        c.fillRect(o.x, o.y + 12, o.width, 4); // base
        c.save();
        const tilt = Math.sin(time / 500) * 0.05;
        c.translate(o.x + o.width/2, o.y + 12);
        c.rotate(tilt);
        c.fillStyle = "#333";
        c.fillRect(-o.width/2, -14, o.width, 14); // screen
        c.fillStyle = "#06b6d4"; // Cyan glow
        c.globalAlpha = 0.7 + Math.sin(time/150)*0.2;
        c.fillRect(-o.width/2 + 2, -12, o.width - 4, 10);
        // Code lines
        c.fillStyle = "rgba(255,255,255,0.4)";
        for(let i=0; i<3; i++) {
          c.fillRect(-o.width/2 + 4, -10 + i*3, (o.width - 12) * Math.random(), 1);
        }
        c.restore();
      } else if (o.id.includes("shelf") || o.id.includes("books")) {
        // Handcrafted Bookshelf
        c.fillStyle = o.color || "#451a03";
        c.fillRect(o.x, o.y, o.width, o.height);
        c.fillStyle = "rgba(0,0,0,0.3)";
        c.fillRect(o.x, o.y + o.height/2, o.width, 4); // shelf divider
        
        for (let i=4; i < o.width - 8; i+=10) {
           const h = 15 + Math.random() * 15;
           c.fillStyle = `hsl(${(i * 137) % 360}, 40%, 45%)`;
           c.fillRect(o.x + i, o.y + 5 + (25 - h), 7, h); // upper shelf
           c.fillStyle = `hsl(${(i * 157) % 360}, 40%, 45%)`;
           c.fillRect(o.x + i, o.y + o.height/2 + 5 + (20 - h/2), 7, h/2 + 10); // lower shelf
        }
        // Trim
        c.strokeStyle = "rgba(255,255,255,0.1)";
        c.strokeRect(o.x, o.y, o.width, o.height);
      } else if (o.id.includes("statue")) {
        // Detailed Statue
        c.fillStyle = "#475569"; // Stone base
        c.fillRect(o.x, o.y + o.height - 15, o.width, 15);
        c.fillStyle = o.color; // Bronze/Stone
        c.beginPath();
        c.moveTo(o.x + o.width/2, o.y);
        c.lineTo(o.x + o.width, o.y + o.height - 15);
        c.lineTo(o.x, o.y + o.height - 15);
        c.closePath();
        c.fill();
        c.beginPath();
        c.arc(o.x + o.width/2, o.y + 10, 12, 0, Math.PI*2);
        c.fill();
      } else if (o.id.includes("server")) {
        // High-Tech Server Rack
        c.fillStyle = "#0f172a";
        c.fillRect(o.x, o.y, o.width, o.height);
        for(let i=0; i<8; i++) {
          const sy = o.y + 10 + i * 10;
          c.fillStyle = "#1e293b";
          c.fillRect(o.x + 5, sy, o.width - 10, 2);
          const active = Math.sin(time / 200 + i) > 0;
          c.fillStyle = active ? "#10b981" : "#064e3b";
          c.fillRect(o.x + o.width - 10, sy, 4, 3);
        }
      } else if (o.id.includes("fountain")) {
        // Detailed Fountain
        c.fillStyle = "#cbd5e1";
        c.beginPath(); c.arc(o.x + o.width/2, o.y + o.height/2, o.width/2, 0, Math.PI*2); c.fill();
        c.fillStyle = "#94a3b8";
        c.beginPath(); c.arc(o.x + o.width/2, o.y + o.height/2, o.width/2 - 8, 0, Math.PI*2); c.fill();
        // Water layers
        const poolSize = o.width/2 - 12;
        const waterPulse = Math.sin(time/400) * 2;
        c.fillStyle = "#38bdf8";
        c.beginPath(); c.arc(o.x + o.width/2, o.y + o.height/2, poolSize + waterPulse, 0, Math.PI*2); c.fill();
        c.fillStyle = "#7dd3fc";
        c.beginPath(); c.arc(o.x + o.width/2, o.y + o.height/2, poolSize/2 + waterPulse/2, 0, Math.PI*2); c.fill();
      } else if (o.id.includes("tree")) {
        // Stylized RPG Tree
        c.fillStyle = "#3e2723";
        c.fillRect(o.x + o.width/2 - 6, o.y + o.height - 25, 12, 25);
        c.fillStyle = "#064e3b";
        c.beginPath();
        c.arc(o.x + o.width/2, o.y + o.height - 45, 30, 0, Math.PI*2);
        c.arc(o.x + o.width/2 - 15, o.y + o.height - 65, 25, 0, Math.PI*2);
        c.arc(o.x + o.width/2 + 15, o.y + o.height - 65, 25, 0, Math.PI*2);
        c.fill();
        c.fillStyle = "#065f46";
        c.beginPath();
        c.arc(o.x + o.width/2, o.y + o.height - 55, 20, 0, Math.PI*2);
        c.fill();
      } else if (o.id.includes("poster") || o.id.includes("banner")) {
        // Wall Art
        c.fillStyle = "#fff";
        c.fillRect(o.x, o.y, o.width, o.height);
        c.strokeStyle = "#222";
        c.lineWidth = 2;
        c.strokeRect(o.x, o.y, o.width, o.height);
        c.fillStyle = o.color;
        c.fillRect(o.x + 4, o.y + 4, o.width - 8, o.height - 12);
        c.fillStyle = "#222";
        c.fillRect(o.x + 4, o.y + o.height - 6, o.width - 12, 2);
      } else if (o.id.includes("bench")) {
        // Park Bench
        c.fillStyle = "#3e2723";
        c.fillRect(o.x, o.y + 5, o.width, 10); // seat
        c.fillRect(o.x + 5, o.y + 15, 4, 10); // legs
        c.fillRect(o.x + o.width - 9, o.y + 15, 4, 10);
        c.fillRect(o.x, o.y, o.width, 5); // backrest
      } else if (o.id.includes("rug")) {
        // Ornate Rug
        c.fillStyle = o.color;
        c.fillRect(o.x, o.y, o.width, o.height);
        c.strokeStyle = "rgba(255,255,255,0.2)";
        c.strokeRect(o.x + 5, o.y + 5, o.width - 10, o.height - 10);
        c.fillStyle = "rgba(255,255,255,0.1)";
        c.fillRect(o.x + o.width/2 - 5, o.y, 10, o.height);
      } else {
        c.fillStyle = o.color || "#444";
        c.fillRect(o.x, o.y, o.width, o.height);
      }
      
      c.restore();
    };

    const drawCharacter = (
      c: CanvasRenderingContext2D, 
      cx: number, 
      cy: number, 
      dir: "up" | "down" | "left" | "right", 
      moving: boolean, 
      frame: number,
      customSkin?: string,
      customShirt?: string,
      customHair?: string,
      npcType?: string
    ) => {
      c.save();
      const time = Date.now();
      
      // Blinking logic
      const isBlinking = (time % 4000) < 150;

      // Drop Shadow
      c.fillStyle = "rgba(0, 0, 0, 0.4)";
      c.beginPath();
      c.ellipse(cx + 13, cy + 38, 14, 5, 0, 0, Math.PI * 2);
      c.fill();

      let skinColor = customSkin;
      let shirtColor = customShirt;
      let hairColor = customHair;

      if (!npcType) {
        const currentAv = avatars[avatarIndex];
        skinColor = customSkin || currentAv.skin;
        shirtColor = customShirt || currentAv.shirt;
        hairColor = customHair || currentAv.hair;
      }

      const legHeightOffset = moving && (frame === 1 || frame === 3) ? -3 : 0;
      const headBounceOffset = idlesBounceValue(frame, moving);

      // BACKPACK (Main character only)
      if (!npcType) {
        // BACKPACK (Main character only - professional laptop bag)
        c.fillStyle = "#2c2c2c";
        c.fillRect(cx + 4, cy + 18 + headBounceOffset, 18, 14);
        c.fillStyle = "#1a1a1a";
        c.fillRect(cx + 6, cy + 16 + headBounceOffset, 14, 4);
      }

      // PANTS
      c.fillStyle = "#1e1b4b"; // Dark cargo pants
      c.fillRect(cx + 5, cy + 30 + legHeightOffset, 7, 10);
      c.fillRect(cx + 14, cy + 30 + legHeightOffset/2, 7, 10);

      // SHOES
      c.fillStyle = "#111";
      c.fillRect(cx + 5, cy + 38 + legHeightOffset, 7, 3);
      c.fillRect(cx + 14, cy + 38 + legHeightOffset/2, 7, 3);

      // TORSO / SHIRT
      c.fillStyle = shirtColor;
      c.fillRect(cx + 3, cy + 15 + headBounceOffset, 20, 16);
      
      // Backpack straps
      if (!npcType) {
        c.fillStyle = "rgba(0,0,0,0.3)";
        c.fillRect(cx + 6, cy + 15 + headBounceOffset, 3, 16);
        c.fillRect(cx + 17, cy + 15 + headBounceOffset, 3, 16);
      }

      // ARMS
      c.fillStyle = shirtColor;
      if (dir === "left") {
        c.fillRect(cx - 2, cy + 18 + headBounceOffset, 6, 12);
        c.fillStyle = skinColor;
        c.fillRect(cx - 2, cy + 28 + headBounceOffset, 6, 4);
      } else if (dir === "right") {
        c.fillRect(cx + 22, cy + 18 + headBounceOffset, 6, 12);
        c.fillStyle = skinColor;
        c.fillRect(cx + 22, cy + 28 + headBounceOffset, 6, 4);
      } else {
        c.fillRect(cx + 0, cy + 18 + headBounceOffset, 4, 12);
        c.fillRect(cx + 22, cy + 18 + headBounceOffset, 4, 12);
        c.fillStyle = skinColor;
        c.fillRect(cx + 0, cy + 28 + headBounceOffset, 4, 4);
        c.fillRect(cx + 22, cy + 28 + headBounceOffset, 4, 4);
      }

      // HEAD (Premium RPG proportions)
      c.fillStyle = skinColor;
      c.fillRect(cx + 5, cy, 16, 16); // Square head with rounded feel
      
      // Hair
      c.fillStyle = hairColor;
      if (npcType === "founder") {
        c.fillRect(cx + 5, cy - 3, 16, 8); // Sophisticated flat cut
      } else {
        c.fillRect(cx + 4, cy - 3, 18, 7); // Main fluff
        c.fillRect(cx + 3, cy, 3, 8); // Sideburn
        c.fillRect(cx + 20, cy, 3, 8);
      }

      // EYES (Small, professional)
      c.fillStyle = isBlinking ? skinColor : "#fff";
      const eyeY = cy + 8 + headBounceOffset;
      if (dir === "down") {
        c.fillRect(cx + 8, eyeY, 3, 3);
        c.fillRect(cx + 15, eyeY, 3, 3);
        if (!isBlinking) {
           c.fillStyle = "#1e1b4b";
           c.fillRect(cx + 9, eyeY + 1, 1, 1);
           c.fillRect(cx + 16, eyeY + 1, 1, 1);
        }
        // EYEBROWS
        c.fillStyle = "rgba(0,0,0,0.4)";
        c.fillRect(cx + 8, eyeY - 3, 3, 1);
        c.fillRect(cx + 15, eyeY - 3, 3, 1);
      } else if (dir === "left") {
        c.fillRect(cx + 6, eyeY, 3, 3);
        if (!isBlinking) {
           c.fillStyle = "#1e1b4b";
           c.fillRect(cx + 6, eyeY + 1, 1, 1);
        }
      } else if (dir === "right") {
        c.fillRect(cx + 17, eyeY, 3, 3);
        if (!isBlinking) {
           c.fillStyle = "#1e1b4b";
           c.fillRect(cx + 19, eyeY + 1, 1, 1);
        }
      }

      c.restore();
    };

    const idlesBounceValue = (f: number, isMove: boolean) => {
      if (isMove) return 0;
      return Math.sin(Date.now() / 330) > 0 ? 1 : 0;
    };

    const gameLoop = () => {
      if (isDestroyed) return;

      const player = playerRef.current;
      let targetDx = 0;
      let targetDy = 0;

      // Autoplay wander preview AI paths (highly polished)
      if (autoplay) {
        autoplayTimerRef.current++;
        if (autoplayTimerRef.current > 180) {
          autoplayTimerRef.current = 0;
          const waypoints = [
            { x: 800, y: 320 }, // sitting at luxury desk
            { x: 700, y: 180 }, // looking at golden bookshelf
            { x: 300, y: 300 }, // wandering left into Career Hall
            { x: 800, y: -220 }, // checking top Projects terminal
            { x: 1300, y: 300 }, // viewing the achievement center
            { x: 800, y: 750 } // contact gateway desk
          ];
          const target = waypoints[Math.floor(Math.random() * waypoints.length)];
          if (Math.random() > 0.2) {
            targetMoveRef.current = target;
          } else {
            targetMoveRef.current = null;
          }
        }
      }

      // Manual Keyboard Movements
      if (!autoplay && !isIntroActiveRef.current) {
        if (keysRef.current["w"] || keysRef.current["arrowup"]) {
          targetDy = -1.5;
          player.direction = "up";
        } else if (keysRef.current["s"] || keysRef.current["arrowdown"]) {
          targetDy = 1.5;
          player.direction = "down";
        }

        if (keysRef.current["a"] || keysRef.current["arrowleft"]) {
          targetDx = -1.5;
          player.direction = "left";
        } else if (keysRef.current["d"] || keysRef.current["arrowright"]) {
          targetDx = 1.5;
          player.direction = "right";
        }
      }

      // Float click path navigations
      if (targetMoveRef.current && !isIntroActiveRef.current) {
        const tx = targetMoveRef.current.x - player.width / 2;
        const ty = targetMoveRef.current.y - player.height / 2;
        const dist = Math.hypot(tx - player.x, ty - player.y);

        if (dist > 10) {
          const angle = Math.atan2(ty - player.y, tx - player.x);
          targetDx = Math.cos(angle);
          targetDy = Math.sin(angle);

          if (Math.abs(targetDx) > Math.abs(targetDy)) {
            player.direction = targetDx > 0 ? "right" : "left";
          } else {
            player.direction = targetDy > 0 ? "down" : "up";
          }
        } else {
          targetMoveRef.current = null;
        }
      }

      // Analog Physics: Acceleration & Friction
      if (targetDx !== 0 || targetDy !== 0) {
        player.vx += targetDx * player.speed;
        player.vy += targetDy * player.speed;
        player.isMoving = true;
      } else {
        player.isMoving = false;
      }

      // Clamp speed
      const currentSpeed = Math.hypot(player.vx, player.vy);
      if (currentSpeed > player.maxSpeed) {
        const ratio = player.maxSpeed / currentSpeed;
        player.vx *= ratio;
        player.vy *= ratio;
      }

      // Apply Friction
      player.vx *= player.friction;
      player.vy *= player.friction;

      // Stop if extremely slow
      if (Math.abs(player.vx) < 0.1) player.vx = 0;
      if (Math.abs(player.vy) < 0.1) player.vy = 0;

      // Update animation state
      if (Math.abs(player.vx) > 0.4 || Math.abs(player.vy) > 0.4) {
        player.animTimer++;
        if (player.animTimer > 8) {
          player.animFrame = (player.animFrame + 1) % 4;
          player.animTimer = 0;
        }

        if (!autoplay) {
          player.stepTimer++;
          if (player.stepTimer > 22) {
            soundEngine.playStep();
            player.stepTimer = 0;
          }
        }

        // Apply collisions per axis for sliding against walls
        if (!isCollide(player.x + player.vx, player.y, player.width, player.height)) {
          player.x += player.vx;
        } else {
          player.vx = 0;
        }
        
        if (!isCollide(player.x, player.y + player.vy, player.width, player.height)) {
          player.y += player.vy;
        } else {
          player.vy = 0;
        }
      } else {
        player.animFrame = 0;
        player.isMoving = false;
      }

      // Debug mode injection
      setDebugState({
        x: Math.round(player.x),
        y: Math.round(player.y),
        vx: player.vx,
        vy: player.vy,
        dir: player.direction,
        colliding: isCollide(player.x + player.vx, player.y + player.vy, player.width, player.height)
      });


      // Sector zoning discovery mapping
      
      // Update Debug
      setDebugState({
        x: Math.round(player.x),
        y: Math.round(player.y),
        vx: Math.round(player.vx * 100)/100,
        vy: Math.round(player.vy * 100)/100,
        dir: player.direction,
        colliding: isCollide(player.x + player.vx, player.y + player.vy, player.width, player.height)
      });

      if (!autoplay) {
        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;
        let activeRoom = "workspace";

        if (px < 520 && py > 120 && py < 520) {
          activeRoom = "experience"; // Career Hall
        } else if (py < 80) {
          activeRoom = "projects"; // Project Lab
        } else if (px > 1080 && py > 120 && py < 520) {
          activeRoom = "skills"; // Achievement/Skills Bookshelf Room
        } else if (py > 540 && py < 1000) {
          activeRoom = "contact"; // Contact Lounge
        } else if (py > 1400) {
          activeRoom = "outdoor"; // Town Square
        }

        if (discoveredSectors && !discoveredSectors.includes(activeRoom)) {
          if (onSectorsChange) {
            const updated = [...discoveredSectors, activeRoom];
            onSectorsChange(updated);
            soundEngine.playBeep(783.99, 0.12, "sine");
            setTimeout(() => {
              soundEngine.playBeep(987.77, 0.15, "sine");
            }, 80);

            if (onTriggerAchievement) {
              const friendlyNames: Record<string, string> = {
                experience: "📜 Chrono-Career Hall",
                projects: "💻 Innovation Laboratory",
                skills: "🧩 Tech Stack Library",
                contact: "✉️ Direct Mail Lounge"
              };
              onTriggerAchievement(
                `discovery_${activeRoom}`,
                `🗺️ Area Discovered: ${friendlyNames[activeRoom] || activeRoom}`,
                "Crossed the boundary threshholds to map this isometric playroom zone."
              );
            }
          }
        }
      }

      // Nearby selection scan range bounds, checks both actionable objects and passive decorative elements
      // --- OBJECT INTERACTION ZONE ---
      let foundNearObj: any | null = null;
      let closestDistance = 100;

      for (const obj of ROOM_OBJECTS) {
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const objCenterX = obj.x + obj.width / 2;
        const objCenterY = obj.y + obj.height / 2;
        const distance = Math.hypot(playerCenterX - objCenterX, playerCenterY - objCenterY);
        
        // Threshold for interaction - expanded for larger objects
        const threshold = Math.max(obj.width, obj.height, 80);
        if (distance < threshold && distance < closestDistance) {
          closestDistance = distance;
          foundNearObj = obj;
        }
      }

      setNearbyObject(foundNearObj);
      if (onNearbyObjectChange) {
        onNearbyObjectChange(foundNearObj);
      }

      // Nearby Memory Wall pillars check
      let foundMemory: typeof MEMORY_PILLARS[0] | null = null;
      for (const p of MEMORY_PILLARS) {
        const distance = Math.hypot((player.x + player.width/2) - p.x, (player.y + player.height/2) - p.y);
        if (distance < 60) {
          foundMemory = p;
          break;
        }
      }
      setNearbyMemory(foundMemory);

      // Nearby Achievement Stat Pedestal check
      const distanceToGem = Math.hypot((player.x + player.width/2) - 1300, (player.y + player.height/2) - 300);
      setIsNearImpactCenter(distanceToGem < 70);

      // --- CAMERA TRACKING ---
      let targetZoom = 1.0;
      let targetCamX = player.x + player.width / 2;
      let targetCamY = player.y + player.height / 2;

      if (autoplay) {
        targetZoom = 1.02 + Math.sin(Date.now() / 3000) * 0.02;
        targetCamX = 800;
        targetCamY = 320;
      } else if (activeSection) {
        targetZoom = 1.65;
        const matchObj = ROOM_OBJECTS.find(o => o.section === activeSection);
        if (matchObj) {
          targetCamX = matchObj.x + matchObj.width / 2;
          targetCamY = matchObj.y + matchObj.height / 2;
        }
      } else if (foundNearObj) {
        targetZoom = 1.45;
        targetCamX = (player.x + player.width / 2 + foundNearObj.x + foundNearObj.width / 2) / 2;
        targetCamY = (player.y + player.height / 2 + foundNearObj.y + foundNearObj.height / 2) / 2;
      } else if (foundMemory) {
        targetZoom = 1.45;
        targetCamX = (player.x + player.width / 2 + foundMemory.x) / 2;
        targetCamY = (player.y + player.height / 2 + foundMemory.y) / 2;
      } else if (distanceToGem < 100) {
        targetZoom = 1.35;
        targetCamX = (player.x + player.width / 2 + 1300) / 2;
        targetCamY = (player.y + player.height / 2 + 300) / 2;
      } else {
        targetZoom = 1.25; // immersive zoom
      }

      // Lerping track coordinate interpolations
      cameraZoomRef.current += (targetZoom - cameraZoomRef.current) * 0.08;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.08;
      cameraYRef.current += (targetCamY - cameraYRef.current) * 0.08;

      // Apply subtle dynamic high-performance camera shake offsets
      let shakeX = 0;
      let shakeY = 0;
      if (shakeIntensityRef.current > 0.05) {
        shakeX = (Math.random() - 0.5) * shakeIntensityRef.current;
        shakeY = (Math.random() - 0.5) * shakeIntensityRef.current;
        shakeIntensityRef.current *= 0.86; // decay factor
      } else {
        shakeIntensityRef.current = 0;
      }

      ctx.save();
      // Fluid translate coordinates centered on the dynamic canvas size with camera shake offset details
      ctx.translate(dimensions.width / 2 + shakeX, dimensions.height / 2 + shakeY);
      ctx.scale(cameraZoomRef.current, cameraZoomRef.current);
      ctx.translate(-cameraXRef.current, -cameraYRef.current);

      // CLEAR CANVASES
      ctx.clearRect(-400, -800, 2400, 2000);

      // Render Floor layers
      drawMap(ctx);

      // Draw avatar sprite
      const currentAv = avatars[avatarIndex];
      drawCharacter(ctx, player.x, player.y, player.direction, player.isMoving, player.animFrame, currentAv.skin, currentAv.shirt, currentAv.hair);

      // Draw NPC Visitor characters with slight roaming drift
      if (!autoplay) {
        const time = Date.now();
        VISITOR_NPCS_DATA.forEach((npc, idx) => {
        // Drifting offset - gentle horizontal roaming drift
        const driftX = Math.sin((time + idx * 800) / 1000) * 12;
        const driftY = Math.cos((time + idx * 1200) / 1000) * 8;
        const isMoving = Math.abs(driftX) > 2;

        drawCharacter(
          ctx,
          npc.startX + driftX,
          npc.startY + driftY,
          "down",
          isMoving,
          Math.floor(time / 250) % 4,
          npc.skin,
          npc.shirt,
          npc.hair,
          npc.type
        );

        // Render overhead tag
        ctx.save();
        ctx.font = "bold 8px sans-serif";
        const tagText = npc.type.toUpperCase();
        const tw = ctx.measureText(tagText).width;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(npc.startX + driftX + 13 - tw/2 - 4, npc.startY + driftY - 14, tw + 8, 12);
        ctx.fillStyle = npc.type === "founder" ? "#f59e0b" : "#818cf8";
        ctx.textAlign = "center";
        ctx.fillText(tagText, npc.startX + driftX + 13, npc.startY + driftY - 5);
        ctx.restore();

          // Check proximity to trigger custom speech bubble dialogue tag
          const distanceToPlayer = Math.hypot(
            (player.x + player.width / 2) - (npc.startX + driftX + 12),
            (player.y + player.height / 2) - (npc.startY + driftY + 18)
          );

          if (distanceToPlayer < 75) {
            // Draw Speech bubble
            ctx.save();
            ctx.fillStyle = "rgba(10, 6, 8, 0.98)";
            ctx.strokeStyle = "rgba(255, 192, 61, 0.65)";
            ctx.lineWidth = 1;

            const text = npc.msg;
            ctx.font = "bold 7px monospace";
            const textW = ctx.measureText(text).width;
            const bWidth = textW + 12;
            const bHeight = 15;
            const bx = npc.startX + driftX + 12 - bWidth / 2;
            const by = npc.startY + driftY - 24;

            // Draw bubble rectangle
            ctx.fillRect(bx, by, bWidth, bHeight);
            ctx.strokeRect(bx, by, bWidth, bHeight);

            // Draw speech bubble indicator notch
            ctx.fillStyle = "rgba(10, 6, 8, 0.98)";
            ctx.beginPath();
            ctx.moveTo(npc.startX + driftX + 8, by + bHeight);
            ctx.lineTo(npc.startX + driftX + 12, by + bHeight + 4);
            ctx.lineTo(npc.startX + driftX + 16, by + bHeight);
            ctx.fill();
            
            ctx.strokeStyle = "rgba(255, 192, 61, 0.65)";
            ctx.beginPath();
            ctx.moveTo(npc.startX + driftX + 8, by + bHeight);
            ctx.lineTo(npc.startX + driftX + 12, by + bHeight + 4);
            ctx.lineTo(npc.startX + driftX + 16, by + bHeight);
            ctx.stroke();

            // Render typewriter speech text centered inside bubble
            ctx.fillStyle = "#FDF6E2";
            ctx.fillText(text, bx + 6, by + 10);
            ctx.restore();
          }
        });
      }

      // Particles render details
      particlesRef.current.forEach((p) => {
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        if (weather === "foggy") {
          p.size = Math.max(p.size, 3.2);
          p.speedX = 0.22;
          p.speedY = 0.02 * Math.sin(Date.now() / 700);
          p.color = "rgba(190, 201, 218, 0.35)";
        } else if (weather === "rainy") {
          p.size = 0.9;
          p.speedY = 6.2;
          p.speedX = -0.4;
          p.color = "rgba(150, 190, 240, 0.45)";
        } else {
          p.color = Math.random() > 0.5 ? "#FFC03D" : "#818CF8";
        }

        if (p.life > p.maxLife || p.y < -350 || p.y > 900 || p.x > 1550 || p.x < 50) {
          p.x = Math.random() * 1500 + 50;
          p.y = weather === "rainy" ? -350 : 880;
          p.life = 0;
          p.opacity = Math.random() * 0.6 + 0.4;
        }

        const currentOpacity = p.opacity * Math.sin((p.life / p.maxLife) * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Special overlay: Rain streams splash ripples
      if (weather === "rainy") {
        ctx.strokeStyle = "rgba(186, 230, 253, 0.18)";
        ctx.lineWidth = 1;
        for (let ri = 0; ri < 25; ri++) {
          const rx = (Math.sin(Date.now() / 900 + ri) * 750 + 750) % 1450 + 70;
          const ry = (Date.now() / 1.2 + ri * 45) % 1150 - 320;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 10);
          ctx.stroke();

          if (ri % 5 === 0 && ry > 120 && ry < 880) {
            const rRad = (Date.now() / 16 + ri * 8) % 10;
            ctx.strokeStyle = `rgba(186, 230, 253, ${0.25 - rRad / 40})`;
            ctx.beginPath(); ctx.arc(rx, ry + 10, rRad, 0, Math.PI * 2); ctx.stroke();
          }
        }
      }

      // Special overlay: Fog bank
      if (weather === "foggy") {
        ctx.fillStyle = "rgba(224, 231, 255, 0.02)";
        for (let fi = 0; fi < 6; fi++) {
          const fx = (Date.now() / 15 + fi * 320) % 1800 - 200;
          const fy = -100 + fi * 150 + Math.sin(Date.now() / 1500 + fi) * 40;
          ctx.beginPath();
          ctx.arc(fx, fy, 75, 0, Math.PI * 2);
          ctx.arc(fx + 50, fy - 20, 100, 0, Math.PI * 2);
          ctx.arc(fx + 100, fy, 80, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Atmospheric cycle illumination
      if (dayNight === "night") {
        const ambientGlow = ctx.createRadialGradient(800, 300, 150, 800, 320, 950);
        ambientGlow.addColorStop(0, "rgba(255, 170, 60, 0.14)");
        ambientGlow.addColorStop(0.5, "rgba(20, 12, 32, 0.35)");
        ambientGlow.addColorStop(1, "rgba(7, 4, 12, 0.76)");
        ctx.fillStyle = ambientGlow;
        ctx.fillRect(-200, -500, 2000, 1600);

        // TV / Mon screen leakage
        ctx.fillStyle = "rgba(49, 151, 149, 0.05)";
        ctx.fillRect(720, 600, 200, 180);
        ctx.fillStyle = "rgba(99, 102, 241, 0.05)";
        ctx.fillRect(700, -320, 200, 150);
      } 
      else if (dayNight === "morning") {
        const ambientGlow = ctx.createLinearGradient(100, -300, 1500, 900);
        ambientGlow.addColorStop(0, "rgba(255, 238, 180, 0.22)"); // warm morning yellow rays
        ambientGlow.addColorStop(0.5, "rgba(255, 248, 230, 0.08)");
        ambientGlow.addColorStop(1, "rgba(16, 8, 8, 0.12)");
        ctx.fillStyle = ambientGlow;
        ctx.fillRect(-200, -500, 2000, 1600);

        // Morning beam polygon
        ctx.fillStyle = "rgba(255, 222, 160, 0.08)";
        ctx.beginPath();
        ctx.moveTo(50, -300);
        ctx.lineTo(400, -300);
        ctx.lineTo(850, 900);
        ctx.lineTo(50, 900);
        ctx.fill();
      } 
      else if (dayNight === "golden-hour") {
        const ambientGlow = ctx.createLinearGradient(0, 300, 1600, 300);
        ambientGlow.addColorStop(0, "rgba(244, 63, 94, 0.18)"); // luxurious deep sunset orange-fuchsia rays
        ambientGlow.addColorStop(0.5, "rgba(249, 115, 22, 0.15)");
        ambientGlow.addColorStop(1, "rgba(124, 58, 237, 0.18)");
        ctx.fillStyle = ambientGlow;
        ctx.fillRect(-200, -500, 2000, 1600);

        ctx.fillStyle = "rgba(249, 115, 22, 0.09)";
        ctx.beginPath();
        ctx.moveTo(100, -300);
        ctx.lineTo(950, -300);
        ctx.lineTo(1500, 900);
        ctx.lineTo(650, 900);
        ctx.fill();
      } 
      else {
        // afternoon
        const ambientGlow = ctx.createLinearGradient(800, -300, 800, 900);
        ambientGlow.addColorStop(0, "rgba(255, 255, 255, 0.06)"); // high-contrast daylight
        ambientGlow.addColorStop(1, "rgba(0, 0, 0, 0.05)");
        ctx.fillStyle = ambientGlow;
        ctx.fillRect(-200, -500, 2000, 1600);
      }

      // Draw floor path targeting ring
      if (targetMoveRef.current) {
        const tx = targetMoveRef.current.x;
        const ty = targetMoveRef.current.y;
        const rRad = (Date.now() / 15) % 15;
        ctx.strokeStyle = `rgba(251, 191, 36, ${1 - rRad / 15})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(tx, ty, rRad, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#FFC03D";
        ctx.fillRect(tx - 3, ty - 1, 6, 2);
        ctx.fillRect(tx - 1, ty - 3, 2, 6);
      }

      ctx.restore();

      // Render radar minimap overlay
      if (showMiniMapRef.current && !autoplay) {
        drawMiniMap(ctx);
      }

      // Loop ticking
      requestAnimationFrame(gameLoop);
    };

    const drawMiniMap = (c: CanvasRenderingContext2D) => {
      const mapW = 180;
      const mapH = 110;
      const mapX = dimensions.width - mapW - 16;
      const mapY = dimensions.height - mapH - 16;

      c.save();
      c.fillStyle = "rgba(10, 6, 8, 0.92)";
      c.fillRect(mapX, mapY, mapW, mapH);
      c.strokeStyle = "rgba(212, 175, 55, 0.65)";
      c.lineWidth = 1.5;
      c.strokeRect(mapX, mapY, mapW, mapH);

      // Grid coordinate overlay lines
      c.strokeStyle = "rgba(212, 175, 55, 0.06)";
      c.lineWidth = 0.5;
      for (let gx = mapX + 18; gx < mapX + mapW; gx += 18) {
        c.beginPath(); c.moveTo(gx, mapY); c.lineTo(gx, mapY + mapH); c.stroke();
      }
      for (let gy = mapY + 11; gy < mapY + mapH; gy += 11) {
        c.beginPath(); c.moveTo(mapX, gy); c.lineTo(mapX + mapW, gy); c.stroke();
      }

      // Render Walkable Areas on minimap
      WALKABLE_AREAS.forEach((area) => {
        const ax = mapX + ((area.x1 / 1600) * mapW);
        const ay = mapY + (((area.y1 + 400) / 1350) * mapH);
        const aw = ((area.x2 - area.x1) / 1600) * mapW;
        const ah = ((area.y2 - area.y1) / 1350) * mapH;
        c.fillStyle = "rgba(255, 192, 61, 0.04)";
        c.fillRect(ax, ay, aw, ah);
        c.strokeStyle = "rgba(255, 192, 61, 0.1)";
        c.lineWidth = 0.5;
        c.strokeRect(ax, ay, aw, ah);
      });

      // Render static room objects index
      ROOM_OBJECTS.forEach((obj) => {
        const ox = mapX + ((obj.x / 1600) * mapW);
        const oy = mapY + (((obj.y + 400) / 1350) * mapH);
        const ow = (obj.width / 1600) * mapW;
        const oh = (obj.height / 1350) * mapH;
        c.fillStyle = obj.color;
        c.fillRect(ox, oy, ow, oh);
        c.fillStyle = "#FFFFFF";
        c.font = "bold 5px monospace";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(obj.id.charAt(0).toUpperCase(), ox + ow/2, oy + oh/2);
      });

      // Render player dots
      const player = playerRef.current;
      const px = mapX + ((player.x / 1600) * mapW);
      const py = mapY + (((player.y + 400) / 1350) * mapH);
      const pulse = 4 + Math.sin(Date.now() / 150) * 1.5;

      c.fillStyle = "rgba(74, 222, 128, 0.3)";
      c.beginPath(); c.arc(px, py, pulse, 0, Math.PI*2); c.fill();

      c.fillStyle = "#4ADE80";
      c.beginPath(); c.arc(px, py, 2.2, 0, Math.PI*2); c.fill();
      c.strokeStyle = "#FFF";
      c.lineWidth = 0.5;
      c.stroke();

      // Label
      c.fillStyle = "rgba(0,0,0,0.75)";
      c.fillRect(mapX, mapY, mapW, 12);
      c.fillStyle = "#FFC03D";
      c.font = "700 7px monospace";
      c.textAlign = "left";
      c.fillText("CHAMBER RADAR PRO [M]", mapX + 6, mapY + 8);

      c.restore();
    };

    gameLoop();

    return () => {
      isDestroyed = true;
    };
  }, [avatarIndex, dimensions, dayNight, weather]);

  // Handle floor clicks
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isIntroActiveRef.current && !autoplay) {
       isIntroActiveRef.current = false;
    }
    
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * dimensions.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * dimensions.height;

    // Convert pixel coordinates back into virtual space matching camera transform
    const cameraVirtualX = cameraXRef.current + (clickX - dimensions.width/2) / cameraZoomRef.current;
    const cameraVirtualY = cameraYRef.current + (clickY - dimensions.height/2) / cameraZoomRef.current;

    // Secret easter egg potted plant click
    if (cameraVirtualX >= 610 && cameraVirtualX <= 645 && cameraVirtualY >= 260 && cameraVirtualY <= 295) {
      if (onSecretPlantClick) {
        onSecretPlantClick();
        return;
      }
    }

    if (autoplay) return;

    // Minimap teleport triggers
    const mapW = 180;
    const mapH = 110;
    const mapX = dimensions.width - mapW - 16;
    const mapY = dimensions.height - mapH - 16;
    if (showMiniMap && clickX >= mapX && clickX <= mapX + mapW && clickY >= mapY && clickY <= mapY + mapH) {
      soundEngine.playBeep(980, 0.08, "sine");
      const rx = ((clickX - mapX) / mapW) * 1600;
      const ry = (((clickY - mapY) / mapH) * 1350) - 400;
      
      targetMoveRef.current = {
        x: Math.max(90, Math.min(1510, rx)),
        y: Math.max(-360, Math.min(900, ry))
      };
      return;
    }

    // Standard floor click vectors limit to floor bounds
    const isInsideWalkableSpace = (x: number, y: number): boolean => {
      return WALKABLE_AREAS.some(area => x >= area.x1 && x <= area.x2 && y >= area.y1 && y <= area.y2);
    };

    if (isInsideWalkableSpace(cameraVirtualX, cameraVirtualY)) {
      soundEngine.playBeep(440, 0.05, "sine");
      targetMoveRef.current = { x: cameraVirtualX, y: cameraVirtualY };
    }
  };

  const handleShortcutClick = () => {
    if (nearbyObject) {
      if (nearbyObject.id === "about" || nearbyObject.id === "resume") {
        soundEngine.playHeavyInteract();
      } else {
        soundEngine.playInteract();
      }
      onInteract(nearbyObject.section);
      if (onQuestComplete) {
        onQuestComplete(nearbyObject.id as any);
      }
    }
  };

  const handleMobileNavPress = (dir: "up" | "down" | "left" | "right") => {
    soundEngine.playBeep(400, 0.05, "sine");
    const player = playerRef.current;
    targetMoveRef.current = null;
    
    let stepUnit = 45;
    let targetX = player.x;
    let targetY = player.y;

    if (dir === "up") targetY -= stepUnit;
    if (dir === "down") targetY += stepUnit;
    if (dir === "left") targetX -= stepUnit;
    if (dir === "right") targetX += stepUnit;

    targetMoveRef.current = { x: targetX + player.width/2, y: targetY + player.height/2 };
  };

  return (
    <div id="retro-map-container" ref={containerRef} className="w-full h-full relative flex flex-col items-center justify-center bg-[#070305]">
      
      {/* Cinematic Walkthrough overlay indicator */}
      {!autoplay && isIntroActiveRef.current && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-35 bg-black/95 border border-amber-500/80 px-4 py-2.5 rounded-md shadow-[0_0_35px_rgba(245,158,11,0.3)] flex items-center gap-3 animate-pulse pointer-events-none font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-red-650 animate-ping" />
          <div className="text-left leading-none">
            <p className="text-[9px] font-black text-[#FFC03D] uppercase tracking-widest leading-none">CINEMATIC SWEEP FLIGHT PATH ACTIVE</p>
            <p className="text-[7.5px] text-zinc-400 mt-1 uppercase leading-none">Sweeping chambers... enjoy the world preview</p>
          </div>
        </div>
      )}

      {/* Immersive Cinematic Game Map HUD overlay */}
      {!autoplay && (
        <div className="absolute top-4 left-6 right-6 z-10 pointer-events-none flex items-center justify-between">
          
          {/* Virtual manual hints with elegant display */}
          <div className="bg-black/85 backdrop-blur-md border border-amber-500/25 px-4 py-2 text-[10px] font-mono text-[#FDF6E2] rounded flex items-center gap-2 shadow-2xl">
            <Keyboard className="w-4 h-4 text-[#FFC03D] shrink-0" />
            <span className="hidden md:inline">Walk with <strong className="text-cozy-gold">WASD</strong> or <strong className="text-cozy-gold">Arrows</strong> • Tap/Click around floor to navigate chambers</span>
            <span className="md:hidden">Swipe or tap floor to walk connected zones</span>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            {/* Map toggle control */}
            <button
              id="hud-toggle-map"
              onClick={() => {
                soundEngine.playBeep(650, 0.05, "triangle");
                setShowMiniMap(prev => !prev);
              }}
              className={`px-3 py-1.5 text-[9px] font-mono uppercase font-bold tracking-wider rounded border transition-all flex items-center gap-1.5 cursor-pointer ${
                showMiniMap ? "bg-amber-500 text-black border-amber-600" : "bg-black/90 text-zinc-400 border-zinc-900 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Radar: {showMiniMap ? "ON" : "OFF"}
            </button>

            {/* Switch roles avatar switch */}
            <div className="bg-black/90 backdrop-blur-md border border-zinc-800 p-1 rounded flex gap-1 shadow-2xl">
              {avatars.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundEngine.playBeep(880, 0.08, "triangle");
                    setAvatarIndex(idx);
                  }}
                  className={`px-2 py-1 text-[8px] font-mono uppercase font-black tracking-wide rounded cursor-pointer ${
                    avatarIndex === idx ? "bg-amber-500 text-black font-extrabold" : "text-zinc-500 hover:text-white"
                  }`}
                  title={av.name}
                >
                  Role {idx + 1}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Floating HUD Panel for approaching physical obelisks (Career Wall Memory) OR pedestal client impact */}
      <div className="absolute top-20 left-6 z-20 pointer-events-none max-w-sm flex flex-col gap-3">
        {nearbyMemory && (
          <div className="bg-black/90 border-2 border-blue-500 p-4 rounded-xl shadow-[0_15px_40px_rgba(29,78,216,0.3)] text-left motion-safe:animate-fade-in pointer-events-auto font-mono">
            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold uppercase mb-1">
              <Trophy className="w-4 h-4 text-blue-400" />
              <span>Year {nearbyMemory.year} CHRONICLE MEMORY</span>
            </div>
            <h3 className="text-xs font-bold text-white uppercase">{nearbyMemory.title}</h3>
            <p className="text-[10px] text-zinc-300 leading-normal mt-1.5">{nearbyMemory.desc}</p>
          </div>
        )}

        {isNearImpactCenter && (
          <div className="bg-black/90 border-2 border-[#FFC03D] p-4 rounded-2xl shadow-[0_15px_40px_rgba(255,192,61,0.25)] text-left pointer-events-auto font-mono animate-pulse-slow">
            <div className="flex items-center gap-1.5 text-[9px] text-amber-400 font-bold uppercase mb-2">
              <Star className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Holographic Client Impact metrics</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="border-b border-zinc-900 pb-1.5">
                <span className="text-[9px] text-zinc-500 block">CAMPAIGN REACH</span>
                <span className="text-white font-extrabold font-sans text-sm">150,000+ targeted personas</span>
              </div>
              <div className="border-b border-zinc-900 pb-1.5">
                <span className="text-[9px] text-zinc-500 block">CONVERSION BOOSER</span>
                <span className="text-emerald-400 font-extrabold font-sans text-sm">+42% benchmark raise</span>
              </div>
              <div className="border-b border-zinc-900 pb-1.5">
                <span className="text-[9px] text-zinc-500 block">CAMPAIGN ROAS</span>
                <span className="text-[#FFC03D] font-extrabold font-sans text-sm">3.8x ads multiplier</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block">CORE WEB score</span>
                <span className="text-cyan-400 font-extrabold font-sans text-sm">100/100 page speed insights</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CORE CANVAS ELEMENT - FLUID SCALED */}
      <div className="w-full h-full relative overflow-hidden leading-none select-none">
        <canvas
          id="playable-rpg-canvas"
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleCanvasClick}
          className="cursor-pointer font-sans block pixelated h-full w-full"
        />

        {/* Dynamic scanline CRT visual layer */}
        <div className="absolute inset-0 pointer-events-none crt bg-gradient-to-b from-transparent to-black/15 crt-flicker" />
      </div>

      {/* Footer nearby interaction alerts inside room */}
      {!autoplay && (
        <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* Interaction context card banner */}
          <div className="w-full max-w-[480px]">
            {nearbyObject ? (
              <div className="bg-[#2a1309]/95 border-2 border-[#FFC03D] p-3 shadow-2xl flex items-center justify-between text-left pixelated pointer-events-auto">
                <div className="flex-1 min-w-0 pr-3">
                  <span className="text-[9px] font-mono text-[#FFC03D] font-bold uppercase tracking-widest block animate-pulse">
                    ✨ APPROACHING {nearbyObject.label?.toUpperCase() || "OBJECT"}
                  </span>
                  <p className="text-xs font-mono font-bold text-white mt-1 truncate">
                    {nearbyObject.name}
                  </p>
                  <p className="text-[10px] text-zinc-300 leading-normal mt-0.5 line-clamp-2">
                    {nearbyObject.description || "A decorative environmental detail."}
                  </p>
                </div>

                <button
                  id="btn-trigger-interact"
                  onClick={handleShortcutClick}
                  className="bg-emerald-600 border border-black hover:bg-emerald-500 text-white font-mono py-2.5 px-3.5 text-[10px] uppercase font-bold tracking-wider shadow-[2px_2px_0_0_#1E1218] active:translate-y-0.5 transition-all cursor-pointer pointer-events-auto"
                >
                  Open [E]
                </button>
              </div>
            ) : (
              <div className="bg-black/85 backdrop-blur-md border border-zinc-900 px-4 py-2.5 text-center text-[10px] font-mono text-zinc-400 rounded shadow-2xl">
                🚶 Move freely through the connected hallways into <span className="text-blue-400 font-extrabold uppercase">Career Hall</span> (Left), <span className="text-emerald-400 font-extrabold uppercase">Project Lab</span> (Top), <span className="text-[#FFC03D] font-extrabold uppercase">Achievement Gallery</span> (Right), or <span className="text-rose-400 font-extrabold uppercase">Contact Lounge</span> (Down).
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

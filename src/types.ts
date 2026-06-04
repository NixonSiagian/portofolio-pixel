export interface Project {
  id: string;
  title: string;
  category: "Web Development" | "Digital Marketing" | "UI/UX & Branding";
  description: string;
  technologies: string[];
  features: string[];
  metric?: string; // Marketing metrics or dev metrics
  accentColor: string;
  mockupType: "website" | "analytics" | "branding";
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  bullets: string[];
  tags: string[];
  iconName: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0 to 100
  tier: "Expert" | "Advanced" | "Intermediate";
}

export interface SkillCategory {
  category: string;
  iconName: string;
  skills: SkillItem[];
}

export interface GameCharacter {
  id: string;
  name: string;
  role: string;
  spriteColor: string; // Tailored color palette
  shirtColor: string;
  hairColor: string;
  hairStyle: "spiky" | "bob" | "curly" | "cap";
}

export interface RoomObject {
  id: string;
  name: string;
  section: string;
  x: number; // Floor coordinate units
  y: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  shortcut?: string;
  description?: string;
}

export interface WalkableArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  name: string;
  isOutdoor?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxLife: number;
  life: number;
  color: string;
}

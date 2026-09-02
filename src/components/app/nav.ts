import {
  Home,
  
  BookOpen,
  MessageCircleHeart,
  Mic,
  MessageSquarePlus,
  NotebookPen,
  ClipboardCheck,
  Sparkles,
  Users,
  LifeBuoy,
  Target,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const navItems: NavItem[] = [
  { to: "/dashboard", label: "Home", icon: Home, description: "Your personalized recovery overview" },
  { to: "/plan", label: "My plan", icon: Target, description: "Personalized physical & psychological plan" },
  
  { to: "/library", label: "Library", icon: BookOpen, description: "Ballet-specific injury and recovery guides" },
  { to: "/readiness", label: "Readiness", icon: ClipboardCheck, description: "Return-to-dance readiness check" },
  { to: "/support", label: "Support", icon: MessageCircleHeart, description: "AI recovery and wellness companion" },
  { to: "/talk", label: "Talk", icon: Mic, description: "Real-time voice conversations with the AI" },
  { to: "/journal", label: "Journal", icon: NotebookPen, description: "AI-assisted reflective writing" },

  { to: "/identity", label: "Identity", icon: Sparkles, description: "Identity map: who am I besides a dancer?" },
  { to: "/community", label: "Community", icon: Users, description: "Moderated peer spaces and stories" },
  { to: "/resources", label: "Resources", icon: LifeBuoy, description: "Professional and crisis support" },
  { to: "/appearance", label: "Appearance", icon: Palette, description: "Theme, accent colour, text size" },
  { to: "/feedback", label: "Feedback", icon: MessageSquarePlus, description: "Share what is working and what is not" },
];

const byPath = (path: string) => navItems.find((i) => i.to === path)!;

export const primaryNav = [byPath("/dashboard"), byPath("/plan"), byPath("/talk"), byPath("/journal")];

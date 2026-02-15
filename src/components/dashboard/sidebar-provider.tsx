"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  expand: () => void;
  collapse: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize state from local storage on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored) {
      setIsCollapsed(stored === "true");
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", String(newState));
      return newState;
    });
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
    localStorage.setItem("sidebar-collapsed", "false");
  }, []);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
    localStorage.setItem("sidebar-collapsed", "true");
  }, []);
  
  // Prevent hydration mismatch by rendering nothing or a default state until mounted
  // However, for layout stability, usually better to render default expanded and let it collapse effect run.
  // Or use a layout shift. We'll stick to default expanded (false).

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleSidebar, expand, collapse, isMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

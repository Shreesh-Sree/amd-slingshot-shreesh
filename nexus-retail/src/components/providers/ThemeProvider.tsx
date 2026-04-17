"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Check local storage or system pref
    const prefDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const prefMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsDark(prefDark);
    setReducedMotion(prefMotion);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    document.body.dataset.reducedMotion = reducedMotion.toString();
  }, [reducedMotion]);

  useEffect(() => {
    document.body.dataset.highContrast = highContrast.toString();
  }, [highContrast]);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme: () => setIsDark((p) => !p),
        reducedMotion,
        toggleReducedMotion: () => setReducedMotion((p) => !p),
        highContrast,
        toggleHighContrast: () => setHighContrast((p) => !p),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

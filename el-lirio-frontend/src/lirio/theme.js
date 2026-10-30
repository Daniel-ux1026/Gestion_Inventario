import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

export function useTheme() {
  return useContext(ThemeContext);
}

export function initialTheme() {
  try {
    const saved = localStorage.getItem("lirio.theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Browsers with storage disabled can still switch themes for this session.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

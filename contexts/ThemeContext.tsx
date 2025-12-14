import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "blue" | "pink" | "green";

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
}

const themeColors: Record<Theme, ThemeColors> = {
  blue: {
    primary: "#6366f1",
    secondary: "#eef2ff",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
  },
  pink: {
    primary: "#ec4899",
    secondary: "#fce7f3",
    background: "#fef2f2",
    card: "#ffffff",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#fecdd3",
  },
  green: {
    primary: "#10b981",
    secondary: "#d1fae5",
    background: "#f0fdf4",
    card: "#ffffff",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#bbf7d0",
  },
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("blue");
  const [colors, setColors] = useState<ThemeColors>(themeColors.blue);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("APP_THEME");
      if (
        savedTheme &&
        (savedTheme === "blue" ||
          savedTheme === "pink" ||
          savedTheme === "green")
      ) {
        setThemeState(savedTheme as Theme);
        setColors(themeColors[savedTheme as Theme]);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem("APP_THEME", newTheme);
      setThemeState(newTheme);
      setColors(themeColors[newTheme]);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

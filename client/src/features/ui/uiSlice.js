import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem("restro_theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: getInitialTheme(),
    mobileMenuOpen: false,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("restro_theme", state.theme);
      } catch {
        // ignore
      }
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { toggleTheme, setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;

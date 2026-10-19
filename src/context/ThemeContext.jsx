import { useLayoutEffect, useMemo, useState } from 'react';
import ThemeContext from './ThemeContext.js';

const THEME_KEY = 'myAdminTheme';

function getInitialTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Unable to load theme preference:', error);
    return 'light';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Unable to save theme preference:', error);
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light'
    ),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

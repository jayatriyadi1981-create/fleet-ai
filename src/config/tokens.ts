/**
 * Centralized Premium Enterprise Design Tokens
 * Fleet Intelligence Smart AI
 */

export const tokens = {
  colors: {
    primary: {
      50: '#f0f7ff',
      100: '#e0effe',
      200: '#bae0fd',
      300: '#7cc8fc',
      400: '#38bdf8', // Cyan/Blue highlight
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617', // Main dark canvas
    },
    semantic: {
      success: {
        bg: 'rgba(16, 185, 129, 0.1)',
        border: 'rgba(16, 185, 129, 0.25)',
        text: '#10b981',
      },
      warning: {
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.25)',
        text: '#f59e0b',
      },
      danger: {
        bg: 'rgba(244, 63, 94, 0.1)',
        border: 'rgba(244, 63, 94, 0.25)',
        text: '#f43f5e',
      },
      info: {
        bg: 'rgba(56, 189, 248, 0.1)',
        border: 'rgba(56, 189, 248, 0.25)',
        text: '#38bdf8',
      },
      ai: {
        bg: 'rgba(168, 85, 247, 0.12)',
        border: 'rgba(168, 85, 247, 0.3)',
        text: '#c084fc',
        gradient: 'from-cyan-500 via-indigo-500 to-purple-500',
      },
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
    glowCyan: '0 0 20px -3px rgba(56, 189, 248, 0.25)',
    glowPurple: '0 0 20px -3px rgba(168, 85, 247, 0.25)',
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    header: 1030,
    drawer: 1040,
    modal: 1050,
    toast: 1060,
    tooltip: 1070,
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export type ThemeMode = 'dark' | 'light' | 'system';

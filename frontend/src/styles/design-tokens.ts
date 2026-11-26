/**
 * SENTINEL-X Design System - Design Tokens
 *
 * Features:
 * - Enterprise-grade dark theme
 * - WCAG AA compliant color system
 * - Premium SOC aesthetic
 * - WCAG accessible component styles
 */

// Color System - Enterprise Dark Theme
export const colors = {
  brand: {
    primary: '#0ea5e9',     // Sky 500 - Accent blue
    secondary: '#6366f1',   // Indigo 500 - Secondary accent
    tertiary: '#8b5cf6',    // Violet 500 - Tertiary
    accent: '#06b6d4',      // Cyan 500 - Accent teal
    success: '#10b981',     // Emerald 500 - Success
    warning: '#f59e0b',     // Amber 500 - Warning
    error: '#ef4444',       // Red 500 - Critical
    info: '#3b82f6',        // Blue 500 - Info
  },
  background: {
    primary: '#080d16',     // Deep navy - Main background
    secondary: '#0d1421',   // Darker navy - Secondary surfaces
    tertiary: '#111827',    // Charcoal - Cards
    elevated: '#162337',    // Elevated surfaces
    overlay: 'rgba(13, 20, 33, 0.8)',
    gradient: 'linear-gradient(135deg, #080d16 0%, #111827 50%, #162337 100%)',
  },
  surface: {
    primary: '#111827',     // Card background
    secondary: '#162337',   // Panel background
    elevated: '#1f2a41',    // Modal/dialog background
    border: '#1e293b',      // Borders
    divider: '#1e293b',     // Dividers
    focus: '#3b82f6',       // Focus ring
  },
  text: {
    primary: '#f1f5fa',     // White - Primary text
    secondary: '#94a3b8',   // Slate 400 - Secondary text
    disabled: '#64748b',    // Slate 500 - Disabled text
    hint: '#475569',        // Slate 600 - Hint text
    inverse: '#080d16',     // Dark - Inverse text on light surfaces
  },
  state: {
    interactive: '#0ea5e9', // Primary interactable
    interactiveHover: '#0284c7',
    interactiveActive: '#0369a1',
    selected: '#3b82f6',    // Selection highlight
    danger: '#ef4444',      // Destructive actions
    muted: '#64748b',       // Muted state
  },
  alert: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
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
  },
} as const;

// Typography System
export const typography = {
  family: {
    sans: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
  },
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  size: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    md: '1rem',         // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// Spacing Scale (8-point grid)
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  '5xl': '5rem',    // 80px
  '6xl': '6rem',    // 96px
} as const;

// Border Radius
export const borderRadius = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  full: '9999px',  // Full circle
} as const;

// Elevation (Shadow System)
export const elevation = {
  none: '0 0 0 0 rgba(0, 0, 0, 0)',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.01)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 8px 10px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
  '3xl': '0 35px 60px rgba(0, 0, 0, 0.25)',
} as const;

// Z-Index Layers
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  notification: 1070,
} as const;

// Breakpoints (Responsive Design)
export const breakpoints = {
  xs: '320px',
  sm: '375px',
  md: '425px',
  lg: '768px',
  xl: '1024px',
  '2xl': '1280px',
  '3xl': '1440px',
  '4xl': '1600px',
} as const;

// Animation Durations
export const duration = {
  xs: '75ms',
  sm: '100ms',
  md: '150ms',
  lg: '200ms',
  xl: '250ms',
  '2xl': '300ms',
  '3xl': '350ms',
} as const;

// Easing Functions
export const easing = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// Icon Sizes
export const iconSize = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '28px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

// Chart Colors for Visualizations
export const chartColors = {
  primary: '#0ea5e9',
  secondary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  danger: '#ef4444',
  purple: '#a855f7',
  teal: '#06b6d4',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  gold: '#f59e0b',
  rose: '#f43f5e',
  lime: '#84cc16',
  amber: '#f59e0b',
  emerald: '#10b981',
  violet: '#a855f7',
  fuchsia: '#d946ef',
  blue: '#3b82f6',
  gray: '#94a3b8',
} as const;

// MITRE ATT&CK Severity Mapping
export const mitreSeverity = {
  initialAccess: { name: 'Initial Access', color: colors.state.primary, weight: 10 },
  execution: { name: 'Execution', color: colors.state.tertiary, weight: 5 },
  persistence: { name: 'Persistence', color: colors.brand.accent, weight: 8 },
  privilegeEscalation: { name: 'Privilege Escalation', color: colors.state.accent, weight: 9 },
  defenseEvasion: { name: 'Defense Evasion', color: colors.state.warning, weight: 7 },
  credentialAccess: { name: 'Credential Access', color: colors.alert.error, weight: 10 },
  discovery: { name: 'Discovery', color: colors.state.info, weight: 3 },
  lateralMovement: { name: 'Lateral Movement', color: colors.brand.secondary, weight: 8 },
  collection: { name: 'Collection', color: colors.state.muted, weight: 4 },
  commandAndControl: { name: 'Command & Control', color: colors.alert.warning, weight: 9 },
  exection: { name: 'Exfiltration', color: colors.alert.error, weight: 8 },
  impact: { name: 'Impact', color: colors.brand.error, weight: 10 },
} as const;
/**
 * SENTINEL-X Design System - Material UI Theme
 *
 * Features:
 * - Enterprise-grade dark theme
 * - WCAG AA compliant
 * - SOC-specific color palette
 * - Responsive design tokens
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colors, typography, spacing, borderRadius, elevation, zIndex } from './design-tokens';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colors.brand.primary,
      light: colors.brand.secondary,
      dark: colors.brand.primary,
      contrastText: colors.text.primary,
    },
    secondary: {
      main: colors.brand.secondary,
      light: colors.brand.tertiary,
      dark: colors.brand.secondary,
      contrastText: colors.text.primary,
    },
    info: {
      main: colors.brand.info,
      light: colors.state.secondary,
      dark: colors.brand.info,
      contrastText: colors.text.primary,
    },
    success: {
      main: colors.brand.success,
      light: colors.neutral[200],
      dark: colors.brand.success,
      contrastText: colors.text.primary,
    },
    warning: {
      main: colors.brand.warning,
      light: colors.neutral[300],
      dark: colors.brand.warning,
      contrastText: colors.text.primary,
    },
    error: {
      main: colors.brand.error,
      light: colors.neutral[300],
      dark: colors.brand.error,
      contrastText: colors.text.primary,
    },
    background: {
      default: colors.background.primary,
      paper: colors.surface.primary,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },

  typography: {
    fontFamily: typography.family.sans.join(', '),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: typography.size['4xl'],
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: typography.size['3xl'],
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: typography.size['2xl'],
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: typography.size.xl,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  spacing: 8,

  shape: {
    borderRadius: parseInt(borderRadius.lg),
  },

  components: {
    // Global overrides
   MuiCssOutlinePrefix: {
      styleOverrides: {
        *,
        ':before': {
          boxSizing: 'border-box',
        },
      },
    },

    // Button styles
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.brand.primary}, ${colors.brand.secondary})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.brand.secondary}, ${colors.brand.primary})`,
          },
        },
        outlined: {
          borderColor: colors.surface.border,
          '&:hover': {
            backgroundColor: colors.background.secondary,
          },
        },
      },
    },

    // Card styles
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface.primary,
          borderRadius: 12,
          boxShadow: elevation.md,
          border: `1px solid ${colors.surface.border}`,
          transition: 'all 150ms ease-in-out',
          '&:hover': {
            boxShadow: elevation.lg,
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    // Input styles
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: colors.surface.secondary,
          border: `1px solid ${colors.surface.border}`,
          '&:hover': {
            borderColor: colors.state.interactive,
          },
          '&.Mui-focused': {
            borderColor: colors.state.focus,
            boxShadow: `0 0 0 2px ${colors.state.focus}40`,
          },
        },
      },
    },

    // AppBar styles
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.secondary,
          boxShadow: `0 1px 3px ${colors.elevation.none}`,
          borderBottom: `1px solid ${colors.surface.border}`,
        },
      },
    },

    // Table styles
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface.primary,
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },

    // TableCell styles
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.surface.border}`,
          color: colors.text.secondary,
          fontWeight: 500,
          '&.MuiTableCell-head': {
            color: colors.text.primary,
            backgroundColor: colors.background.secondary,
            fontWeight: 600,
          },
        },
      },
    },

    // TableRow styles
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colors.background.secondary,
            cursor: 'pointer',
          },
          transition: 'background-color 150ms ease-in-out',
        },
      },
    },

    // Chip styles
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        sizeSmall: {
          height: 24,
          padding: '0 8px',
        },
        colorSuccess: {
          backgroundColor: `${colors.brand.success}20`,
          color: colors.brand.success,
        },
        colorWarning: {
          backgroundColor: `${colors.brand.warning}20`,
          color: colors.brand.warning,
        },
        colorError: {
          backgroundColor: `${colors.brand.error}20`,
          color: colors.brand.error,
        },
        colorPrimary: {
          backgroundColor: `${colors.brand.primary}20`,
          color: colors.brand.primary,
        },
      },
    },

    // Dialog styles
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surface.elevated,
          borderRadius: 20,
          boxShadow: `0 25px 50px ${colors.elevation[`3xl`]}`,
          margin: 16,
        },
      },
    },

    // Paper styles
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: parseInt(borderRadius.xl),
        },
      },
    },

    // LinearProgress styles
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: colors.brand.primary,
        },
        bar: {
          borderRadius: 4,
          backgroundColor: colors.brand.primary,
        },
      },
    },

    // Badge styles
    MuiBadge: {
      styleOverrides: {
        badge: {
          boxShadow: 'none',
        },
      },
    },

    // Drawer styles
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.secondary,
          borderRight: `1px solid ${colors.surface.border}`,
          width: 280,
        },
      },
    },

    // Popper styles
    Mui Popper: {
      styleOverrides: {
        popper: {
          zIndex: zIndex.tooltip,
        },
      },
    },
  },
};

// Create theme
export const theme = createTheme(themeOptions);

// Export theme types
export type SENTINELXTheme = typeof theme;
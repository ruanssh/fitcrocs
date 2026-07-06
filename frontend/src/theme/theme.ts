import { createTheme } from '@mui/material/styles';

export const tokens = {
  amber: '#ffa133',
  amberBright: '#ffb559',
  pumpkin: '#e47b1a',
  flux: '#c8be50',
  foam: '#bccabb',
  enamel: '#eeeeee',
  cement: '#c0c0c0',
  aluminum: '#cccccc',
  ash: '#8e8e8e',
  smoke: '#666666',
  dark: '#444444',
  soot: '#333333',
  carbon: '#222222',
  surface: '#1a1a1a',
  ink: '#0a0a0a',
} as const;

const mono = "'IBM Plex Mono', ui-monospace, 'Cascadia Mono', monospace";

export const terminalTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: tokens.amber, contrastText: tokens.ink },
    error: { main: tokens.pumpkin },
    warning: { main: tokens.flux },
    success: { main: tokens.foam },
    background: { default: tokens.carbon, paper: tokens.surface },
    text: {
      primary: tokens.cement,
      secondary: tokens.ash,
      disabled: tokens.smoke,
    },
    divider: tokens.soot,
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: mono,
    h1: { fontFamily: mono, fontWeight: 600, letterSpacing: '0.02em' },
    h2: { fontFamily: mono, fontWeight: 600, letterSpacing: '0.02em' },
    h3: { fontFamily: mono, fontWeight: 600, letterSpacing: '0.02em' },
    h4: { fontFamily: mono, fontWeight: 600, letterSpacing: '0.02em' },
    h5: { fontFamily: mono, fontWeight: 600, letterSpacing: '0.02em' },
    h6: { fontFamily: mono, fontWeight: 600, letterSpacing: '0.02em' },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontWeight: 600,
    },
    overline: {
      letterSpacing: '0.12em',
      fontWeight: 600,
      lineHeight: 1.8,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.carbon,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
    },
    MuiButton: {
      defaultProps: { variant: 'outlined', disableElevation: true },
      styleOverrides: {
        root: {
          transition:
            'border-color .15s, color .15s, background-color .15s',
          variants: [
            {
              props: { variant: 'outlined' },
              style: {
                border: `1px solid ${tokens.soot}`,
                color: tokens.cement,
                background: 'transparent',
                '&:hover': {
                  borderColor: tokens.amber,
                  color: tokens.amber,
                  background: 'transparent',
                },
              },
            },
            {
              props: { variant: 'outlined', color: 'primary' },
              style: {
                borderColor: tokens.amber,
                color: tokens.amber,
                '&:hover': {
                  borderColor: tokens.amberBright,
                  color: tokens.amberBright,
                },
              },
            },
            {
              props: { variant: 'outlined', color: 'error' },
              style: {
                borderColor: tokens.soot,
                color: tokens.pumpkin,
                '&:hover': {
                  borderColor: tokens.pumpkin,
                  color: tokens.pumpkin,
                  background: 'transparent',
                },
              },
            },
            {
              props: { variant: 'contained', color: 'primary' },
              style: {
                background: tokens.amber,
                color: tokens.ink,
                '&:hover': { background: tokens.amberBright },
                '&.Mui-disabled': {
                  background: tokens.soot,
                  color: tokens.smoke,
                },
              },
            },
            {
              props: { variant: 'text' },
              style: {
                color: tokens.cement,
                '&:hover': { color: tokens.amber, background: 'transparent' },
              },
            },
            {
              props: { variant: 'text', color: 'error' },
              style: {
                color: tokens.pumpkin,
                '&:hover': { color: tokens.pumpkin },
              },
            },
          ],
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: tokens.ash,
          transition: 'color .15s, border-color .15s',
          '&:hover': { color: tokens.amber, background: 'transparent' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: 'transparent',
          transition: 'border-color .15s',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.soot,
            transition: 'border-color .15s',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.amber,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.amber,
            borderWidth: 1,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.pumpkin,
          },
        },
        input: {
          color: tokens.cement,
          '&::placeholder': {
            color: tokens.ash,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            opacity: 1,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          fontWeight: 600,
          color: tokens.ash,
          '&.Mui-focused': { color: tokens.amber },
          '&.Mui-error': { color: tokens.pumpkin },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontFamily: mono,
          letterSpacing: '0.02em',
          marginLeft: 0,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${tokens.soot}`,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: {
          background: tokens.surface,
          border: 'none',
          borderBottom: `1px solid ${tokens.soot}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${tokens.soot}`,
          background: tokens.surface,
          marginTop: 4,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          letterSpacing: '0.02em',
          '&:hover': {
            background: 'rgba(255, 161, 51, 0.08)',
            color: tokens.amber,
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { color: 'inherit', minWidth: 32 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${tokens.soot}`,
          fontFamily: mono,
        },
        head: {
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          fontWeight: 600,
          color: tokens.ash,
          background: tokens.surface,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            background: 'rgba(255, 161, 51, 0.04)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: `1px solid ${tokens.amber}`,
          background: tokens.surface,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(10, 10, 10, 0.8)' },
      },
    },
    MuiChip: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          borderRadius: 0,
          borderColor: tokens.soot,
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          letterSpacing: '0.06em',
          fontFamily: mono,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: tokens.surface,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: tokens.ash,
          transition: 'color .15s',
          '&.Mui-selected': { color: tokens.amber },
        },
        label: {
          textTransform: 'uppercase',
          fontSize: '0.65rem',
          letterSpacing: '0.06em',
          '&.Mui-selected': { fontSize: '0.65rem' },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: tokens.amber,
          textDecorationColor: tokens.amber,
          transition: 'color .15s',
          '&:hover': { color: tokens.amberBright },
        },
      },
    },
    MuiAvatar: {
      defaultProps: { variant: 'square' },
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.soot}`,
          background: tokens.carbon,
          color: tokens.amber,
          fontFamily: mono,
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
        },
      },
    },
    MuiAlert: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: mono,
          letterSpacing: '0.02em',
          variants: [
            {
              props: { severity: 'error' },
              style: {
                borderColor: tokens.pumpkin,
                color: tokens.pumpkin,
              },
            },
          ],
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: tokens.surface,
          border: `1px solid ${tokens.soot}`,
          color: tokens.cement,
          borderRadius: 0,
          fontFamily: mono,
          fontSize: '0.72rem',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { background: '#2a2a2a' },
      },
    },
  },
});

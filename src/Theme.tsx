import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    branding: PaletteColor;
    navBackground: PaletteColor;
  }
  interface PaletteOptions {
    branding?: PaletteColorOptions;
    navBackground?: PaletteColorOptions;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b517d',
      light: '#93cdfe',
    },
    secondary: {
      main: '#8f9da3',
    },
    error: {
      main: '#ef4400',
    },
    warning: {
      main: '#f27a31',
    },
    info: {
      main: '#0b517d',
    },
    success: {
      main: '#1f323e',
    },
    background: {
      default: '#eff7fe',
    },
    branding: {
      main: '#1f323e',
      light: '#f27a31',
    },
    navBackground: {
      main: '#e2eaf1',
    },
  },
  typography: {
    body1: {
      color: '#0b517d',
    },
    body2: {
      color: '#0b517d',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#eff7fe',
          borderRadius: '10px',
          '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#93cdfe',
          },
        },
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'transparent',
          color: '#1f323e',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&:not(.Mui-checked)': {
            backgroundColor: 'transparent',
            color: '#f27a31',
          },
          '&.Mui-checked': {
            color: '#0b517d',
          },
        }
      }
    }
  }
});

export default theme;

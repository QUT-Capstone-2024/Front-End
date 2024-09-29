import { Height } from '@mui/icons-material';
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
    h1: {
      color: '#1f323e',
    },
    h2: {
      color: '#1f323e',
    },
    h3: {
      color: '#1f323e',
    },
    h4: {
      color: '#1f323e',
    },
    h5: {
      color: '#1f323e',
    },
    h6: {
      color: '#1f323e',
    },
    subtitle1: {
      color: '#0b517d',
    },
    subtitle2: {
      color: '#1f323e',
    },
    body1: {
      color: '#1f323e',
    },
    body2: {
      color: '#0b517d',
    },
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f27a31',
          color: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          minWidth: '150px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          color: '#e2eaf1',
          '&:hover': {
            color: '#e2eaf',
            backgroundColor: '#f3b792',
          },
        },
      },
    },
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
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&.slick-prev': {
            fill: '#f27a31',
            strokeWidth: 2,
            stroke: '#ef4400',
            strokeOpacity: 0.3,
            '&:hover': {
              fill: '#93cdfe',
              stroke: '#1f323e',
            },
          },
          '&.slick-next': {
            fill: '#f27a31',
            strokeWidth: 2,
            stroke: '#ef4400',
            strokeOpacity: 0.3,
            '&:hover': {
              fill: '#93cdfe',
              stroke: '#1f323e',
            },
          },
        },
      },
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

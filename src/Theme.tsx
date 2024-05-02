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
      main: '#93cdfe',
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
      default: '#ffffff',
    },
    branding: {
      main: '#ef4400',
      light: '#f27a31',
    },
    navBackground: {
      main: '#1f323e',
    },
  },
});

export default theme;

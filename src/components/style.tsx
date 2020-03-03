import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

// override MuiTheme to PIB stylish
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1caff6', // PIB blue main color
    },
  },
});

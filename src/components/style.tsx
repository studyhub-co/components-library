import { createTheme } from '@material-ui/core/styles';

// FIXME is this using?
// override MuiTheme to PIB stylish
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1caff6', // PIB blue main color
      contrastText: '#ffffff',
    },
  },
});

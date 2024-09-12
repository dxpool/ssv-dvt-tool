import { createTheme} from "@mui/material";
import { grey, red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#505050"
    },
    secondary: {
      main: "#3F3F46"
    },
    error: red,
    info: grey,
    background: {
      default: "#F5F5F5",
    },
    text: {
      primary: "#333333",
      secondary: "#A4A4A4",
    },
  },
  typography: {
    h1: {
      fontSize: "2.25rem"
    }
  },
  components: {
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: grey[500],
          },
          '& .MuiFormControlLabel-label': {
            fontSize: '1.125rem',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: grey[500],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            backgroundColor: '#d7d8d9',
            color: '#b9babc',
          },
        },
      },
    },
    
  },
});


export default theme;
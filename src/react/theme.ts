import { createTheme} from "@mui/material";
import { grey, red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#149ec4"
    },
    secondary: {
      main: "#3F3F46"
    },
    error: red,
    info: grey,
    background: {
      default: "#303030",
    },
  },
  typography: {
    h1: {
      fontSize: "2.25rem"
    }
  }
});


export default theme;
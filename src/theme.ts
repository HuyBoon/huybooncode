import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0288d1",
        },
        secondary: {
            main: "#ef5350",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

export default theme;
import { createTheme } from '@mui/material'; 


export const theme = createTheme({
    typography: {
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
    },
    palette: {
        primary: {
            main: '#00794E'
        },
        secondary: {
            main: '#022A19'
        },
        info : {
            main: '#44469D'
        }
    }
})
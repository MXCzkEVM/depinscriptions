import { createTheme } from "@mui/material";
import { Inter } from "next/font/google";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6300ff'
    },
    secondary: {
      main: '#fff'
    }
  },
})

export const fontInter = Inter({ subsets: ['latin'] })

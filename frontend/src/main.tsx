import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import{Toaster} from 'react-hot-toast'
import axios from "axios"
<<<<<<< HEAD
axios.defaults.baseURL = '/api/v1';
=======
axios.defaults.baseURL = 'https://fit-gpt-backend.onrender.com';
>>>>>>> ed915ec91b55762e9726fdb21bd7f5d6bdbbf3b4
axios.defaults.withCredentials= true;

const theme = createTheme({
  typography:{
  fontFamily:"Roboto Slab,serif ",
  allVariants: {color: "white"}
  },
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Toaster position="top-right"/>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);

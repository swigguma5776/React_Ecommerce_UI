import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles'; 
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/auth'; 

// internal imports
import { Home, Auth, Cart, Shop } from './components'; 
import './index.css'
import { theme } from './Theme/themes'; 
import { firebaseConfig } from './firebaseConfig';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ThemeProvider theme = {theme}>
        <Router>
          <Routes>
            <Route path='/' element = {<Home title = {"Ranger's Shop of Horrors"}/>} />
            <Route path='/auth' element = {<Auth title = {"Ranger's Shop of Horrors"}/>} />
            <Route path='/cart' element = {<Cart/>} />
            <Route path='/shop' element = {<Shop/>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
)

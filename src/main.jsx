import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import Web Awesome CSS and dark theme
// import '@awesome.me/webawesome/dist/styles/webawesome.css'
// import '@awesome.me/webawesome/dist/styles/themes/shoelace.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ScheduleProvider } from './context/ScheduleContext'
import './styles/schedule.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScheduleProvider>
      <App />
    </ScheduleProvider>
  </React.StrictMode>,
)

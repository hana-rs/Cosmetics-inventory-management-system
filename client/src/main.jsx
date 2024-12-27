import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import List from './List.jsx'
import Register from './Register.jsx'
import Edit from './Edit.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Register />
    <List />
    <Edit />
  </StrictMode>,
)



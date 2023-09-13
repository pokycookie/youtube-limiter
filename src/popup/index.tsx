import { createRoot } from 'react-dom/client'

// import App from '../content/Banned'
import App from './App'
import './index.css'

const container = document.getElementById('popup')
const root = createRoot(container!)
root.render(<App />)

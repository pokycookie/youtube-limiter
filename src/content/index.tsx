import { createRoot } from 'react-dom/client'
import Banned from './Banned'
import './styles.css'

function useReact() {
  const container = document.getElementById('youtube-limiter')
  const root = createRoot(container!)
  root.render(<Banned />)
}

function useLimiter() {
  console.log('clear')
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
  const limiter = document.createElement('div')
  limiter.id = 'youtube-limiter'
  document.body.appendChild(limiter)
  useReact()
}

const check = () => {
  try {
    chrome.runtime.sendMessage({ key: 'check' }, (res) => {
      if (res.result) {
        useLimiter()
        console.log('stop!!')
      }
    })
  } catch (error) {
    console.error(error)
  }
}

setInterval(() => {
  check()
}, 10000)
check()

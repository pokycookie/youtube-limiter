import { useEffect, useState } from 'react'

const App = () => {
  const [total, setTotal] = useState(0)

  const getTotal = () => {
    chrome.runtime.sendMessage({ key: 'getTotal' }, (res) => {
      if (res) {
        if (typeof res.total === 'number') setTotal(res.total)
      } else console.error('Invalid response from background script')
    })
  }

  useEffect(() => {
    getTotal()
  }, [])

  return (
    <div className="w-64 h-72 flex flex-col items-center justify-center bg-zinc-100">
      <p>{(total / 60000).toFixed(0)} min</p>
    </div>
  )
}

export default App

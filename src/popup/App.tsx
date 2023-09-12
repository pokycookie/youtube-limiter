import { useEffect, useState } from 'react'
import Arc from '../components/ui/arc'
import ArcValue from '../components/ui/arcValue'

const App = () => {
  const [total, setTotal] = useState(0)
  const [maxValue, setMaxValue] = useState(0)

  const getTotal = () => {
    try {
      chrome.runtime.sendMessage({ key: 'getTotal' }, (res) => {
        if (res) {
          if (typeof res.total === 'number') setTotal(res.total)
          if (typeof res.maxTime === 'number') setMaxValue(res.maxTime)
        } else console.error('Invalid response from background script')
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTotal()
  }, [])

  return (
    <div>
      <div className="w-64 h-64 flex flex-col items-center justify-center bg-blue-50 p-5 relative">
        <div className="w-full aspect-square">
          <ArcValue
            startDeg={200}
            endDeg={160}
            value={(total / maxValue) * 100}
          />
        </div>
        <div className="absolute">
          <span className="flex gap-1 text-sm">
            <span>{(total / 1000).toFixed(0)} sec</span>
            <span>/</span>
            <span>{(maxValue / 1000).toFixed(0)} sec</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default App

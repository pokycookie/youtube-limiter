import { useEffect, useState } from 'react'
import ArcValue from '../components/ui/arcValue'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faGear } from '@fortawesome/free-solid-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'

function App() {
  const [total, setTotal] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [refreshClicked, setRefreshClicked] = useState(false)

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
    <div className="bg-zinc-700 w-64 select-none">
      <header className="w-full bg-zinc-800 p-2 flex items-center justify-between">
        <h1 className="text-xs font-semibold text-red-600 flex gap-2 items-center">
          <FontAwesomeIcon icon={faYoutube} className="text-red-600 w-4 h-4" />
          Youtube Limiter
        </h1>
        <button
          className="flex justify-center items-center text-zinc-300 hover:text-zinc-100"
          onClick={() => {
            if (chrome.runtime.openOptionsPage) {
              chrome.runtime.openOptionsPage()
            } else {
              window.open(chrome.runtime.getURL('options.html'))
            }
          }}
        >
          <FontAwesomeIcon icon={faGear} className="w-3 h-3" />
        </button>
      </header>
      <div className="w-64 h-64 flex flex-col items-center justify-center p-5 relative">
        <div className="w-full aspect-square">
          <ArcValue
            startDeg={200}
            endDeg={160}
            value={(total / maxValue) * 100}
          />
        </div>
        <div className="absolute flex flex-col items-center gap-2">
          <span className="text-4xl text-zinc-200">
            {((total / maxValue) * 100).toFixed(0)}%
          </span>
          <span className="text-xs text-zinc-400 flex gap-1">
            <span>{(total / 60000).toFixed(0)}분 사용</span>
            <span>/</span>
            <span>
              {Math.max((maxValue - total) / 60000, 0).toFixed(0)}분 남음
            </span>
          </span>
        </div>
        <button
          className="absolute flex justify-center data-[clicked=true]:scale-90 items-center rounded-full w-9 aspect-square bottom-3 bg-zinc-600 hover:bg-red-600 hover:text-white text-zinc-300 hover:-rotate-45 transition-all"
          data-clicked={refreshClicked}
          onClick={() => getTotal()}
          onMouseDown={() => setRefreshClicked(true)}
          onMouseUp={() => setRefreshClicked(false)}
        >
          <FontAwesomeIcon className="w-4 h-4" icon={faRotateLeft} />
        </button>
      </div>
      <footer className="w-full bg-zinc-800 flex items-center gap-2"></footer>
    </div>
  )
}

export default App

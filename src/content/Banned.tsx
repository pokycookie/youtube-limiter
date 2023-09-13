import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faGear, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useMemo, useState } from 'react'
import ArcValue from '../components/ui/arcValue'

function Banned() {
  const [total, setTotal] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [refreshClicked, setRefreshClicked] = useState(false)

  const percent = useMemo(() => {
    if (maxValue === 0) return 100
    else return (total / maxValue) * 100
  }, [total, maxValue])

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

  const refreshHandler = () => {
    getTotal()
  }

  useEffect(() => {
    getTotal()
  }, [])

  return (
    <div className="w-full h-full fixed left-0 top-0 z-[999999] flex items-center justify-center bg-white">
      <div className="overflow-hidden rounded-md w-96 bg-zinc-700">
        <header className="flex items-center justify-between w-full h-10 p-3 bg-zinc-800">
          <h1 className="flex items-center gap-2 text-xs font-semibold text-red-600">
            <FontAwesomeIcon
              icon={faYoutube}
              className="w-4 h-4 text-red-600"
            />
            Youtube Limiter
          </h1>
        </header>
        <div className="flex flex-col items-center justify-center p-5">
          <div className="relative flex flex-col items-center justify-center w-64 h-64 p-5 mb-5">
            <div className="w-full aspect-square">
              <ArcValue startDeg={200} endDeg={160} value={percent} />
            </div>
            <div className="absolute flex flex-col items-center gap-2">
              <span className="text-4xl text-zinc-200">
                {percent.toFixed(0)}%
              </span>
              <span className="flex gap-1 text-xs text-zinc-400">
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
              onClick={refreshHandler}
              onMouseDown={() => setRefreshClicked(true)}
              onMouseUp={() => setRefreshClicked(false)}
            >
              <FontAwesomeIcon className="w-4 h-4" icon={faRotateLeft} />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-zinc-200">
            설정된 시간을 모두 사용했습니다!
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Banned

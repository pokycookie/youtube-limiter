import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import TimeInput from '../components/ui/timeInput'
import { useEffect, useState } from 'react'
import { numberToTimeObj } from '../utils/time'

function App() {
  const [defaultMax, setDefaultMax] = useState({
    hour: 0,
    minute: 0,
    second: 0,
  })
  const [maxTime, setMaxTime] = useState(0)

  const getDefaultMaxTime = () => {
    try {
      chrome.runtime.sendMessage({ key: 'getTotal' }, (res) => {
        if (res && typeof res.maxTime === 'number') {
          setDefaultMax(numberToTimeObj(res.maxTime / 1000))
        } else console.error('Invalid response from background script')
      })
    } catch (error) {
      console.error(error)
    }
  }

  const applyHandler = () => {
    try {
      chrome.runtime.sendMessage(
        { key: 'setMaxTime', payload: { maxTime } },
        (res) => {
          if (res.status === 200) console.log('success to change maxTime')
          else console.error('Invalid response from background script')
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  const resetHandler = () => {
    try {
      chrome.runtime.sendMessage({ key: 'reset' })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getDefaultMaxTime()
  }, [])

  return (
    <div className="flex items-center justify-center w-full h-screen p-10 bg-zinc-800">
      <div className="rounded-md bg-zinc-700 w-[512px] shadow-md overflow-hidden border border-zinc-500 divide-y divide-zinc-500">
        <header className="flex items-center justify-between w-full p-2 bg-zinc-900">
          <h1 className="flex items-center gap-2 text-xs font-semibold text-red-600 h-7">
            <FontAwesomeIcon
              icon={faYoutube}
              className="w-4 h-4 text-red-600"
            />
            Youtube Limiter Options
          </h1>
        </header>
        <ul className="text-sm divide-y text-zinc-300 divide-zinc-500">
          <li className="flex items-center justify-between w-full gap-5 p-3 h-14">
            <h2 className="shrink-0">최대시청시간 설정</h2>
            <div className="shrink-0">
              <TimeInput
                unit="최대시청시간"
                default={defaultMax}
                onChange={(value) => setMaxTime(value * 1000)}
              />
            </div>
          </li>
          <li className="flex items-center justify-between w-full gap-5 p-3 h-14">
            <h2 className="shrink-0">사용시간 초기화</h2>
            <button
              onClick={resetHandler}
              className="p-2 pl-3 pr-3 text-sm text-gray-400 border rounded-md shrink-0 border-zinc-600 bg-zinc-900 hover:border-red-500 hover:text-white hover:bg-red-600"
            >
              초기화
            </button>
          </li>
        </ul>
        <div className="flex items-center justify-end w-full p-3 bg-zinc-900">
          <button
            className="p-2 pl-3 pr-3 text-sm text-gray-400 border rounded-md border-zinc-600 bg-zinc-900 hover:border-red-500 hover:text-white hover:bg-red-600"
            onClick={applyHandler}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

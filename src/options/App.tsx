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

  useEffect(() => {
    getDefaultMaxTime()
  }, [])

  return (
    <div className="w-full h-screen bg-zinc-800 flex justify-center items-center p-10">
      <div className="rounded-md bg-zinc-700 w-[512px] shadow-md overflow-hidden border border-zinc-500 divide-y divide-zinc-500">
        <header className="w-full bg-zinc-900 p-2 flex items-center justify-between">
          <h1 className="text-xs font-semibold text-red-600 flex gap-2 items-center h-7">
            <FontAwesomeIcon
              icon={faYoutube}
              className="text-red-600 w-4 h-4"
            />
            Youtube Limiter Options
          </h1>
        </header>
        <ul className="text-sm text-zinc-300 divide-y divide-zinc-500">
          <li className="w-full p-3 h-14 flex justify-between items-center gap-5">
            <h2 className="shrink-0">최대시청시간 설정</h2>
            <div className="shrink-0">
              <TimeInput
                unit="최대시청시간"
                default={defaultMax}
                onChange={(value) => setMaxTime(value * 1000)}
              />
            </div>
          </li>
          <li className="w-full p-3 h-14 flex justify-between items-center gap-5">
            <h2 className="shrink-0">사용시간 초기화</h2>
            <button className="shrink-0 p-2 pl-3 pr-3 text-sm text-gray-400 border rounded-md border-zinc-600 bg-zinc-900 hover:border-red-500 hover:text-white hover:bg-red-600">
              초기화
            </button>
          </li>
        </ul>
        <div className="w-full bg-zinc-900 p-3 flex justify-end items-center">
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

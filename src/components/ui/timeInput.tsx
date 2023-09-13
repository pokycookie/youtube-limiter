import { MouseEvent, useEffect, useRef, useState } from 'react'
import DoubleDigitInput from './doubleDigitInput'
import { timeToNumber } from '../../utils/time'

interface IProps {
  unit?: string
  onChange?: (value: number) => void
  default?: { hour: number; minute: number; second: number }
}

export default function TimeInput(props: IProps) {
  const [hour, setHour] = useState(props.default?.hour ?? 0)
  const [minute, setMinute] = useState(props.default?.minute ?? 0)
  const [second, setSecond] = useState(props.default?.second ?? 0)
  const [focus, setFocus] = useState(false)

  const hourREF = useRef<HTMLInputElement>(null)
  const minuteREF = useRef<HTMLInputElement>(null)
  const secondREF = useRef<HTMLInputElement>(null)

  const focusDivHandler = (e: MouseEvent<HTMLDivElement>) => {
    const isHourNode = e.target === hourREF.current
    const isMinuteNode = e.target === minuteREF.current
    const isSecondNode = e.target === secondREF.current
    if (!isHourNode && !isMinuteNode && !isSecondNode) {
      if (hourREF.current) hourREF.current.focus()
    }
  }

  const hourHandler = (value: number) => {
    setHour(value)
    if (props.onChange) props.onChange(timeToNumber(value, minute, second))
  }
  const minuteHandler = (value: number) => {
    setMinute(value)
    if (props.onChange) props.onChange(timeToNumber(hour, value, second))
  }
  const secondHandler = (value: number) => {
    setSecond(value)
    if (props.onChange) props.onChange(timeToNumber(hour, minute, value))
  }

  useEffect(() => {
    if (!props.default) return
    setHour(props.default.hour)
    setMinute(props.default.minute)
    setSecond(props.default.second)
  }, [props.default])

  return (
    <div
      data-focus={focus}
      onClick={focusDivHandler}
      className="flex outline outline-0 data-[focus=true]:outline-1 data-[focus=true]:border-red-600 data-[focus=true]:outline-red-600 justify-between w-full p-2 pl-3 pr-3 text-sm text-gray-400 border rounded-md border-zinc-600 bg-zinc-900"
    >
      {props.unit && (
        <span
          className="text-sm mr-2 text-gray-400 select-none data-[focus=true]:text-red-600"
          data-focus={focus}
        >
          {props.unit}
        </span>
      )}
      <div>
        <DoubleDigitInput
          ref={hourREF}
          value={hour}
          onChange={hourHandler}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          next={() => minuteREF.current?.focus()}
        />
        <span>:</span>
        <DoubleDigitInput
          ref={minuteREF}
          value={minute}
          max={59}
          onChange={minuteHandler}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          next={() => secondREF.current?.focus()}
        />
        <span>:</span>
        <DoubleDigitInput
          ref={secondREF}
          value={second}
          max={59}
          onChange={secondHandler}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>
    </div>
  )
}

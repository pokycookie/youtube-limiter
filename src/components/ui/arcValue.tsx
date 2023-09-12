import Arc from './arc'

interface IProps {
  startDeg: number
  endDeg: number
  value: number
  reverse?: boolean
  color?: string
  bgColor?: string
}

export default function ArcValue(props: IProps) {
  const diff =
    (props.reverse
      ? props.startDeg - props.endDeg + 360
      : props.endDeg - props.startDeg + 360) % 360

  const ratio = diff / 100
  const value = props.reverse
    ? props.startDeg - Math.max(Math.min(props.value, 100), 0) * ratio
    : props.startDeg + Math.max(Math.min(props.value, 100), 0) * ratio

  return (
    <svg viewBox="0 0 200 200">
      <Arc
        startDeg={props.startDeg}
        endDeg={props.endDeg}
        holeSize={85}
        color={props.bgColor ?? '#71717a'}
        reverse={props.reverse}
      />
      <Arc
        startDeg={props.startDeg}
        endDeg={value}
        holeSize={85}
        color={props.color ?? '#dc2626'}
        reverse={props.reverse}
        strokeWidth={1}
      />
    </svg>
  )
}

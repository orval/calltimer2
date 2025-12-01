import { DateTime, Duration, Interval } from 'luxon'

const CALL_DURATION = Duration.fromMillis(45 * 60 * 1000)

const Faint = { opacity: 0.1 }
const Vivid = { color: '#DB0015' }
const Green = { color: '#28BF00' }
const Amber = { color: '#E3B800' }

const Mode = {
  MoreThanAnHour: {
    hourStyle: {},
    minuteStyle: {},
    secondStyle: Faint
  },
  WithinTheHour: {
    hourStyle: Faint,
    minuteStyle: {},
    secondStyle: Faint
  },
  Within3Minutes: {
    hourStyle: Faint,
    minuteStyle: Vivid,
    secondStyle: Vivid
  },
  InCall: {
    hourStyle: Faint,
    minuteStyle: Green,
    secondStyle: Green
  },
  CloseOut: {
    hourStyle: Faint,
    minuteStyle: Amber,
    secondStyle: Amber
  },
  OverTime: {
    hourStyle: Faint,
    minuteStyle: Vivid,
    secondStyle: Vivid
  },
  HourOverTime: {
    hourStyle: Vivid,
    minuteStyle: Vivid,
    secondStyle: Vivid
  }
}

function StyledFace (props) {
  return (
    <code>
      <span style={props.mode.hourStyle}>{props.hours}:</span>
      <span style={props.mode.minuteStyle}>{props.minutes}</span>
      <span style={props.mode.secondStyle}>:{props.seconds}</span>
    </code>
  )
}

function CountdownFace (props) {
  const nowToStart = props.nowToStart
  let [hours, minutes, seconds] = nowToStart.toFormat('hh:mm:ss').split(':', 3)

  if (nowToStart.shiftTo('seconds').seconds < 180) { return <StyledFace hours={hours} minutes={minutes} seconds={seconds} mode={Mode.Within3Minutes} /> }

  // hide seconds when more than 3 minutes to go
  seconds = '00'

  if (hours === '00') { return <StyledFace hours={hours} minutes={minutes} seconds={seconds} mode={Mode.WithinTheHour} /> }

  return <StyledFace hours={hours} minutes={minutes} seconds={seconds} mode={Mode.MoreThanAnHour} />
}

function CountupFace (props) {
  const startToNow = props.startToNow
  const [hours, minutes, seconds] = startToNow.toFormat('hh:mm:ss').split(':', 3)

  const secondsSinceStart = startToNow.shiftTo('seconds').seconds
  let mode = Mode.InCall

  if (secondsSinceStart > (40 * 60)) {
    mode = Mode.CloseOut

    if (secondsSinceStart > (45 * 60)) {
      mode = Mode.OverTime

      if (secondsSinceStart > (60 * 60)) { mode = Mode.HourOverTime }
    }
  }

  return <StyledFace hours={hours} minutes={minutes} seconds={seconds} mode={mode} />
}

function CallFace (props) {
  const startToNow = props.startToNow

  let remaining = CALL_DURATION.minus(startToNow)
  let mode = Mode.InCall

  if (remaining.toMillis() <= 0) {
    remaining = remaining.negate()

    if (remaining.toMillis() > (60 * 60 * 1000)) { mode = Mode.HourOverTime } else { mode = Mode.OverTime }
  } else if (remaining.toMillis() < (5 * 60 * 1000)) {
    mode = Mode.CloseOut
  }

  const [hours, minutes, seconds] = remaining.toFormat('hh:mm:ss').split(':', 3)

  return <StyledFace hours={hours} minutes={minutes} seconds={seconds} mode={mode} />
}

function Face (props) {
  const start = props.scheduledStart

  if (DateTime.now().toMillis() < start.toMillis()) { return <CountdownFace nowToStart={Interval.fromDateTimes(DateTime.now(), start).toDuration()} /> }

  return <CallFace startToNow={Interval.fromDateTimes(start, DateTime.now()).toDuration()} />
}

export default Face

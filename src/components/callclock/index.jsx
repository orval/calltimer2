import { h, Component } from 'preact'
import { DateTime, Interval } from 'luxon'
import style from './style.module.css'
import Face from '../face'

class Callclock extends Component {
  constructor (props) {
    super(props)

    try {
      const [hours, minutes] = props.timeString.split(':', 2)
      this.scheduledStart = DateTime.fromObject({ hour: hours, minute: minutes, second: 0 })

      if (!this.scheduledStart.isValid) { throw new Error('Invalid time') }

      this.state = {
        nowToStart: Interval.fromDateTimes(DateTime.now(), this.scheduledStart)
      }
    } catch (error) {
      console.error(error.toString())
      this.state = {
        hasError: true,
        error
      }
    }
  }

  static getDerivedStateFromError (error) {
    return { hasError: true, error }
  }

  tick () {
    this.setState({
      timeToCall: Interval.fromDateTimes(DateTime.now(), this.scheduledStart)
    })
  }

  componentDidMount () {
    if (!this.state.hasError) {
      this.timerID = setInterval(() => this.tick(), 1000)
    }
  }

  componentWillUnmount () {
    clearInterval(this.timerID)
  }

  render () {
    return (
      <div class={style.callclock}>
        {this.state.hasError
          ? <div class={style.error}>Entered time is not valid</div>
          : <Face scheduledStart={this.scheduledStart} />}
      </div>
    )
  }
}

export default Callclock

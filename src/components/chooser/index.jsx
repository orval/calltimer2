import { Component } from 'preact'
import { DateTime } from 'luxon'
import style from './style.module.css'
import Callclock from '../callclock'

const re = /^\d\d:\d\d$/

class Chooser extends Component {
  state = {
    value: '18:00',
    valid: true,
    chooserStyle: style.hide,
    showCallclock: true
  }

  handleInput = e => {
    const { value } = e.target
    let valid = false

    if (!re.test(value)) {
      this.setState({ value, valid })
      return
    }

    try {
      const [hours, minutes] = value.split(':', 2)

      if (DateTime.fromObject({ hour: hours, minute: minutes, second: 0 }).isValid) {
        valid = true
      }
    } catch (error) {
      console.error(error.toString())
    }

    this.setState({ value, valid })
  }

  handleMouseEnter = () => {
    this.setState({ chooserStyle: style.chooser, showCallclock: false })
  }

  handleMouseLeave = () => {
    this.setState({ chooserStyle: this.state.valid ? style.hide : style.invalid, showCallclock: true })
  }

  render (props, { value }) {
    return (
      <div>
        <input
          class={this.state.chooserStyle} type='text' value={value} onInput={this.handleInput}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        {this.state.valid && this.state.showCallclock &&
          <Callclock class={this.state.callclockStyle} timeString={this.state.value} />}
      </div>
    )
  }
}

export default Chooser

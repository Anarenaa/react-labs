import { useState } from 'react'
import TimerView from './TimerView.jsx'

export default function BrewTimer({ method }) {
  const [status, setStatus] = useState('idle')

  return (
    <TimerView
      method={method}
      secondsLeft={method.seconds}
      status={status}
      onStart={() => setStatus('running')}
      onPause={() => setStatus('paused')}
      onReset={() => setStatus('idle')}
    />
  )
}

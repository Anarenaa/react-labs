/**
 * Зворотний відлік від `totalSeconds` до нуля, по секунді.
 *
 * Використання:
 *   const { secondsLeft, isRunning, start, pause, reset } = useCountdown(180)
 *
 * Вимоги — у тестах tests/useCountdown.test.jsx.
 */
import { useEffect, useState } from 'react'

export function useCountdown(totalSeconds) {
  const [timer, setTimer] = useState({
    secondsLeft: totalSeconds,
    isRunning: false,
  })

  useEffect(() => {
    if (!timer.isRunning) return

    const intervalId = setInterval(() => {
      setTimer((current) => {
        const secondsLeft = Math.max(current.secondsLeft - 1, 0)

        return {
          secondsLeft,
          isRunning: secondsLeft > 0,
        }
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timer.isRunning])

  // Starts or continues the countdown.
  function start() {
    setTimer((current) => {
      if (current.secondsLeft === 0) return current
      return { ...current, isRunning: true }
    })
  }

  function pause() {
    setTimer((current) => ({ ...current, isRunning: false }))
  }

  // Stops the countdown and restores the full time.
  function reset() {
    setTimer({ secondsLeft: totalSeconds, isRunning: false })
  }

  return {
    secondsLeft: timer.secondsLeft,
    isRunning: timer.isRunning,
    start,
    pause,
    reset,
  }
}

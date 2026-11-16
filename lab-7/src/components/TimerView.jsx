/**
 * Простий (presentational) компонент таймера: лише показує те, що отримав у
 * props, і викликає передані обробники. Власного стану й ефектів не має.
 *
 * Використання:
 *   <TimerView
 *     method={method}
 *     secondsLeft={175}
 *     status="running"   // 'idle' | 'running' | 'paused' | 'done'
 *     onStart={…}
 *     onPause={…}
 *     onReset={…}
 *   />
 *
 * Вимоги — у тестах tests/TimerView.test.jsx.
 */
import { formatTime } from '../formatTime'

export default function TimerView({
  method,
  secondsLeft,
  status,
  onStart,
  onPause,
  onReset,
}) {
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isDone = status === 'done'

  const primaryLabel = isRunning
    ? 'Пауза'
    : isDone
      ? 'Спочатку'
      : isPaused
        ? 'Продовжити'
        : 'Старт'

  const primaryAction = isRunning ? onPause : isDone ? onReset : onStart

  return (
    <article className="brew-timer" aria-labelledby={`${method.id}-title`}>
      <h3 id={`${method.id}-title`}>{method.name}</h3>
      <p>{method.recipe}</p>
      <p className="time" role="timer">
        {formatTime(secondsLeft)}
      </p>
      <div className="timer-controls">
        <button type="button" onClick={primaryAction}>
          {primaryLabel}
        </button>

        {(isRunning || isPaused) && (
          <button type="button" onClick={onReset}>
            Скинути
          </button>
        )}
      </div>
      <p className="timer-done" role="status">
        {isDone ? 'Готово! Час пити каву.' : ''}
      </p>
    </article>
  )
}

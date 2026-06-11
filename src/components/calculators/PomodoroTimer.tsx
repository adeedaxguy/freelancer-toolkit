'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type Mode = 'work' | 'short' | 'long'

const DEFAULTS = { work: 25, short: 5, long: 15 }
const MODE_LABELS: Record<Mode, string> = { work: 'Focus', short: 'Short Break', long: 'Long Break' }
const MODE_COLORS: Record<Mode, string> = {
  work: 'border-red-200 bg-red-50 text-red-700',
  short: 'border-green-200 bg-green-50 text-green-700',
  long: 'border-blue-200 bg-blue-50 text-blue-700',
}
const MODE_RING: Record<Mode, string> = { work: '#ef4444', short: '#22c55e', long: '#3b82f6' }

export default function PomodoroTimer() {
  const [settings, setSettings] = useState(DEFAULTS)
  const [mode, setMode] = useState<Mode>('work')
  const [secondsLeft, setSecondsLeft] = useState(DEFAULTS.work * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [taskName, setTaskName] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const totalSeconds = settings[mode] * 60
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch { /* AudioContext may be blocked */ }
  }, [])

  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode)
    setSecondsLeft(settings[newMode] * 60)
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [settings])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          playBeep()
          if (mode === 'work') {
            setSessions((n) => {
              const next = n + 1
              if (next % 4 === 0) switchMode('long')
              else switchMode('short')
              return next
            })
          } else {
            switchMode('work')
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode, playBeep, switchMode])

  const toggle = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(settings[mode] * 60)
      setRunning(true)
    } else {
      setRunning((r) => !r)
    }
  }

  const reset = () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSecondsLeft(settings[mode] * 60)
  }

  const resetAll = () => {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSessions(0)
    switchMode('work')
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')

  // SVG ring
  const R = 90
  const C = 2 * Math.PI * R
  const dashOffset = C * (1 - progress)

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Mode switcher */}
      <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
        {(['work', 'short', 'long'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${mode === m ? `${MODE_COLORS[m]} border` : 'text-gray-500 hover:text-gray-700'}`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Task name */}
      <div>
        <input
          className="input-field h-10 text-center"
          placeholder="What are you working on? (optional)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>

      {/* Timer ring */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <svg width={220} height={220} className="-rotate-90">
            <circle cx={110} cy={110} r={R} fill="none" stroke="#f3f4f6" strokeWidth={10} />
            <circle
              cx={110} cy={110} r={R}
              fill="none"
              stroke={MODE_RING[mode]}
              strokeWidth={10}
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-bold tabular-nums text-gray-900">{mins}:{secs}</span>
            <span className={`mt-1 text-xs font-semibold uppercase tracking-widest ${mode === 'work' ? 'text-red-500' : mode === 'short' ? 'text-green-500' : 'text-blue-500'}`}>
              {MODE_LABELS[mode]}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={reset} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Reset
          </button>
          <button
            onClick={toggle}
            className={`rounded-xl px-8 py-3 text-base font-bold text-white transition ${running ? 'bg-gray-700 hover:bg-gray-800' : mode === 'work' ? 'bg-red-500 hover:bg-red-600' : mode === 'short' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {running ? '⏸ Pause' : secondsLeft === 0 ? '↺ Restart' : '▶ Start'}
          </button>
          <button onClick={resetAll} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            New Day
          </button>
        </div>
      </div>

      {/* Session count */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">Today&apos;s Sessions</p>
          <p className="text-xs text-gray-400">{sessions} completed · {(sessions * settings.work / 60).toFixed(1)}h focused</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sessions === 0 ? (
            <p className="text-xs text-gray-400">No sessions yet — start your first pomodoro!</p>
          ) : (
            Array.from({ length: sessions }).map((_, i) => (
              <div key={i} className={`h-6 w-6 rounded ${(i + 1) % 4 === 0 ? 'bg-blue-400' : 'bg-red-400'}`} title={`Session ${i + 1}${(i + 1) % 4 === 0 ? ' (long break after)' : ''}`} />
            ))
          )}
        </div>
        {sessions > 0 && sessions % 4 === 0 && (
          <p className="mt-2 text-xs font-medium text-blue-600">🎉 4 sessions done — take a long break!</p>
        )}
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <button
          onClick={() => setShowSettings((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-gray-700"
        >
          <span>⚙ Customize Intervals</span>
          <span className="text-gray-400">{showSettings ? '▲' : '▼'}</span>
        </button>
        {showSettings && (
          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 p-5">
            {(['work', 'short', 'long'] as Mode[]).map((m) => (
              <div key={m}>
                <label className="mb-1 block text-xs font-medium text-gray-600">{MODE_LABELS[m]} (min)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={settings[m]}
                  style={{ fontSize: 'max(16px, 0.875rem)' }}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value))
                    setSettings((s) => ({ ...s, [m]: val }))
                    if (m === mode) { setSecondsLeft(val * 60); setRunning(false) }
                  }}
                  className="input-field h-10"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

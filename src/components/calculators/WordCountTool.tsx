'use client'

import { useState, useMemo } from 'react'

function fleschScore(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  if (words.length === 0 || sentences.length === 0) return 0
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0)
  const asl = words.length / sentences.length
  const asw = syllables / words.length
  return Math.min(100, Math.max(0, 206.835 - 1.015 * asl - 84.6 * asw))
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return m ? m.length : 1
}

function fleschLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Very Easy (5th grade)', color: 'text-green-600' }
  if (score >= 70) return { label: 'Easy (6th grade)', color: 'text-green-500' }
  if (score >= 60) return { label: 'Standard (7th–8th grade)', color: 'text-blue-600' }
  if (score >= 50) return { label: 'Fairly Difficult (High school)', color: 'text-amber-500' }
  if (score >= 30) return { label: 'Difficult (College)', color: 'text-orange-500' }
  return { label: 'Very Difficult (Professional)', color: 'text-red-600' }
}

function topWords(text: string, n = 10): { word: string; count: number }[] {
  const STOP = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','was','are','were','be','been','have','has','had','do','does','did','this','that','it','its','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their','what','which','who','how','when','where','as','by','from','not','if','so','than','then'])
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? []
  const freq: Record<string, number> = {}
  for (const w of words) {
    if (!STOP.has(w)) freq[w] = (freq[w] ?? 0) + 1
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }))
}

export default function WordCountTool() {
  const [text, setText] = useState('')
  const [showTopWords, setShowTopWords] = useState(false)

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : []
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0)
    const charsWithSpaces = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const readingMinutes = words.length / 230
    const speakingMinutes = words.length / 150
    const score = fleschScore(text)
    const { label: readLabel, color: readColor } = fleschLabel(score)
    const top = showTopWords ? topWords(text) : []
    return { words: words.length, sentences: sentences.length, paragraphs: paragraphs.length, charsWithSpaces, charsNoSpaces, readingMinutes, speakingMinutes, score, readLabel, readColor, top }
  }, [text, showTopWords])

  const fmtTime = (mins: number) => {
    if (mins < 1) return `${Math.round(mins * 60)}s`
    return `${Math.floor(mins)}m ${Math.round((mins % 1) * 60)}s`
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Input */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Your Text</h2>
          {text && (
            <button onClick={() => setText('')} className="text-xs text-gray-400 hover:text-gray-600 transition">Clear</button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here…"
          className="w-full flex-1 min-h-[320px] resize-y rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 placeholder-gray-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <p className="text-xs text-gray-400">{stats.words} words · {stats.charsWithSpaces} characters</p>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Analysis</h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Words', value: stats.words.toLocaleString() },
            { label: 'Characters', value: stats.charsWithSpaces.toLocaleString() },
            { label: 'No Spaces', value: stats.charsNoSpaces.toLocaleString() },
            { label: 'Sentences', value: stats.sentences.toLocaleString() },
            { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
            { label: 'Avg. Words/Sentence', value: stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : '—' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">Reading Time</p>
            <p className="mt-1 text-xl font-bold text-blue-700">{text ? fmtTime(stats.readingMinutes) : '—'}</p>
            <p className="text-xs text-blue-400">at 230 wpm</p>
          </div>
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-purple-400">Speaking Time</p>
            <p className="mt-1 text-xl font-bold text-purple-700">{text ? fmtTime(stats.speakingMinutes) : '—'}</p>
            <p className="text-xs text-purple-400">at 150 wpm</p>
          </div>
        </div>

        {/* Readability */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Flesch Reading Ease</p>
          <div className="flex items-end gap-3">
            <p className={`text-3xl font-bold ${text ? stats.readColor : 'text-gray-300'}`}>
              {text ? stats.score.toFixed(0) : '—'}
            </p>
            <p className={`mb-1 text-sm font-medium ${text ? stats.readColor : 'text-gray-300'}`}>{text ? stats.readLabel : 'Paste text to analyse'}</p>
          </div>
          {text && (
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${stats.score}%` }} />
            </div>
          )}
        </div>

        {/* Character limits */}
        {text && (
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-800 space-y-1">
            <p className="font-semibold mb-1">Platform Limits</p>
            <p>Twitter/X (280): <span className={stats.charsWithSpaces > 280 ? 'font-bold text-red-600' : 'font-medium text-green-700'}>{stats.charsWithSpaces}/280 {stats.charsWithSpaces > 280 ? '⚠ Over' : '✓ OK'}</span></p>
            <p>LinkedIn post (3,000): <span className={stats.charsWithSpaces > 3000 ? 'font-bold text-red-600' : 'font-medium text-green-700'}>{stats.charsWithSpaces}/3,000 {stats.charsWithSpaces > 3000 ? '⚠ Over' : '✓ OK'}</span></p>
            <p>SMS (160 chars): <span className={stats.charsWithSpaces > 160 ? 'font-bold text-red-600' : 'font-medium text-green-700'}>{stats.charsWithSpaces}/160 {stats.charsWithSpaces > 160 ? `(${Math.ceil(stats.charsWithSpaces / 160)} messages)` : '✓ 1 message'}</span></p>
          </div>
        )}

        {/* Top words */}
        <button
          onClick={() => setShowTopWords((v) => !v)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          {showTopWords ? 'Hide' : 'Show'} Top Keywords
        </button>
        {showTopWords && stats.top.length > 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">Top Words (excluding stop words)</p>
            <div className="flex flex-wrap gap-2">
              {stats.top.map((w) => (
                <span key={w.word} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                  {w.word} <span className="text-gray-400">×{w.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

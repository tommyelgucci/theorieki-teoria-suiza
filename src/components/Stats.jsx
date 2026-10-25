import { useRef, useState } from 'react'
import { useLang, t, tr, dateLocale } from '../i18n'
import { storage } from '../storage'
import questions from '../data/questions.json'
import { TOPICS } from '../data/topics'
import { FIRSTAID_CARDS } from '../data/firstaid'
import { SIGNS } from '../data/signs'
import ProgressRing from './ProgressRing'
import { CarIcon, MotoIcon } from './CategoryIcons'
import {
  IconFlame,
  IconCalendar,
  IconPencil,
  IconStack,
  IconStopwatch,
  IconCheck,
  IconCross,
  IconCards,
  IconFirstAid,
  IconWarningSign,
  IconSave,
  IconDownload,
  IconUpload,
  IconCopy,
} from './Icons'

function StatTile({ icon, value, label, ring }) {
  return (
    <div className="flex-1 rounded-2xl bg-surface p-3 text-center shadow-card ring-1 ring-line">
      {ring != null ? (
        <div className="flex justify-center">
          <ProgressRing value={ring} size={52} stroke={5} color="#da291c">
            {icon}
          </ProgressRing>
        </div>
      ) : (
        <div className="flex justify-center">{icon}</div>
      )}
      <div className="mt-0.5 text-xl font-bold text-ink">{value}</div>
      <div className="text-[11px] leading-tight text-muted">{label}</div>
    </div>
  )
}

function TopicBars() {
  const { lang } = useLang()
  const stats = storage.getStats()

  const byTopic = {}
  for (const q of questions) {
    const s = stats[q.id]
    if (!s || s.seen === 0) continue
    const agg = byTopic[q.topic] || { correct: 0, wrong: 0 }
    agg.correct += s.correct
    agg.wrong += s.wrong
    byTopic[q.topic] = agg
  }

  const rows = TOPICS.filter((tp) => byTopic[tp.id])
    .map((tp) => {
      const { correct, wrong } = byTopic[tp.id]
      return { topic: tp, pct: Math.round((100 * correct) / (correct + wrong)), total: correct + wrong }
    })
    .sort((a, b) => a.pct - b.pct)

  if (rows.length === 0) {
    return <p className="text-sm text-muted">{t('noStatsYet', lang)}</p>
  }

  return (
    <div className="space-y-2.5">
      {rows.map(({ topic, pct, total }, n) => (
        <div key={topic.id}>
          <div className="mb-0.5 flex items-baseline justify-between text-xs">
            <span className="font-medium text-body">{tr(topic.label, lang)}</span>
            <span className="text-muted">
              {pct}% · {total}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-track">
            <div
              className={`grow-x h-full rounded-full ${
                pct >= 80
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : pct >= 55
                    ? 'bg-gradient-to-r from-amber-300 to-amber-500'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${Math.max(pct, 4)}%`, animationDelay: `${120 + n * 60}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Backup() {
  const { lang } = useLang()
  const [text, setText] = useState('')
  const [msg, setMsg] = useState(null)
  const textareaRef = useRef(null)

  function doExport() {
    const json = storage.exportAll()
    setText(json)
    setMsg(null)
    // intento de descarga; en iOS desde Archivos puede no funcionar, por eso también queda el textarea
    try {
      const blob = new Blob([json], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `chfahren-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      // sin descarga: el usuario copia el texto
    }
  }

  async function doCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setMsg(t('copiedMsg', lang))
    } catch {
      textareaRef.current?.select()
      document.execCommand('copy')
      setMsg(t('copiedMsg', lang))
    }
  }

  function doImport() {
    if (!window.confirm(t('importConfirm', lang))) return
    try {
      const { skipped } = storage.importAll(text.trim())
      setMsg(skipped > 0 ? t('importPartial', lang, { n: skipped }) : t('importDone', lang))
      setTimeout(() => window.location.reload(), skipped > 0 ? 1800 : 600)
    } catch {
      setMsg(t('importError', lang))
    }
  }

  return (
    <details className="stagger group rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line" style={{ '--i': 4 }}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 font-bold text-ink [&::-webkit-details-marker]:hidden">
        <IconSave className="h-5 w-5" /> <span className="flex-1">{t('backupTitle', lang)}</span>
        <span aria-hidden className="text-muted transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <p className="mb-3 mt-1 text-xs text-muted">{t('backupHint', lang)}</p>
      <div className="flex gap-2">
        <button
          onClick={doExport}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-swiss py-2.5 text-sm font-semibold text-white hover:bg-swiss-dark transition-all active:scale-[0.98]"
        >
          <IconDownload className="h-4 w-4" /> {t('exportBtn', lang)}
        </button>
        <button
          onClick={doImport}
          disabled={!text.trim()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface py-2.5 text-sm font-semibold text-body ring-1 ring-line-strong disabled:opacity-40"
        >
          <IconUpload className="h-4 w-4" /> {t('importBtn', lang)}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setMsg(null)
        }}
        placeholder={t('pasteHere', lang)}
        rows={3}
        className="mt-3 w-full rounded-xl border border-line bg-sunken p-2 font-mono text-[10px] text-body"
      />
      <div className="mt-1 flex items-center justify-between">
        {text.trim() ? (
          <button onClick={doCopy} className="inline-flex items-center gap-1 text-xs font-semibold text-swiss underline">
            <IconCopy className="h-3.5 w-3.5" /> {t('copyBtn', lang)}
          </button>
        ) : (
          <span />
        )}
        {msg && <span className="text-xs font-medium text-green-600 dark:text-green-400">{msg}</span>}
      </div>
    </details>
  )
}

export default function Stats() {
  const { lang } = useLang()
  const streak = storage.getStreak()
  const daysStudied = storage.getStudyDays().length
  const stats = storage.getStats()
  const answered = Object.values(stats).reduce((sum, s) => sum + s.seen, 0)
  const history = storage.getExamHistory().slice(-10).reverse()
  const fa = storage.srsCounts('firstaid', FIRSTAID_CARDS.map((c) => c.id))
  const sg = storage.srsCounts('signs', SIGNS.map((s) => s.id))

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-4">
      <div className="stagger flex gap-3" style={{ '--i': 0 }}>
        <StatTile
          icon={<IconFlame className="h-3.5 w-3.5 text-swiss" />}
          value={streak}
          label={t('streakDays', lang)}
          ring={Math.min(100, storage.getDailyCount() * 5)}
        />
        <StatTile icon={<IconCalendar className="h-6 w-6 text-body" />} value={daysStudied} label={t('daysStudied', lang)} />
        <StatTile icon={<IconPencil className="h-6 w-6 text-body" />} value={answered} label={t('answeredTotal', lang)} />
      </div>

      <div className="stagger rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line" style={{ '--i': 1 }}>
        <h2 className="flex items-center gap-1.5 font-bold text-ink">
          <IconStack className="h-5 w-5" /> {t('byTopic', lang)}
        </h2>
        <p className="mb-3 text-xs text-muted">{t('byTopicHint', lang)}</p>
        <TopicBars />
      </div>

      <div className="stagger rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line" style={{ '--i': 2 }}>
        <h2 className="mb-3 flex items-center gap-1.5 font-bold text-ink">
          <IconStopwatch className="h-5 w-5" /> {t('examHistoryTitle', lang)}
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted">{t('noStatsYet', lang)}</p>
        ) : (
          <ul className="space-y-2">
            {history.map((e, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 text-body">
                  {new Date(e.date).toLocaleDateString(dateLocale(lang))} ·{' '}
                  {e.category === 'B' ? <CarIcon className="h-3.5 w-auto" /> : <MotoIcon className="h-3.5 w-auto" />}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-ink">
                  {e.penalty}/{e.maxPenalty} {t('points', lang)}{' '}
                  {e.passed ? (
                    <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <IconCross className="h-3.5 w-3.5 text-red-500" />
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="stagger rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line" style={{ '--i': 3 }}>
        <h2 className="mb-3 flex items-center gap-1.5 font-bold text-ink">
          <IconCards className="h-5 w-5" /> {t('cardsProgress', lang)}
        </h2>
        <ul className="space-y-1.5 text-sm text-body">
          <li className="flex justify-between">
            <span className="inline-flex items-center gap-1.5">
              <IconFirstAid className="h-4 w-4" /> Nothelfer
            </span>
            <span>
              {fa.inReview}/{FIRSTAID_CARDS.length} · {fa.mastered} {t('mastered', lang)}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="inline-flex items-center gap-1.5">
              <IconWarningSign className="h-4 w-4" /> {t('menuSigns', lang)}
            </span>
            <span>
              {sg.inReview}/{SIGNS.length} · {sg.mastered} {t('mastered', lang)}
            </span>
          </li>
        </ul>
      </div>

      <Backup />
    </div>
  )
}

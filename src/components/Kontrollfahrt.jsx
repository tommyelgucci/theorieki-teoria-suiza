import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { storage } from '../storage'
import { KF_SECTIONS, KF_MISTAKES, KF_CHECKLIST, KF_LINKS } from '../data/kontrollfahrt'
import { Icon } from './Icons'

function Accordion({ items, renderExtra }) {
  const { lang } = useLang()
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div key={item.id} className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line">
            <button
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-swiss dark:bg-red-900/40 dark:text-red-300">
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
              <span className="flex-1 font-semibold text-ink">{tr(item.title, lang)}</span>
              <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isOpen && (
              <div className="reveal-in space-y-3 border-t border-line p-4 pt-3">
                {item.bullets ? (
                  <ul className="space-y-3">
                    {item.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-body">
                        <span className="text-swiss">•</span>
                        <span>{tr(b, lang)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed text-body">{tr(item.detail, lang)}</p>
                )}
                {renderExtra && renderExtra(item)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Kontrollfahrt({ navigate }) {
  const { lang } = useLang()
  const [checked, setChecked] = useState(() => storage.getChecked('kontrollfahrt'))

  function toggleCheck(id) {
    setChecked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      storage.setChecked('kontrollfahrt', next)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-5">
      <div className="rounded-2xl bg-red-50 dark:bg-red-900/30 p-4 text-sm leading-relaxed text-red-900 dark:text-red-200 ring-1 ring-red-200 dark:ring-red-800">
        🛂 {t('kfIntro', lang)}
      </div>

      <Accordion items={KF_SECTIONS} />

      <div>
        <h2 className="mb-1 font-bold text-ink">❌ {t('kfMistakesTitle', lang)}</h2>
        <p className="mb-3 text-xs text-muted">{t('kfMistakesSub', lang)}</p>
        <Accordion
          items={KF_MISTAKES}
          renderExtra={(item) =>
            (item.topic || item.maneuver) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {item.topic && (
                  <button
                    onClick={() => navigate('study', item.topic)}
                    className="rounded-full bg-swiss px-3 py-1.5 text-xs font-semibold text-white hover:bg-swiss-dark transition-all active:scale-[0.98]"
                  >
                    📖 {t('practiceTopic', lang)}
                  </button>
                )}
                {item.maneuver && (
                  <button
                    onClick={() => navigate('maneuvers')}
                    className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-body ring-1 ring-line-strong hover:bg-sunken"
                  >
                    🚘 {t('viewManeuvers', lang)}
                  </button>
                )}
              </div>
            )
          }
        />
      </div>

      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-line">
        <h2 className="font-bold text-ink">✅ {t('kfChecklistTitle', lang)}</h2>
        <p className="mb-3 text-xs text-muted">{t('kfChecklistSub', lang)}</p>
        <ul className="space-y-2.5">
          {KF_CHECKLIST.map((item) => {
            const done = checked.includes(item.id)
            return (
              <li key={item.id}>
                <button onClick={() => toggleCheck(item.id)} className="flex w-full items-start gap-3 text-left">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                      done ? 'bg-green-600 text-white' : 'bg-subtle ring-1 ring-line-strong'
                    }`}
                  >
                    {done ? '✓' : ''}
                  </span>
                  <span className={`text-sm leading-relaxed ${done ? 'text-gray-400 line-through' : 'text-body'}`}>
                    {tr(item.text, lang)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-3 text-right text-xs font-semibold text-muted">
          {checked.length}/{KF_CHECKLIST.length}
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-line">
        <h2 className="mb-2 font-bold text-ink">🔗 {t('officialLinks', lang)}</h2>
        <ul className="space-y-1.5">
          {KF_LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-swiss underline">
                {tr(l.label, lang)} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { NUMBER_GROUPS, NUMBER_ROWS, NUMBER_CARDS, numberValue } from '../data/numbers'
import CardDeck from './CardDeck'

function Overview() {
  const { lang } = useLang()
  return (
    <div className="space-y-5">
      {NUMBER_GROUPS.map((g, gi) => (
        <section key={g.id} style={{ '--i': gi }} className="stagger">
          <h2 className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted">{tr(g.title, lang)}</h2>
          <dl className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
            {NUMBER_ROWS.filter((r) => r.group === g.id).map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <dt className="min-w-0 flex-1 text-sm leading-snug text-body">{tr(r.label, lang)}</dt>
                <dd className="max-w-[50%] shrink-0 text-right text-sm font-bold leading-snug text-swiss">{numberValue(r, lang)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}

export default function Numbers() {
  const { lang } = useLang()
  const [tab, setTab] = useState('overview')
  const tabs = [
    { id: 'overview', label: t('numbersOverview', lang) },
    { id: 'cards', label: t('numbersCards', lang) },
  ]

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
      <div role="tablist" className="flex gap-1 rounded-full bg-subtle p-1">
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors ${
              tab === x.id ? 'bg-surface text-ink shadow-card' : 'text-muted'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      {tab === 'overview' ? <Overview /> : <CardDeck module="numbers" cards={NUMBER_CARDS} />}
    </div>
  )
}

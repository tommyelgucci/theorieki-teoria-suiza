import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { VOCAB, VOCAB_CARDS } from '../data/vocab'
import CardDeck from './CardDeck'

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function List() {
  const { lang } = useLang()
  const [query, setQuery] = useState('')
  const q = norm(query.trim())
  const rows = q ? VOCAB.filter((w) => norm(w.term).includes(q) || norm(tr(w.def, lang)).includes(q)) : VOCAB

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('vocabSearch', lang)}
        aria-label={t('vocabSearch', lang)}
        className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted"
      />
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t('vocabNoResults', lang)}</p>
      ) : (
        <dl className="divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
          {rows.map((w) => (
            <div key={w.id} className="px-4 py-3">
              <dt className="font-bold text-ink">{w.term}</dt>
              <dd className="mt-0.5 text-sm leading-snug text-body">{tr(w.def, lang)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

export default function Vocab() {
  const { lang } = useLang()
  const [tab, setTab] = useState('list')
  const tabs = [
    { id: 'list', label: t('numbersOverview', lang) },
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
      {tab === 'list' ? <List /> : <CardDeck module="vocab" cards={VOCAB_CARDS} />}
    </div>
  )
}

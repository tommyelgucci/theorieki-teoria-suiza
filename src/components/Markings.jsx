import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { MARKINGS, MARKING_CARDS } from '../data/markings'
import CardDeck from './CardDeck'
import MarkingSprite from './MarkingSprite'

function Explore() {
  const { lang } = useLang()
  return (
    <div className="space-y-3">
      {MARKINGS.map((m, i) => (
        <article
          key={m.id}
          style={{ '--i': i % 8 }}
          className="stagger flex items-start gap-3 rounded-2xl bg-surface p-3 shadow-card ring-1 ring-line"
        >
          <MarkingSprite id={m.id} width={104} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold leading-snug text-ink">{tr(m.name, lang)}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-body">{tr(m.meaning, lang)}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function Markings() {
  const { lang } = useLang()
  const [tab, setTab] = useState('explore')
  const tabs = [
    { id: 'explore', label: t('signsExplore', lang) },
    { id: 'cards', label: t('faCardsTitle', lang) },
  ]

  return (
    <div className="space-y-4">
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
      {tab === 'explore' ? (
        <Explore />
      ) : (
        <CardDeck
          module="markings"
          cards={MARKING_CARDS}
          renderFront={(card) => (
            <>
              <MarkingSprite id={card.id} width={220} />
              <span className="mt-3 text-sm font-semibold text-muted">{t('whatMarking', lang)}</span>
            </>
          )}
          renderBack={(card) => (
            <>
              <span className="text-lg font-bold leading-snug text-swiss-dark dark:text-red-300">{tr(card.name, lang)}</span>
              <span className="mt-2 text-sm leading-relaxed text-body">{tr(card.back, lang)}</span>
            </>
          )}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useLang, t, tr, dateLocale } from '../i18n'
import { storage } from '../storage'
import { shuffle, canSpeak, speakDe } from '../utils'
import { IconCards, IconSpeaker, IconTap, IconConfetti, IconQuestionBubble, IconBulb } from './Icons'

/**
 * Mazo de tarjetas con repetición espaciada, reutilizable.
 * - module: clave SRS en storage (p. ej. 'numbers')
 * - cards: [{ id, front, back }] con front/back = textos por idioma
 * - renderFront / renderBack: opcionales, para tarjetas que no son solo texto (p. ej. un dibujo)
 */
export default function CardDeck({ module, cards, renderFront, renderBack }) {
  const { lang } = useLang()
  const ids = cards.map((c) => c.id)
  const [deck, setDeck] = useState(() => {
    const due = new Set(storage.srsDueIds(module, ids))
    return shuffle(cards.filter((c) => due.has(c.id)))
  })
  const [flipped, setFlipped] = useState(false)
  const { inReview } = storage.srsCounts(module, ids)
  const card = deck[0]

  if (!card) {
    const nextDue = storage.srsNextDue(module)
    return (
      <div className="rounded-2xl bg-surface p-8 text-center shadow-card ring-1 ring-line">
        <IconConfetti className="mx-auto h-10 w-10 text-swiss" />
        <p className="mt-3 text-lg font-semibold text-ink">{t('allCaughtUp', lang)}</p>
        {nextDue && (
          <p className="mt-1 text-sm text-muted">
            {t('nextReview', lang)}: {new Date(nextDue).toLocaleDateString(dateLocale(lang))}
          </p>
        )}
        <button
          onClick={() => {
            setDeck(shuffle([...cards]))
            setFlipped(false)
          }}
          className="mt-4 rounded-xl bg-swiss px-5 py-2.5 font-semibold text-white transition-all hover:bg-swiss-dark active:scale-[0.98]"
        >
          {t('practiceAnyway', lang)}
        </button>
      </div>
    )
  }

  function markKnown() {
    storage.srsPromote(module, card.id)
    storage.touchStudyDay()
    setDeck((d) => d.slice(1))
    setFlipped(false)
  }

  function repeatLater() {
    storage.srsDemote(module, card.id)
    setDeck((d) => [...d.slice(1), d[0]])
    setFlipped(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span className="inline-flex items-center gap-1">
          <IconCards className="h-4 w-4" /> {deck.length} {t('dueToday', lang)}
        </span>
        <span className="flex items-center gap-2">
          {canSpeak() && (
            <button
              onClick={() => speakDe(flipped ? card.back.de : card.front.de)}
              aria-label={t('listenDe', lang)}
              className="rounded-full opacity-70 hover:opacity-100"
            >
              <IconSpeaker className="h-4 w-4" />
            </button>
          )}
          ✓ {inReview}/{cards.length} {t('cardsLearned', lang)}
        </span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className={`flex min-h-56 w-full flex-col items-center justify-center rounded-2xl p-6 text-center shadow-card ring-1 transition-colors ${
          flipped ? 'bg-red-50 ring-swiss/40 dark:bg-red-900/30' : 'bg-surface ring-line'
        }`}
      >
        <span key={String(flipped)} className="flip-in flex flex-col items-center">
          {flipped ? (
            (renderBack && renderBack(card, lang)) || (
              <>
                <span className="mb-2 text-faint">
                  <IconBulb className="h-6 w-6" />
                </span>
                <span className="text-lg font-bold leading-snug text-swiss-dark dark:text-red-300">{tr(card.back, lang)}</span>
              </>
            )
          ) : (
            (renderFront && renderFront(card, lang)) || (
              <>
                <span className="mb-2 text-faint">
                  <IconQuestionBubble className="h-6 w-6" />
                </span>
                <span className="text-lg font-semibold leading-snug text-ink">{tr(card.front, lang)}</span>
              </>
            )
          )}
        </span>
        <span className="mt-4 inline-flex items-center gap-1 text-xs text-muted">
          <IconTap className="h-3.5 w-3.5" /> {t('tapToFlip', lang)}
        </span>
      </button>

      <div className="flex gap-2">
        <button
          onClick={repeatLater}
          className="flex-1 rounded-xl bg-surface py-3 font-semibold text-body ring-1 ring-line-strong transition-all hover:bg-sunken active:scale-[0.98]"
        >
          ↻ {t('repeatCard', lang)}
        </button>
        <button
          onClick={markKnown}
          className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-700 active:scale-[0.98]"
        >
          ✓ {t('iKnowIt', lang)}
        </button>
      </div>
    </div>
  )
}

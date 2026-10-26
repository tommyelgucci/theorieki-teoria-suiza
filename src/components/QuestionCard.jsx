import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { storage } from '../storage'
import { topicLabel } from '../data/topics'
import { hasMultipleCorrect, canSpeak, speakDe } from '../utils'
import { SIGNS } from '../data/signs'
import SignSprite from './SignSprite'
import SceneDiagram from './SceneDiagram'
import MarkingSprite from './MarkingSprite'
import { CarIcon, MotoIcon } from './CategoryIcons'
import { IconSpeaker, IconCross, IconBulb } from './Icons'

function QuestionImage({ image }) {
  if (!image) return null
  if (image.type === 'sign') {
    const sign = SIGNS.find((s) => s.id === image.id)
    return sign ? (
      <div className="my-3 flex justify-center">
        <SignSprite draw={sign.draw} size={110} />
      </div>
    ) : null
  }
  if (image.type === 'marking') {
    return (
      <div className="my-3 flex justify-center">
        <MarkingSprite id={image.id} width={220} />
      </div>
    )
  }
  if (image.type === 'scene') {
    return (
      <div className="my-3">
        <SceneDiagram id={image.id} />
      </div>
    )
  }
  return null
}

/**
 * Tarjeta de pregunta compartida por los modos estudio, examen y repaso.
 * - selected: array de ids de opciones marcadas
 * - revealed: si true, muestra corrección (verde/rojo) y bloquea cambios
 */
export default function QuestionCard({ question, selected, onToggle, revealed, showTopic = true }) {
  const { lang } = useLang()
  const multi = hasMultipleCorrect(question)
  // El examen real es en alemán, francés o italiano: quien estudia en otro idioma puede ver el original debajo.
  const [showDe, setShowDe] = useState(() => storage.getShowDe())
  const withDe = showDe && lang !== 'de'
  const toggleDe = () => {
    storage.setShowDe(!showDe)
    setShowDe(!showDe)
  }

  return (
    <div className="q-in rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line">
      {showTopic && (
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-subtle px-2.5 py-0.5 text-xs font-medium text-body">
            {topicLabel(question.topic, lang)}
          </span>
          {question.category !== 'both' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs font-medium text-body">
              {question.category === 'B' ? <CarIcon className="h-3 w-auto" /> : <MotoIcon className="h-3 w-auto" />} {question.category}
            </span>
          )}
        </div>
      )}

      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 text-base font-semibold leading-snug text-ink">
          {tr(question.question, lang)}
          {withDe && <span className="mt-1 block text-sm font-normal italic text-muted">{question.question.de}</span>}
        </p>
        {lang !== 'de' && (
          <button
            onClick={toggleDe}
            aria-pressed={showDe}
            aria-label={t('showGerman', lang)}
            title={t('showGerman', lang)}
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 transition-colors ${
              showDe ? 'bg-swiss text-white ring-swiss' : 'bg-subtle text-muted ring-line'
            }`}
          >
            DE
          </button>
        )}
        {canSpeak() && (
          <button
            onClick={() => speakDe(question.question.de)}
            aria-label={t('listenDe', lang)}
            title={t('listenDe', lang)}
            className="shrink-0 rounded-full p-1 opacity-60 hover:opacity-100"
          >
            <IconSpeaker className="h-5 w-5" />
          </button>
        )}
      </div>
      <QuestionImage image={question.image} />
      {multi && !revealed && <p className="mt-1 text-xs text-muted">☑︎ {t('multiHint', lang)}</p>}

      <div className="mt-4 space-y-2">
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.id)
          let cls =
            'border-line bg-sunken hover:border-line-strong'
          if (!revealed && isSelected)
            cls = 'border-swiss bg-red-50 ring-1 ring-swiss dark:bg-red-900/30'
          if (revealed) {
            if (opt.correct) cls = 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/30'
            else if (isSelected) cls = 'shake border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
            else cls = 'border-line bg-sunken opacity-60'
          }
          return (
            <button
              key={opt.id}
              disabled={revealed}
              // Sin esto, el estado de la opción sólo existía en el color y en un
              // ✓ que se oculta con text-transparent: sigue en el árbol de
              // accesibilidad, así que un lector de pantalla leía "✓" en todas
              // las opciones, estuvieran marcadas o no.
              aria-pressed={isSelected}
              onClick={() => onToggle(opt.id)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-[background-color,border-color,opacity,transform] duration-150 enabled:active:scale-[0.985] ${cls}`}
            >
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                  isSelected
                    ? 'border-swiss bg-swiss text-white'
                    : 'border-line-strong bg-surface text-transparent'
                } ${revealed && opt.correct ? 'pop !border-green-600 !bg-green-600 !text-white' : ''}`}
              >
                ✓
              </span>
              <span className="text-ink">
                {tr(opt.text, lang)}
                {withDe && <span className="mt-0.5 block text-xs italic text-muted">{opt.text.de}</span>}
              </span>
              {revealed && isSelected && !opt.correct && <IconCross className="ml-auto h-4 w-4 shrink-0 text-red-500" />}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="reveal-in mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-900/30 dark:text-blue-200">
          <p className="mb-1 flex items-center gap-1 font-semibold">
            <IconBulb className="h-4 w-4" /> {t('explanation', lang)}
          </p>
          <p>{tr(question.explanation, lang)}</p>
          {withDe && question.explanation?.de && (
            <p className="mt-2 border-t border-blue-200 pt-2 text-xs italic opacity-80 dark:border-blue-800">{question.explanation.de}</p>
          )}
        </div>
      )}
    </div>
  )
}

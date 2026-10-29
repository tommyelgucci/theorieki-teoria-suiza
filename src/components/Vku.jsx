import { useMemo, useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { storage } from '../storage'
import { shuffle, isAnswerCorrect } from '../utils'
import { VKU_BLOCKS, VKU_CARDS, VKU_QUESTIONS, VKU_LINKS } from '../data/vku'
import QuestionCard from './QuestionCard'
import Confetti from './Confetti'
import {
  IconThoughtBubble,
  IconBookOpen,
  IconCards,
  IconQuestionBubble,
  IconTrophy,
  IconThumbsUp,
  IconCheck,
  IconCross,
  IconExternalLink,
  Icon,
} from './Icons'
import MenuCard from './MenuCard'
import CardDeck from './CardDeck'

function Blocks() {
  const { lang } = useLang()
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3">
      {VKU_BLOCKS.map((block) => {
        const isOpen = open === block.id
        return (
          <div key={block.id} className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line">
            <button
              onClick={() => setOpen(isOpen ? null : block.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-swiss dark:bg-red-900/40 dark:text-red-300">
                <Icon name={block.icon} className="h-5 w-5" />
              </span>
              <span className="flex-1 font-semibold text-ink">{tr(block.title, lang)}</span>
              <span className={`text-faint transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isOpen && (
              <ul className="reveal-in space-y-3 border-t border-line p-4 pt-3">
                {block.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-body">
                    <span className="text-swiss">•</span>
                    <span>{tr(b, lang)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Quiz() {
  const { lang } = useLang()
  const [round, setRound] = useState(0)
  const questions = useMemo(
    () => shuffle(VKU_QUESTIONS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const question = questions[index]
  const done = index >= questions.length

  if (done) {
    const msg = score >= 8 ? t('quizMsgGreat', lang) : score >= 5 ? t('quizMsgOk', lang) : t('quizMsgLow', lang)
    return (
      <div className="rounded-2xl bg-surface p-8 text-center shadow-sm ring-1 ring-line">
        {score >= questions.length * 0.8 && <Confetti />}
        <div className="flex justify-center text-swiss">
          {score >= 8 ? (
            <IconTrophy className="h-10 w-10" />
          ) : score >= 5 ? (
            <IconThumbsUp className="h-10 w-10" />
          ) : (
            <IconBookOpen className="h-10 w-10" />
          )}
        </div>
        <p className="mt-3 text-lg font-semibold text-ink">
          {t('quizResult', lang)}: {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-body">{msg}</p>
        <button
          onClick={() => {
            setRound((r) => r + 1)
            setIndex(0)
            setSelected([])
            setRevealed(false)
            setScore(0)
          }}
          className="mt-4 rounded-xl bg-swiss px-5 py-2.5 font-semibold text-white hover:bg-swiss-dark transition-all active:scale-[0.98]"
        >
          {t('quizAgain', lang)}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {t('question', lang)} {index + 1} {t('of', lang)} {questions.length}
        </span>
        <span>✓ {score}</span>
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        selected={selected}
        onToggle={(optId) => setSelected((sel) => (sel.includes(optId) ? sel.filter((s) => s !== optId) : [...sel, optId]))}
        revealed={revealed}
        showTopic={false}
      />

      <p
        role="status"
        aria-live="polite"
        className={`flex items-center justify-center gap-1.5 text-center text-lg font-bold ${
          revealed ? (isAnswerCorrect(question, selected) ? 'text-green-600' : 'text-red-600') : ''
        }`}
      >
        {revealed &&
          (isAnswerCorrect(question, selected) ? (
            <>
              <IconCheck className="h-5 w-5" /> {t('correct', lang)}
            </>
          ) : (
            <>
              <IconCross className="h-5 w-5" /> {t('wrong', lang)}
            </>
          ))}
      </p>

      {revealed ? (
        <button
          onClick={() => {
            setIndex((i) => i + 1)
            setSelected([])
            setRevealed(false)
          }}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark transition-all active:scale-[0.98]"
        >
          {t('next', lang)} →
        </button>
      ) : (
        <button
          onClick={() => {
            if (isAnswerCorrect(question, selected)) setScore((s) => s + 1)
            storage.touchStudyDay()
            setRevealed(true)
          }}
          disabled={selected.length === 0}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark disabled:opacity-40 transition-all active:scale-[0.98]"
        >
          {t('check', lang)}
        </button>
      )}
    </div>
  )
}

export default function Vku() {
  const { lang } = useLang()
  const [view, setView] = useState('hub') // hub | blocks | cards | quiz
  const dueCards = storage.srsDueIds('vku', VKU_CARDS.map((c) => c.id)).length

  if (view !== 'hub') {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
        <button onClick={() => setView('hub')} className="text-sm font-semibold text-swiss">
          ‹ {t('menuVku', lang)}
        </button>
        {view === 'blocks' && <Blocks />}
        {view === 'cards' && <CardDeck module="vku" cards={VKU_CARDS} />}
        {view === 'quiz' && <Quiz />}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-5">
      <div className="flex items-start gap-2 rounded-2xl bg-red-50 dark:bg-red-900/30 p-4 text-sm leading-relaxed text-red-900 dark:text-red-200 ring-1 ring-red-200 dark:ring-red-800">
        <IconThoughtBubble className="mt-0.5 h-4 w-4 shrink-0" /> {t('vkuIntro', lang)}
      </div>
      <div className="space-y-3">
        <MenuCard i={0} tint="blue" onClick={() => setView('blocks')} icon={<IconBookOpen className="h-6 w-6" />} label={t('vkuBlocksTitle', lang)} sub={t('vkuBlocksSub', lang)} />
        <MenuCard i={1} tint="green"
          onClick={() => setView('cards')}
          icon={<IconCards className="h-6 w-6" />}
          label={t('faCardsTitle', lang)}
          sub={t('faCardsSub', lang)}
          badge={dueCards}
        />
        <MenuCard i={2} tint="amber" onClick={() => setView('quiz')} icon={<IconQuestionBubble className="h-6 w-6" />} label={t('faQuizTitle', lang)} sub={t('vkuQuizSub', lang)} />
      </div>
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-line">
        <h2 className="mb-2 flex items-center gap-1.5 font-bold text-ink">
          <IconExternalLink className="h-5 w-5" /> {t('officialLinks', lang)}
        </h2>
        <ul className="space-y-1.5">
          {VKU_LINKS.map((l) => (
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

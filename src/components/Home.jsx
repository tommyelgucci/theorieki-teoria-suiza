import { useEffect, useState } from 'react'
import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { questionsForCategory, readinessScore } from '../utils'
import { loadQuestions } from '../data/questionBank'
import { topicLabel } from '../data/topics'
import ProgressRing from './ProgressRing'
import MenuCard, { GroupLabel } from './MenuCard'
import { CarIcon, MotoIcon } from './CategoryIcons'
import {
  IconFirstAid,
  IconBookOpen,
  IconStopwatch,
  IconRetry,
  IconWarningSign,
  IconThoughtBubble,
  IconSteeringWheel,
  IconTarget,
  IconIdCard,
  IconGraduationCap,
  IconBarChart,
  IconFlame,
  IconStack,
  IconRuler,
  IconCheck,
  IconCross,
} from './Icons'

const DAILY_GOAL = 20

function CategoryButton({ active, onClick, icon, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 lift rounded-2xl border-2 p-4 ${
        active ? 'border-swiss bg-red-50 shadow-card dark:bg-red-900/30' : 'border-line bg-surface hover:border-line-strong'
      }`}
    >
      {icon}
      <span className="font-bold text-ink">{label}</span>
      <span className="text-xs text-muted">{sub}</span>
    </button>
  )
}

function Hero({ profile, navigate, pool }) {
  const { lang } = useLang()
  const stats = storage.getStats()
  const history = storage.getExamHistory()
  // pool es null hasta que llega el banco: readinessScore devuelve el estado
  // inicial con una lista vacía, que es justo lo que hay que mostrar mientras.
  const { score, level, weakTopics } = readinessScore(stats, history, pool || [])
  const streak = storage.getStreak()
  const daily = storage.getDailyCount()
  const dailyPct = Math.min(100, Math.round((100 * daily) / DAILY_GOAL))

  const levelText =
    level === 'ready' ? t('readinessReady', lang) : level === 'ontrack' ? t('readinessOntrack', lang) : t('readinessStart', lang)
  const ringColor = level === 'ready' ? '#2ecc71' : level === 'ontrack' ? '#f6b93b' : '#da291c'
  const name = profile?.name ? ` ${profile.name}` : ''

  return (
    <button
      onClick={() => navigate('stats')}
      className="lift block w-full rounded-3xl bg-surface p-4 text-left shadow-card ring-1 ring-line"
    >
      <div className="flex items-center gap-4">
        <ProgressRing value={score ?? 4} size={84} stroke={8} color={ringColor}>
          <span className="text-lg font-extrabold text-ink">
            {score != null ? `${score}` : '·'}
          </span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-tight text-ink">
            {t('greeting', lang, { name })} {profile?.emoji}
          </p>
          <p className="mt-0.5 text-sm text-body">
            {score != null ? levelText : t('readinessEmpty', lang)}
          </p>
          {weakTopics.length > 0 && (
            <p className="mt-1 truncate text-xs text-muted">
              {t('weakTopicsLabel', lang)} {weakTopics.map((tp) => topicLabel(tp, lang)).join(' · ')}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
        <span className="flex items-center gap-1 text-sm font-bold text-ink">
          <IconFlame className={`h-4 w-4 ${streak > 0 ? 'flame text-swiss' : 'text-faint'}`} /> {streak}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-subtle">
          <div
            className="grow-x h-full rounded-full bg-gradient-to-r from-swiss to-gold"
            style={{ width: `${dailyPct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-muted">
          {t('dailyGoal', lang)} {Math.min(daily, DAILY_GOAL)}/{DAILY_GOAL}
        </span>
      </div>
    </button>
  )
}

export default function Home({ category, setCategory, navigate, profile }) {
  const { lang } = useLang()
  const failedCount = storage.getFailed().length
  const stats = storage.getStats()
  // El banco de preguntas (6 idiomas) es lo más pesado de la app y acá sólo hace
  // falta para contadores, así que se pide aparte y no viaja en el chunk inicial.
  const [pool, setPool] = useState(null)
  useEffect(() => {
    let alive = true
    loadQuestions()
      .then((questions) => {
        if (alive) setPool(questionsForCategory(category, questions))
      })
      .catch(() => {
        // los contadores son informativos: si el banco no llega, quedan en '·'
      })
    return () => {
      alive = false
    }
  }, [category])
  const seen = pool ? pool.filter((q) => stats[q.id]?.seen > 0).length : null
  const mastered = pool
    ? pool.filter((q) => {
        const s = stats[q.id]
        return s && s.correct > s.wrong
      }).length
    : null
  const history = storage.getExamHistory()
  const lastExam = history[history.length - 1]
  // El banco de maniobras (keyframes, captions en 6 idiomas) es pesado y solo
  // hace falta aquí para este contador; se carga aparte en vez de en el bundle inicial.
  const [maneuverCount, setManeuverCount] = useState(null)
  useEffect(() => {
    let alive = true
    import('../data/maneuvers')
      .then(({ maneuversForCategory }) => {
        if (alive) setManeuverCount(maneuversForCategory(category).length)
      })
      .catch(() => {
        // Dato accesorio: si no carga, sólo se queda sin insignia. No reintentamos
        // aquí porque Vite memoriza la promesa de cada import() dinámico, así que
        // repetir el mismo import devuelve el mismo rechazo sin volver a la red.
        // Tampoco recargamos la página por un contador: si el fallo viene de un
        // despliegue nuevo, se resuelve en cuanto el usuario entre a una sección,
        // que sí pasa por lazyWithReload.
      })
    return () => {
      alive = false
    }
  }, [category])

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-5">
      <div className="stagger" style={{ '--i': 0 }}>
        <Hero profile={profile} navigate={navigate} pool={pool} />
      </div>

      <div className="stagger flex gap-3" style={{ '--i': 1 }}>
        <CategoryButton
          active={category === 'B'}
          onClick={() => setCategory('B')}
          icon={<CarIcon className="h-9 w-auto" />}
          label={t('car', lang)}
          sub={t('carSub', lang)}
        />
        <CategoryButton
          active={category === 'A'}
          onClick={() => setCategory('A')}
          icon={<MotoIcon className="h-9 w-auto" />}
          label={t('moto', lang)}
          sub={t('motoSub', lang)}
        />
      </div>

      <div style={{ '--i': 2 }} className="stagger flex items-center justify-between rounded-xl bg-surface px-4 py-2.5 text-xs text-body shadow-card ring-1 ring-line">
        <span className="inline-flex items-center gap-1">
          <IconStack className="h-3.5 w-3.5" /> {pool ? pool.length : '·'} {t('categoryQuestions', lang)}
        </span>
        <span>
          {seen ?? '·'} {t('progressSeen', lang)} · {mastered ?? '·'} {t('progressMastered', lang)}
        </span>
      </div>

      <div className="space-y-2.5">
        <GroupLabel i={3}>{t('groupBefore', lang)}</GroupLabel>
        <MenuCard i={4}
          onClick={() => navigate('firstaid')}
          icon={<IconFirstAid className="h-6 w-6" />}
          label={t('menuFirstAid', lang)}
          sub={t('menuFirstAidSub', lang)}
          tint="red"
        />

        <GroupLabel i={5}>{t('groupTheory', lang)}</GroupLabel>
        <MenuCard i={6} onClick={() => navigate('study')} icon={<IconBookOpen className="h-6 w-6" />} label={t('menuStudy', lang)} sub={t('menuStudySub', lang)} tint="blue" />
        <MenuCard i={7} onClick={() => navigate('exam')} icon={<IconStopwatch className="h-6 w-6" />} label={t('menuExam', lang)} sub={t('menuExamSub', lang)} tint="blue" />
        <MenuCard i={8}
          onClick={() => navigate('review')}
          icon={<IconRetry className="h-6 w-6" />}
          label={t('menuReview', lang)}
          sub={t('menuReviewSub', lang)}
          badge={failedCount}
          tint="blue"
        />
        <MenuCard i={9}
          onClick={() => navigate('signs')}
          icon={<IconWarningSign className="h-6 w-6" />}
          label={t('menuSigns', lang)}
          sub={t('menuSignsSub', lang)}
          tint="blue"
        />

                <MenuCard i={10}
          onClick={() => navigate('numbers')}
          icon={<IconRuler className="h-6 w-6" />}
          label={t('menuNumbers', lang)}
          sub={t('menuNumbersSub', lang)}
          tint="blue"
        />

        <GroupLabel i={11}>{t('groupPractical', lang)}</GroupLabel>
        <MenuCard i={12} onClick={() => navigate('vku')} icon={<IconThoughtBubble className="h-6 w-6" />} label={t('menuVku', lang)} sub={t('menuVkuSub', lang)} tint="green" />
        <MenuCard i={13}
          onClick={() => navigate('maneuvers')}
          icon={<IconSteeringWheel className="h-6 w-6" />}
          label={t('menuManeuvers', lang)}
          sub={t('menuManeuversSub', lang)}
          badge={maneuverCount}
          tint="green"
        />
        <MenuCard i={14} onClick={() => navigate('tips')} icon={<IconTarget className="h-6 w-6" />} label={t('menuTips', lang)} sub={t('menuTipsSub', lang)} tint="green" />

        <GroupLabel i={15}>{t('groupSpecial', lang)}</GroupLabel>
        <MenuCard i={16}
          onClick={() => navigate('kontrollfahrt')}
          icon={<IconIdCard className="h-6 w-6" />}
          label={t('menuKontrollfahrt', lang)}
          sub={t('menuKontrollfahrtSub', lang)}
          tint="amber"
        />
        <MenuCard i={17} onClick={() => navigate('wab')} icon={<IconGraduationCap className="h-6 w-6" />} label={t('menuWab', lang)} sub={t('menuWabSub', lang)} tint="amber" />

        <div className="pt-1">
          <MenuCard i={18}
            onClick={() => navigate('stats')}
            icon={<IconBarChart className="h-6 w-6" />}
            label={t('menuStats', lang)}
            sub={t('menuStatsSub', lang)}
            tint="red"
          />
        </div>
      </div>

      {lastExam && (
        <p className="flex items-center justify-center gap-1 text-center text-xs text-muted">
          {t('lastExam', lang)}:{' '}
          {lastExam.passed ? (
            <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <IconCross className="h-3.5 w-3.5 text-red-500" />
          )}{' '}
          {lastExam.penalty}/{lastExam.maxPenalty} {t('points', lang)}
        </p>
      )}

      <p className="pt-2 text-center text-[11px] leading-relaxed text-muted">{t('disclaimer', lang)}</p>
      <p className="text-center text-[11px]">
        <a href="./privacy.html" target="_blank" rel="noreferrer" className="text-muted underline hover:text-swiss">
          {t('privacyPolicy', lang)}
        </a>
      </p>
    </div>
  )
}

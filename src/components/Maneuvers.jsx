import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { maneuversForCategory } from '../data/maneuvers'
import ManeuverPlayer from './ManeuverPlayer'
import { Icon } from './Icons'
import MenuCard from './MenuCard'

export default function Maneuvers({ category }) {
  const { lang } = useLang()
  const [active, setActive] = useState(null)
  const list = maneuversForCategory(category)

  if (active) {
    return <ManeuverPlayer maneuver={active} onBack={() => setActive(null)} />
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center text-sm text-muted">{t('maneuversComingSoon', lang)}</div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-3 px-4 py-4">
      {list.map((m, n) => (
        <MenuCard
          key={m.id}
          i={n}
          onClick={() => setActive(m)}
          icon={<Icon name={m.icon} className="h-6 w-6" />}
          label={tr(m.title, lang)}
          sub={m.variants ? `${m.variants.length} ${t('techniques', lang)}` : `${m.steps.length} ${t('steps', lang)}`}
        />
      ))}
    </div>
  )
}

import { Suspense, useEffect, useState } from 'react'
import { LangContext, t } from './i18n'
import { storage } from './storage'
import { lazyWithReload, wasReloadedForChunk } from './lazyWithReload'
import Header from './components/Header'
import Home from './components/Home'

// Vistas secundarias: se cargan bajo demanda (code-splitting) para que la
// carga inicial no incluya el banco de maniobras, señales, primeros auxilios,
// VKU, Kontrollfahrt, WAB ni tips hasta que el usuario realmente navegue ahí.
const Study = lazyWithReload(() => import('./components/Study'))
const Exam = lazyWithReload(() => import('./components/Exam'))
const Review = lazyWithReload(() => import('./components/Review'))
const Tips = lazyWithReload(() => import('./components/Tips'))
const Maneuvers = lazyWithReload(() => import('./components/Maneuvers'))
const FirstAid = lazyWithReload(() => import('./components/FirstAid'))
const Signs = lazyWithReload(() => import('./components/Signs'))
const Stats = lazyWithReload(() => import('./components/Stats'))
const Kontrollfahrt = lazyWithReload(() => import('./components/Kontrollfahrt'))
const Vku = lazyWithReload(() => import('./components/Vku'))
const Wab = lazyWithReload(() => import('./components/Wab'))
const Profiles = lazyWithReload(() => import('./components/Profiles'))

const VIEW_KEY = 'theorieki.view'

// Si la página se recargó porque faltaba un chunk, volvemos a la sección que el
// usuario había pedido en vez de dejarlo de vuelta en el inicio. En cualquier
// otro arranque (incluido abrir la app de cero) se empieza en 'home'.
function initialView() {
  if (!wasReloadedForChunk()) return 'home'
  try {
    return sessionStorage.getItem(VIEW_KEY) || 'home'
  } catch {
    return 'home'
  }
}

function ViewLoading() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-500 dark:border-gray-700 dark:border-t-red-500" />
    </div>
  )
}

export default function App() {
  const [lang, setLangState] = useState(storage.getLang)
  const [category, setCategoryState] = useState(() => storage.getCategory() || 'B')
  const [view, setView] = useState(initialView)
  const [studyTopic, setStudyTopic] = useState(null)
  const [theme, setThemeState] = useState(storage.getTheme)
  const [showProfiles, setShowProfiles] = useState(false)
  const profile = storage.getActiveProfile()

  // navegación con filtro de tema opcional (cross-links desde Kontrollfahrt)
  const go = (nextView, topic = null) => {
    setStudyTopic(topic)
    setView(nextView)
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  useEffect(() => {
    try {
      sessionStorage.setItem(VIEW_KEY, view)
    } catch {
      // sin sessionStorage sólo se pierde la restauración de vista tras recargar
    }
  }, [view])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    storage.setTheme(next)
    setThemeState(next)
  }

  const setLang = (l) => {
    storage.setLang(l)
    setLangState(l)
  }
  const setCategory = (c) => {
    storage.setCategory(c)
    setCategoryState(c)
  }

  const titles = {
    home: null,
    study: t('menuStudy', lang),
    exam: t('menuExam', lang),
    review: t('menuReview', lang),
    tips: t('menuTips', lang),
    maneuvers: t('menuManeuvers', lang),
    firstaid: t('menuFirstAid', lang),
    signs: t('menuSigns', lang),
    stats: t('menuStats', lang),
    kontrollfahrt: t('menuKontrollfahrt', lang),
    vku: t('menuVku', lang),
    wab: t('menuWab', lang),
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-950">
        <Header
          title={titles[view]}
          category={['home', 'firstaid', 'signs', 'stats', 'kontrollfahrt', 'vku', 'wab'].includes(view) ? null : category}
          onBack={view !== 'home' ? () => go('home') : null}
          theme={theme}
          onToggleTheme={toggleTheme}
          profile={profile}
          onProfiles={() => setShowProfiles(true)}
        />
        {showProfiles && (
          <Suspense fallback={<ViewLoading />}>
            <Profiles onClose={() => setShowProfiles(false)} />
          </Suspense>
        )}
        <div key={view} className="view-in">
        {view === 'home' && <Home category={category} setCategory={setCategory} navigate={go} profile={profile} />}
        <Suspense fallback={<ViewLoading />}>
          {view === 'study' && <Study key={studyTopic || 'all'} category={category} initialTopic={studyTopic} />}
          {view === 'exam' && <Exam category={category} onExit={() => setView('home')} />}
          {view === 'review' && <Review />}
          {view === 'tips' && <Tips category={category} />}
          {view === 'maneuvers' && <Maneuvers category={category} />}
          {view === 'firstaid' && <FirstAid />}
          {view === 'signs' && <Signs />}
          {view === 'stats' && <Stats />}
          {view === 'kontrollfahrt' && <Kontrollfahrt navigate={go} />}
          {view === 'vku' && <Vku />}
          {view === 'wab' && <Wab />}
        </Suspense>
        </div>
      </div>
    </LangContext.Provider>
  )
}

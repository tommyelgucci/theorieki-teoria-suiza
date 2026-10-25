import { useState } from 'react'
import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { IconPeople, IconTrash } from './Icons'

const EMOJIS = ['🚗', '🏍️', '🚙', '🛵', '🚀', '🐨', '🦊', '🐼', '🌸', '⚡', '🎸', '⭐']

export default function Profiles({ onClose }) {
  const { lang } = useLang()
  const [profiles, setProfiles] = useState(storage.getProfiles)
  const active = storage.getActiveProfile()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🐨')

  function refresh() {
    setProfiles(storage.getProfiles())
  }

  function switchTo(id) {
    if (id === active.id) return onClose()
    storage.setActiveProfile(id)
    window.location.reload()
  }

  function create() {
    const id = storage.createProfile(name.trim(), emoji)
    storage.setActiveProfile(id)
    window.location.reload()
  }

  function remove(id) {
    if (!window.confirm(t('profileDeleteConfirm', lang))) return
    const wasActive = id === active.id
    storage.deleteProfile(id)
    if (wasActive) window.location.reload()
    else refresh()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-surface p-5 shadow-float sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink">
            <IconPeople className="h-5 w-5" /> {t('profilesTitle', lang)}
          </h2>
          <button onClick={onClose} aria-label={t('back', lang)} className="rounded-full p-1.5 text-xl leading-none text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            ✕
          </button>
        </div>

        {!creating ? (
          <>
            <ul className="space-y-2">
              {profiles.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <button
                    onClick={() => switchTo(p.id)}
                    className={`flex flex-1 items-center gap-3 rounded-2xl p-3 text-left ring-1 transition-colors ${
                      p.id === active.id
                        ? 'bg-red-50 ring-swiss/40 dark:bg-red-900/30'
                        : 'bg-sunken ring-gray-200 hover:bg-gray-100 dark:ring-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="flex-1 font-semibold text-ink">
                      {p.name || t('profileDefaultName', lang)}
                    </span>
                    {p.id === active.id && <span className="text-xs font-bold text-swiss">✓ {t('profileActive', lang)}</span>}
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={() => remove(p.id)}
                      aria-label={t('profileDelete', lang)}
                      className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-swiss dark:hover:bg-red-900/30"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setCreating(true)}
              className="mt-4 w-full rounded-xl bg-swiss py-3 font-semibold text-white transition-transform hover:bg-swiss-dark active:scale-[0.98]"
            >
              + {t('profileNew', lang)}
            </button>
            <p className="mt-3 text-center text-[11px] text-gray-400">{t('profilesHint', lang)}</p>
          </>
        ) : (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profileNamePlaceholder', lang)}
              maxLength={20}
              autoFocus
              className="w-full rounded-xl border border-line bg-sunken p-3 text-ink"
            />
            <div className="mt-3 grid grid-cols-6 gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`rounded-xl p-2 text-2xl transition-transform active:scale-90 ${
                    emoji === e ? 'bg-red-50 ring-2 ring-swiss dark:bg-red-900/30' : 'bg-sunken'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setCreating(false)}
                className="flex-1 rounded-xl bg-surface py-3 font-semibold text-body ring-1 ring-line-strong"
              >
                {t('back', lang)}
              </button>
              <button
                onClick={create}
                className="flex-1 rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark transition-all active:scale-[0.98]"
              >
                ✓ {t('profileCreate', lang)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

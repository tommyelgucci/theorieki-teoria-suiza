// Fila de menú compartida (Home y los hubs de Primeros auxilios, Señales, VKU,
// Maniobras): chip de color con icono, título + subtítulo, insignia opcional y
// flecha que se desplaza al pasar el ratón. `i` escalona la entrada (ver .stagger).
const CHIP_TINTS = {
  red: 'bg-red-100 dark:bg-red-900/40',
  amber: 'bg-amber-100 dark:bg-amber-900/40',
  blue: 'bg-sky-100 dark:bg-sky-900/40',
  green: 'bg-emerald-100 dark:bg-emerald-900/40',
}

const CHIP_TEXT = {
  red: 'text-swiss dark:text-red-300',
  amber: 'text-amber-600 dark:text-amber-300',
  blue: 'text-sky-600 dark:text-sky-300',
  green: 'text-emerald-600 dark:text-emerald-300',
}

export default function MenuCard({ onClick, icon, label, sub, badge, tint = 'red', i = 0 }) {
  return (
    <button
      onClick={onClick}
      style={{ '--i': i }}
      className="stagger lift group flex w-full items-center gap-3.5 rounded-2xl bg-surface p-3.5 text-left shadow-card ring-1 ring-line hover:bg-sunken"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${CHIP_TINTS[tint]} ${CHIP_TEXT[tint]}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-ink">{label}</span>
        <span className="block text-[13px] leading-snug text-muted">{sub}</span>
      </span>
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-swiss px-2.5 py-0.5 text-sm font-bold text-white">{badge}</span>
      )}
      <span aria-hidden className="text-faint transition-transform duration-200 group-hover:translate-x-0.5">
        ›
      </span>
    </button>
  )
}

export function GroupLabel({ children, i = 0 }) {
  return (
    <p style={{ '--i': i }} className="stagger px-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-muted">
      {children}
    </p>
  )
}

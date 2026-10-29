import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LangContext, t } from '../i18n'
import { storage } from '../storage'
import QuestionCard from './QuestionCard'

const question = {
  id: 'qtest',
  category: 'both',
  topic: 'vortritt',
  type: 'multiple_choice',
  points: 3,
  question: { de: 'Wer hat Vortritt?', es: '¿Quién tiene prioridad?' },
  options: [
    { id: 'a', text: { de: 'Von rechts', es: 'El de la derecha' }, correct: true },
    { id: 'b', text: { de: 'Der Schnellere', es: 'El más rápido' }, correct: false },
  ],
  explanation: { de: 'Rechtsvortritt.', es: 'Prioridad de la derecha.' },
}

function renderCard(lang, props = {}) {
  return render(
    <LangContext.Provider value={{ lang, setLang: () => {} }}>
      <QuestionCard question={question} selected={[]} onToggle={() => {}} revealed={false} {...props} />
    </LangContext.Provider>,
  )
}

describe('QuestionCard: texto original en alemán', () => {
  it('no muestra el alemán por defecto y lo muestra al activar el interruptor', async () => {
    const user = userEvent.setup()
    renderCard('es')
    expect(screen.queryByText('Wer hat Vortritt?')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: t('showGerman', 'es') }))

    expect(screen.getByText('Wer hat Vortritt?')).toBeInTheDocument()
    expect(screen.getByText('Von rechts')).toBeInTheDocument()
    expect(storage.getShowDe()).toBe(true)
  })

  it('recuerda la preferencia en la siguiente tarjeta', () => {
    storage.setShowDe(true)
    renderCard('es')
    expect(screen.getByText('Wer hat Vortritt?')).toBeInTheDocument()
  })

  it('con la app en alemán no ofrece el interruptor ni duplica el texto', () => {
    storage.setShowDe(true)
    renderCard('de')
    expect(screen.queryByRole('button', { name: t('showGerman', 'de') })).not.toBeInTheDocument()
    expect(screen.getAllByText('Wer hat Vortritt?')).toHaveLength(1)
  })

  it('muestra la explicación original al revelar', () => {
    storage.setShowDe(true)
    renderCard('es', { revealed: true })
    expect(screen.getByText('Rechtsvortritt.')).toBeInTheDocument()
  })
})

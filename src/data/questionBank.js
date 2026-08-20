// El banco pesa ~900 KB minificado (334 preguntas con enunciado, opciones y
// explicación en 6 idiomas). Las vistas que lo usan de verdad (estudio, examen,
// repaso, estadísticas) ya son lazy y lo importan directo. La pantalla de inicio,
// en cambio, es parte del bundle inicial y sólo lo necesita para contadores, así
// que lo pide por acá y no bloquea el primer render con 350 KB.
let promise = null

export function loadQuestions() {
  if (!promise) {
    promise = import('./questions.json')
      .then((m) => m.default)
      .catch((err) => {
        // sin esto, un bache de red dejaría la promesa fallida cacheada para siempre
        promise = null
        throw err
      })
  }
  return promise
}

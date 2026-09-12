import { tr } from '../i18n'

export const TOPICS = [
  { id: 'vortritt', label: { de: 'Vortritt', es: 'Prioridad', fr: 'Priorité', it: 'Precedenza', en: 'Right of way', pt: 'Prioridade' } },
  { id: 'einspuren', label: { de: 'Einspuren', es: 'Einspuren (posición de carril)', fr: 'Présélection (voie)', it: 'Preselezione (corsia)', en: 'Lane positioning', pt: 'Pré-seleção (posição na faixa)' } },
  { id: 'kreisverkehr', label: { de: 'Kreisverkehr', es: 'Rotondas', fr: 'Giratoires', it: 'Rotatorie', en: 'Roundabouts', pt: 'Rotundas' } },
  { id: 'signale', label: { de: 'Signale', es: 'Señales', fr: 'Signaux', it: 'Segnali', en: 'Signs', pt: 'Sinais' } },
  { id: 'geschwindigkeit', label: { de: 'Geschwindigkeit', es: 'Velocidad', fr: 'Vitesse', it: 'Velocità', en: 'Speed', pt: 'Velocidade' } },
  { id: 'abstand', label: { de: 'Abstand', es: 'Distancia', fr: 'Distance', it: 'Distanza', en: 'Distance', pt: 'Distância' } },
  { id: 'alkohol', label: { de: 'Fahrfähigkeit', es: 'Aptitud (alcohol, fatiga…)', fr: 'Aptitude (alcool, fatigue…)', it: 'Idoneità (alcol, stanchezza…)', en: 'Fitness to drive (alcohol, fatigue…)', pt: 'Aptidão (álcool, fadiga…)' } },
  { id: 'beleuchtung', label: { de: 'Beleuchtung', es: 'Luces', fr: 'Éclairage', it: 'Illuminazione', en: 'Lights', pt: 'Iluminação' } },
  { id: 'ueberholen', label: { de: 'Überholen', es: 'Adelantar', fr: 'Dépassement', it: 'Sorpasso', en: 'Overtaking', pt: 'Ultrapassagem' } },
  { id: 'fussgaenger', label: { de: 'Fussgänger & Kinder', es: 'Peatones y niños', fr: 'Piétons et enfants', it: 'Pedoni e bambini', en: 'Pedestrians & children', pt: 'Peões e crianças' } },
  { id: 'pannen', label: { de: 'Panne & Unfall', es: 'Averías y accidentes', fr: 'Panne et accident', it: 'Guasti e incidenti', en: 'Breakdowns & accidents', pt: 'Avarias e acidentes' } },
  { id: 'fahrzeug', label: { de: 'Fahrzeug & Dokumente', es: 'Vehículo y documentos', fr: 'Véhicule et documents', it: 'Veicolo e documenti', en: 'Vehicle & documents', pt: 'Veículo e documentos' } },
  { id: 'autobahn', label: { de: 'Autobahn', es: 'Autopista', fr: 'Autoroute', it: 'Autostrada', en: 'Motorway', pt: 'Autoestrada' } },
  { id: 'parkieren', label: { de: 'Parkieren', es: 'Estacionar', fr: 'Stationnement', it: 'Parcheggio', en: 'Parking', pt: 'Estacionar' } },
  { id: 'umwelt', label: { de: 'Umwelt', es: 'Medio ambiente', fr: 'Environnement', it: 'Ambiente', en: 'Environment', pt: 'Ambiente' } },
  { id: 'motorrad', label: { de: 'Motorrad', es: 'Moto', fr: 'Moto', it: 'Moto', en: 'Motorcycle', pt: 'Mota' } },
  { id: 'farbaenderung', label: { de: 'Farbänderung', es: 'Cambio de color', fr: 'Changement de couleur', it: 'Cambio di colore', en: 'Color change', pt: 'Mudança de cor' } },
  { id: 'nebelscheinwerfer', label: { de: 'Nebelscheinwerfer', es: 'Neblineros', fr: 'Antibrouillards', it: 'Fendinebbia', en: 'Fog lights', pt: 'Faróis de nevoeiro' } },
  { id: 'viehtransport', label: { de: 'Viehtransport', es: 'Transporte de ganado', fr: 'Transport de bétail', it: 'Trasporto di bestiame', en: 'Livestock transport', pt: 'Transporte de gado' } },
  { id: 'lernfahrt_ausstattung', label: { de: 'Lernfahrt-Ausstattung', es: 'Equipamiento de conducción de aprendizaje', fr: "Équipement de la course d'apprentissage", it: 'Attrezzatura per la guida di apprendistato', en: 'Learner-drive equipment', pt: 'Equipamento da condução de aprendizagem' } },
  { id: 'auslaendischer_fuehrerausweis', label: { de: 'Ausländischer Führerausweis', es: 'Licencia extranjera', fr: 'Permis étranger', it: 'Patente estera', en: 'Foreign driving licence', pt: 'Carta de condução estrangeira' } },
]

export function topicLabel(topicId, lang) {
  const t = TOPICS.find((t) => t.id === topicId)
  return t ? tr(t.label, lang) : topicId
}

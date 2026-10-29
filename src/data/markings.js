// Bodenmarkierungen (SSV Art. 72–79): Name, Bedeutung und Zeichnung (MarkingSprite).
// Vereinfachte Darstellungen zu Lernzwecken, keine amtlichen Wiedergaben.
// Die Lernkarten (MARKING_CARDS) werden aus dieser Liste abgeleitet.

export const MARKINGS = [
  {
    id: 'leitlinie',
    name: { de: 'Leitlinie', es: 'Línea de guía (Leitlinie)', fr: 'Ligne de guidage (Leitlinie)', it: 'Linea di guida (Leitlinie)', en: 'Guide line (Leitlinie)', pt: 'Linha de guia (Leitlinie)' },
    meaning: {
      de: 'Unterbrochene weisse Linie mit kurzen Strichen: Sie trennt Fahrstreifen und darf überfahren werden (z. B. zum Überholen oder Spurwechseln), wenn es sicher ist.',
      es: 'Línea blanca discontinua de trazos cortos: separa carriles y se puede cruzar (p. ej. para adelantar o cambiar de carril) cuando es seguro.',
      fr: 'Ligne blanche interrompue à traits courts : elle sépare les voies et peut être franchie (p. ex. pour dépasser ou changer de voie) si c’est sûr.',
      it: 'Linea bianca discontinua con tratti corti: separa le corsie e può essere superata (ad es. per sorpassare o cambiare corsia) quando è sicuro.',
      en: 'Broken white line with short dashes: it separates lanes and may be crossed (e.g. to overtake or change lane) when it is safe.',
      pt: 'Linha branca interrompida de traços curtos: separa faixas e pode ser atravessada (p. ex. para ultrapassar ou mudar de faixa) quando é seguro.',
    },
  },
  {
    id: 'warnlinie',
    name: { de: 'Warnlinie', es: 'Línea de advertencia (Warnlinie)', fr: 'Ligne d’avertissement (Warnlinie)', it: 'Linea di avvertimento (Warnlinie)', en: 'Warning line (Warnlinie)', pt: 'Linha de aviso (Warnlinie)' },
    meaning: {
      de: 'Lange Striche mit kurzen Lücken: Sie kündigt eine Sicherheitslinie oder eine Gefahrenstelle an. Erhöhte Vorsicht – die Möglichkeit zum Überholen endet bald.',
      es: 'Trazos largos con huecos cortos: anuncia una línea de seguridad o un punto peligroso. Máxima precaución: pronto dejará de ser posible adelantar.',
      fr: 'Longs traits avec de courts intervalles : elle annonce une ligne de sécurité ou un endroit dangereux. Redouble de prudence : la possibilité de dépasser prend bientôt fin.',
      it: 'Tratti lunghi con spazi brevi: annuncia una linea di sicurezza o un punto pericoloso. Massima prudenza: la possibilità di sorpassare finirà presto.',
      en: 'Long dashes with short gaps: it announces a safety line or a danger spot. Take extra care – the chance to overtake ends soon.',
      pt: 'Traços longos com intervalos curtos: anuncia uma linha de segurança ou um ponto perigoso. Redobra a atenção: a possibilidade de ultrapassar termina em breve.',
    },
  },
  {
    id: 'sicherheitslinie',
    name: { de: 'Sicherheitslinie', es: 'Línea de seguridad (Sicherheitslinie)', fr: 'Ligne de sécurité (Sicherheitslinie)', it: 'Linea di sicurezza (Sicherheitslinie)', en: 'Safety line (Sicherheitslinie)', pt: 'Linha de segurança (Sicherheitslinie)' },
    meaning: {
      de: 'Durchgezogene weisse Linie: Sie darf nicht überfahren werden – kein Überholen und kein Spurwechsel über die Linie.',
      es: 'Línea blanca continua: no se puede cruzar; ni adelantar ni cambiar de carril sobre ella.',
      fr: 'Ligne blanche continue : elle ne doit pas être franchie ; ni dépassement ni changement de voie au-dessus d’elle.',
      it: 'Linea bianca continua: non può essere superata; vietato sorpassare o cambiare corsia attraversandola.',
      en: 'Solid white line: it must not be crossed – no overtaking and no changing lane across it.',
      pt: 'Linha branca contínua: não pode ser atravessada; não se pode ultrapassar nem mudar de faixa por cima dela.',
    },
  },
  {
    id: 'sperrflaeche',
    name: { de: 'Sperrfläche', es: 'Zona de exclusión (Sperrfläche)', fr: 'Zone interdite (Sperrfläche)', it: 'Zona interdetta (Sperrfläche)', en: 'No-entry area (Sperrfläche)', pt: 'Zona interdita (Sperrfläche)' },
    meaning: {
      de: 'Weiss schraffierte Fläche, von einer Sicherheitslinie begrenzt: Sie darf nicht befahren werden.',
      es: 'Superficie con rayado blanco delimitada por una línea de seguridad: no se puede circular por ella.',
      fr: 'Surface hachurée en blanc, délimitée par une ligne de sécurité : il est interdit de rouler dessus.',
      it: 'Superficie tratteggiata di bianco, delimitata da una linea di sicurezza: non può essere percorsa.',
      en: 'White hatched area bordered by a safety line: it must not be driven on.',
      pt: 'Superfície com riscas brancas delimitada por uma linha de segurança: não se pode circular sobre ela.',
    },
  },
  {
    id: 'fussgaengerstreifen',
    name: { de: 'Fussgängerstreifen', es: 'Paso de peatones', fr: 'Passage pour piétons', it: 'Passaggio pedonale', en: 'Pedestrian crossing', pt: 'Passadeira' },
    meaning: {
      de: 'Fussgänger, die den Streifen benützen oder erkennbar benützen wollen, haben Vortritt. Rechtzeitig bremsen und nötigenfalls anhalten.',
      es: 'Los peatones que usan el paso, o que claramente quieren usarlo, tienen prioridad. Frena a tiempo y detente si hace falta.',
      fr: 'Les piétons qui utilisent le passage ou veulent manifestement l’utiliser ont la priorité. Freine à temps et arrête-toi si nécessaire.',
      it: 'I pedoni che usano il passaggio o che chiaramente vogliono usarlo hanno la precedenza. Frena in tempo e fermati se necessario.',
      en: 'Pedestrians using the crossing, or clearly wanting to use it, have priority. Brake in good time and stop if necessary.',
      pt: 'Os peões que usam a passadeira, ou que claramente a querem usar, têm prioridade. Trava a tempo e pára, se necessário.',
    },
  },
  {
    id: 'haltelinie',
    name: { de: 'Haltelinie', es: 'Línea de detención (Haltelinie)', fr: 'Ligne d’arrêt (Haltelinie)', it: 'Linea di arresto (Haltelinie)', en: 'Stop line (Haltelinie)', pt: 'Linha de paragem (Haltelinie)' },
    meaning: {
      de: 'Durchgezogene Querlinie, z. B. bei «Stop» oder einem Lichtsignal: Hinter der Linie anhalten.',
      es: 'Línea transversal continua, p. ej. en un «Stop» o un semáforo: detente antes de la línea.',
      fr: 'Ligne transversale continue, p. ex. à un « Stop » ou à un feu : arrête-toi avant la ligne.',
      it: 'Linea trasversale continua, ad es. a uno «Stop» o a un semaforo: fermati prima della linea.',
      en: 'Solid transverse line, e.g. at a “Stop” sign or a traffic light: stop behind the line.',
      pt: 'Linha transversal contínua, p. ex. num «Stop» ou num semáforo: pára antes da linha.',
    },
  },
  {
    id: 'wartelinie',
    name: { de: 'Wartelinie', es: 'Línea de espera (Wartelinie)', fr: 'Ligne d’attente (Wartelinie)', it: 'Linea di attesa (Wartelinie)', en: 'Give-way line (Wartelinie)', pt: 'Linha de espera (Wartelinie)' },
    meaning: {
      de: 'Reihe weisser Dreiecke: Sie markiert die Stelle, an der du warten musst, wenn du keinen Vortritt hast – bei Bedarf anhalten.',
      es: 'Hilera de triángulos blancos: marca el lugar donde debes esperar si no tienes prioridad; detente si hace falta.',
      fr: 'Rangée de triangles blancs : elle marque l’endroit où tu dois attendre si tu n’as pas la priorité ; arrête-toi au besoin.',
      it: 'Fila di triangoli bianchi: indica il punto in cui devi attendere se non hai la precedenza; fermati se necessario.',
      en: 'Row of white triangles: it marks where you must wait if you do not have priority – stop if necessary.',
      pt: 'Fila de triângulos brancos: marca o local onde deves esperar se não tiveres prioridade; pára se for preciso.',
    },
  },
  {
    id: 'blaue_zone',
    name: { de: 'Blaue Zone', es: 'Zona azul', fr: 'Zone bleue', it: 'Zona blu', en: 'Blue zone', pt: 'Zona azul' },
    meaning: {
      de: 'Blau markierte Parkfelder: Parkieren zeitlich beschränkt und nur mit eingestellter Parkscheibe.',
      es: 'Plazas marcadas en azul: estacionamiento limitado en el tiempo y solo con el disco de estacionamiento colocado.',
      fr: 'Places marquées en bleu : stationnement limité dans le temps et uniquement avec le disque de stationnement réglé.',
      it: 'Posti marcati in blu: parcheggio limitato nel tempo e solo con il disco orario impostato.',
      en: 'Blue-marked parking bays: parking is time-limited and only with a set parking disc.',
      pt: 'Lugares marcados a azul: estacionamento limitado no tempo e apenas com o disco de estacionamento acertado.',
    },
  },
  {
    id: 'weisse_parkfelder',
    name: { de: 'Weisse Parkfelder', es: 'Plazas blancas', fr: 'Places blanches', it: 'Posti bianchi', en: 'White parking bays', pt: 'Lugares brancos' },
    meaning: {
      de: 'Weiss markierte Parkfelder: Parkieren ist erlaubt, evtl. gebührenpflichtig oder zeitlich beschränkt gemäss Signalisation.',
      es: 'Plazas marcadas en blanco: se puede estacionar, quizá con tarifa o limitación de tiempo según la señalización.',
      fr: 'Places marquées en blanc : le stationnement est autorisé, éventuellement payant ou limité dans le temps selon la signalisation.',
      it: 'Posti marcati in bianco: il parcheggio è consentito, eventualmente a pagamento o limitato nel tempo secondo la segnaletica.',
      en: 'White-marked parking bays: parking is allowed, possibly paid or time-limited according to the signs.',
      pt: 'Lugares marcados a branco: é permitido estacionar, eventualmente com tarifa ou limite de tempo conforme a sinalização.',
    },
  },
  {
    id: 'gelb_durchgezogen',
    name: { de: 'Gelbe durchgezogene Linie am Rand', es: 'Línea amarilla continua en el borde', fr: 'Ligne jaune continue en bordure', it: 'Linea gialla continua sul bordo', en: 'Solid yellow line at the edge', pt: 'Linha amarela contínua na berma' },
    meaning: {
      de: 'Halteverbot: Auf dieser Strecke darf weder gehalten noch parkiert werden.',
      es: 'Prohibido detenerse: en este tramo no se puede parar ni estacionar.',
      fr: 'Arrêt interdit : sur ce tronçon, il est interdit de s’arrêter et de stationner.',
      it: 'Divieto di fermata: su questo tratto non ci si può né fermare né parcheggiare.',
      en: 'No stopping: on this stretch you may neither stop nor park.',
      pt: 'Paragem proibida: neste troço não se pode parar nem estacionar.',
    },
  },
  {
    id: 'gelb_unterbrochen',
    name: { de: 'Gelbe unterbrochene Linie am Rand', es: 'Línea amarilla discontinua en el borde', fr: 'Ligne jaune interrompue en bordure', it: 'Linea gialla discontinua sul bordo', en: 'Broken yellow line at the edge', pt: 'Linha amarela interrompida na berma' },
    meaning: {
      de: 'Parkierverbot: Parkieren ist verboten, kurzes Halten (z. B. zum Ein- oder Aussteigen) ist erlaubt.',
      es: 'Prohibido estacionar: no se puede estacionar, pero sí detenerse brevemente (p. ej. para subir o bajar).',
      fr: 'Stationnement interdit : on ne peut pas stationner, mais un arrêt bref (p. ex. pour monter ou descendre) est permis.',
      it: 'Divieto di parcheggio: non si può parcheggiare, ma una breve fermata (ad es. per salire o scendere) è consentita.',
      en: 'No parking: parking is prohibited, but a brief stop (e.g. to get in or out) is allowed.',
      pt: 'Estacionamento proibido: não se pode estacionar, mas é permitida uma paragem breve (p. ex. para entrar ou sair).',
    },
  },
  {
    id: 'zickzack',
    name: { de: 'Gelbe Zickzacklinie', es: 'Línea amarilla en zigzag', fr: 'Ligne jaune en zigzag', it: 'Linea gialla a zigzag', en: 'Yellow zigzag line', pt: 'Linha amarela em ziguezague' },
    meaning: {
      de: 'Bei Haltestellen: Halteverbot, damit Bus oder Tram ungehindert anfahren und halten können.',
      es: 'En las paradas: prohibido detenerse, para que el autobús o el tranvía puedan parar y salir sin obstáculos.',
      fr: 'Aux arrêts : arrêt interdit, afin que le bus ou le tram puisse arriver et repartir sans entrave.',
      it: 'Alle fermate: divieto di fermata, così bus e tram possono fermarsi e ripartire senza ostacoli.',
      en: 'At stops: no stopping, so that the bus or tram can pull in and leave without obstruction.',
      pt: 'Nas paragens: paragem proibida, para que o autocarro ou o elétrico possam parar e arrancar sem obstáculos.',
    },
  },
  {
    id: 'velostreifen',
    name: { de: 'Velostreifen (gelbe Linie)', es: 'Carril bici (línea amarilla)', fr: 'Bande cyclable (ligne jaune)', it: 'Corsia ciclabile (linea gialla)', en: 'Cycle lane (yellow line)', pt: 'Faixa para bicicletas (linha amarela)' },
    meaning: {
      de: 'Fahrstreifen für Velos. Bei durchgezogener Linie dürfen ihn Motorfahrzeuge nicht befahren; bei unterbrochener nur bei Bedarf und ohne Velos zu behindern.',
      es: 'Carril para bicicletas. Con línea continua, los vehículos a motor no pueden entrar; con línea discontinua, solo si es necesario y sin estorbar a las bicis.',
      fr: 'Voie pour les vélos. Avec une ligne continue, les véhicules à moteur ne peuvent pas l’emprunter ; avec une ligne interrompue, seulement si nécessaire et sans gêner les vélos.',
      it: 'Corsia per le biciclette. Con linea continua i veicoli a motore non possono percorrerla; con linea discontinua solo se necessario e senza intralciare le bici.',
      en: 'Lane for bicycles. With a solid line motor vehicles must not use it; with a broken line only when necessary and without obstructing cyclists.',
      pt: 'Faixa para bicicletas. Com linha contínua, os veículos a motor não a podem usar; com linha interrompida, só se necessário e sem prejudicar os ciclistas.',
    },
  },
]

// Lernkarten: Vorderseite = Zeichnung (MarkingSprite), Rückseite = Name + Bedeutung.
export const MARKING_CARDS = MARKINGS.map((m) => ({ id: m.id, front: m.name, back: m.meaning, name: m.name }))

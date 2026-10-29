// Prüfungs-Deutsch: Begriffe, die in der Theorieprüfung vorkommen. Die Prüfung ist auf
// Deutsch, Französisch oder Italienisch – wer in einer anderen Sprache lernt, sollte die
// deutschen Wörter kennen. Pro Eintrag: Begriff (mit Artikel) und Erklärung je Sprache;
// auf Deutsch ist die Erklärung eine einfache Umschreibung. Quelle der Wortwahl: Terminologie
// von SVG/VRV/SSV und der Fragen in questions.json (schweizerischer Sprachgebrauch).

const LANGS = ['de', 'es', 'fr', 'it', 'en', 'pt']

// [Begriff, de, es, fr, it, en, pt]
const RAW = [
  ['der Vortritt', 'Das Recht, zuerst zu fahren.', 'Prioridad de paso', 'Priorité', 'Precedenza', 'Right of way / priority', 'Prioridade'],
  ['der Rechtsvortritt', 'Wer von rechts kommt, fährt zuerst – wenn nichts anderes signalisiert ist.', 'Prioridad de la derecha', 'Priorité de droite', 'Precedenza da destra', 'Priority to the right', 'Prioridade da direita'],
  ['das Einspuren', 'Vor dem Abbiegen den richtigen Fahrstreifen wählen.', 'Colocarse en el carril correcto antes de girar', 'Se placer sur la bonne voie avant de tourner (présélection)', 'Mettersi nella corsia giusta prima di svoltare (preselezione)', 'Getting into the correct lane before turning', 'Colocar-se na faixa certa antes de virar'],
  ['der Kreisverkehr / der Kreisel', 'Eine runde Kreuzung mit Einbahnverkehr.', 'Rotonda', 'Giratoire', 'Rotatoria', 'Roundabout', 'Rotunda'],
  ['das Überholen', 'An einem fahrenden Fahrzeug vorbeifahren und dazu den Fahrstreifen wechseln.', 'Adelantamiento', 'Dépassement', 'Sorpasso', 'Overtaking', 'Ultrapassagem'],
  ['das Vorbeifahren', 'An einem Hindernis oder stehenden Fahrzeug vorbeifahren.', 'Pasar junto a un obstáculo o vehículo detenido', 'Passer devant un obstacle ou un véhicule à l’arrêt', 'Passare accanto a un ostacolo o a un veicolo fermo', 'Passing an obstacle or a stationary vehicle', 'Passar por um obstáculo ou veículo parado'],
  ['die Verzweigung', 'Eine Stelle, an der sich Strassen treffen oder teilen.', 'Cruce o bifurcación', 'Intersection ou bifurcation', 'Intersezione o biforcazione', 'Junction (where roads meet or split)', 'Cruzamento ou bifurcação'],
  ['die Einmündung', 'Eine Nebenstrasse, die in eine andere Strasse mündet.', 'Entronque de una calle lateral', 'Débouché d’une route latérale', 'Sbocco di una strada laterale', 'Side-road junction (T-junction)', 'Entroncamento de uma estrada lateral'],
  ['der Fussgängerstreifen', 'Markierter Übergang für Fussgänger.', 'Paso de peatones', 'Passage pour piétons', 'Passaggio pedonale', 'Pedestrian crossing', 'Passadeira'],
  ['das Trottoir', 'Der Gehweg neben der Fahrbahn.', 'Acera', 'Trottoir', 'Marciapiede', 'Pavement / sidewalk', 'Passeio'],
  ['die Fahrbahn', 'Der Teil der Strasse für Fahrzeuge.', 'Calzada', 'Chaussée', 'Carreggiata', 'Carriageway', 'Faixa de rodagem'],
  ['der Fahrstreifen', 'Ein Streifen der Fahrbahn für eine Fahrzeugreihe.', 'Carril', 'Voie de circulation', 'Corsia', 'Lane', 'Faixa de trânsito'],
  ['der Velostreifen', 'Ein markierter Streifen für Velos (Fahrräder).', 'Carril bici', 'Bande cyclable', 'Corsia ciclabile', 'Cycle lane', 'Faixa para bicicletas'],
  ['die Sicherheitslinie', 'Durchgezogene Linie, die man nicht überfahren darf.', 'Línea de seguridad (continua)', 'Ligne de sécurité (continue)', 'Linea di sicurezza (continua)', 'Safety line (solid)', 'Linha de segurança (contínua)'],
  ['die Sperrfläche', 'Schraffierte Fläche, die man nicht befahren darf.', 'Zona de exclusión (rayada)', 'Zone interdite (hachurée)', 'Zona interdetta (tratteggiata)', 'No-entry hatched area', 'Zona interdita (com riscas)'],
  ['das Halten', 'Kurz anhalten, z. B. zum Ein- oder Aussteigen.', 'Detenerse brevemente', 'S’arrêter brièvement', 'Fermarsi brevemente', 'Stopping briefly', 'Parar brevemente'],
  ['das Parkieren', 'Ein Fahrzeug länger abstellen.', 'Estacionar', 'Stationner', 'Parcheggiare', 'Parking', 'Estacionar'],
  ['das Wenden', 'Das Fahrzeug in die Gegenrichtung drehen.', 'Dar la vuelta (cambio de sentido)', 'Faire demi-tour', 'Invertire il senso di marcia', 'Turning around (U-turn)', 'Inverter a marcha'],
  ['das Abbiegen', 'Nach links oder rechts in eine andere Strasse fahren.', 'Girar (a la izquierda o a la derecha)', 'Tourner (à gauche ou à droite)', 'Svoltare (a sinistra o a destra)', 'Turning (left or right)', 'Virar (à esquerda ou à direita)'],
  ['das Rückwärtsfahren', 'Mit dem Fahrzeug nach hinten fahren.', 'Marcha atrás', 'Marche arrière', 'Retromarcia', 'Reversing', 'Marcha-atrás'],
  ['die Vollbremsung', 'Mit voller Kraft bremsen.', 'Frenada de emergencia', 'Freinage d’urgence', 'Frenata d’emergenza', 'Emergency (full) braking', 'Travagem de emergência'],
  ['der Bremsweg', 'Die Strecke vom Bremsbeginn bis zum Stillstand.', 'Distancia de frenado', 'Distance de freinage', 'Spazio di frenata', 'Braking distance', 'Distância de travagem'],
  ['der Reaktionsweg', 'Die Strecke, die man fährt, bis man reagiert.', 'Distancia de reacción', 'Distance de réaction', 'Spazio di reazione', 'Reaction distance', 'Distância de reação'],
  ['der Anhalteweg', 'Reaktionsweg plus Bremsweg.', 'Distancia de detención (reacción + frenado)', 'Distance d’arrêt (réaction + freinage)', 'Spazio di arresto (reazione + frenata)', 'Stopping distance (reaction + braking)', 'Distância de paragem (reação + travagem)'],
  ['der Abstand', 'Der Platz zwischen zwei Fahrzeugen.', 'Distancia entre vehículos', 'Distance entre véhicules', 'Distanza tra veicoli', 'Following distance / gap', 'Distância entre veículos'],
  ['der Blinker', 'Das Licht, das die Fahrtrichtung anzeigt.', 'Intermitente', 'Clignotant', 'Indicatore di direzione', 'Indicator / turn signal', 'Pisca'],
  ['das Abblendlicht', 'Das normale Licht, das andere nicht blendet.', 'Luz de cruce', 'Feux de croisement', 'Anabbaglianti', 'Dipped / low beam', 'Médios'],
  ['das Fernlicht', 'Das helle Licht für dunkle Strassen ohne Gegenverkehr.', 'Luz de carretera (largas)', 'Feux de route', 'Abbaglianti', 'High beam', 'Máximos'],
  ['die Nebelschlussleuchte', 'Rotes Licht hinten bei dichtem Nebel.', 'Luz antiniebla trasera', 'Feu antibrouillard arrière', 'Fendinebbia posteriore', 'Rear fog light', 'Luz de nevoeiro traseira'],
  ['das Standlicht', 'Schwaches Licht, z. B. beim Parkieren.', 'Luz de posición', 'Feux de position', 'Luci di posizione', 'Parking / position light', 'Luzes de presença'],
  ['die Hupe', 'Das Gerät für das akustische Warnsignal.', 'Bocina', 'Klaxon', 'Clacson', 'Horn', 'Buzina'],
  ['der Sicherheitsgurt', 'Der Gurt, der bei einem Unfall schützt.', 'Cinturón de seguridad', 'Ceinture de sécurité', 'Cintura di sicurezza', 'Seatbelt', 'Cinto de segurança'],
  ['der Kindersitz', 'Spezieller Sitz für kleine Kinder im Auto.', 'Silla infantil', 'Siège enfant', 'Seggiolino per bambini', 'Child seat', 'Cadeira infantil'],
  ['die Winterreifen', 'Reifen mit besserem Halt bei Kälte, Schnee und Eis.', 'Neumáticos de invierno', 'Pneus d’hiver', 'Pneumatici invernali', 'Winter tyres', 'Pneus de inverno'],
  ['die Schneeketten', 'Ketten auf den Reifen für tiefen Schnee.', 'Cadenas para nieve', 'Chaînes à neige', 'Catene da neve', 'Snow chains', 'Correntes de neve'],
  ['der Führerausweis', 'Das amtliche Dokument, das zum Fahren berechtigt.', 'Carné de conducir', 'Permis de conduire', 'Patente di guida', 'Driving licence', 'Carta de condução'],
  ['der Lernfahrausweis', 'Der Ausweis, mit dem man mit Begleitperson üben darf.', 'Permiso de aprendizaje', 'Permis d’élève conducteur', 'Licenza per allievo conducente', 'Learner licence', 'Licença de aprendizagem'],
  ['der Fahrzeugausweis', 'Das Dokument mit den Daten des Fahrzeugs.', 'Permiso de circulación del vehículo', 'Permis de circulation du véhicule', 'Licenza di circolazione del veicolo', 'Vehicle registration document', 'Livrete do veículo'],
  ['das Kontrollschild', 'Das Nummernschild am Fahrzeug.', 'Matrícula', 'Plaque de contrôle', 'Targa', 'Number plate', 'Matrícula'],
  ['die Vignette', 'Die Klebe-Plakette für Autobahnen.', 'Viñeta de autopista', 'Vignette autoroutière', 'Contrassegno autostradale', 'Motorway vignette', 'Vinheta de autoestrada'],
  ['der Ausweisentzug', 'Man darf für eine Zeit nicht mehr fahren.', 'Retirada del carné', 'Retrait du permis', 'Ritiro della patente', 'Licence withdrawal', 'Apreensão da carta'],
  ['die Probezeit', 'Die ersten drei Jahre mit dem Führerausweis auf Probe.', 'Período de prueba', 'Période probatoire', 'Periodo di prova', 'Probation period', 'Período probatório'],
  ['die Busse', 'Eine Strafe in Franken.', 'Multa', 'Amende', 'Multa', 'Fine', 'Multa'],
  ['die Ordnungsbusse', 'Eine feste, einfache Busse für kleine Verstösse.', 'Multa de orden (importe fijo)', 'Amende d’ordre (montant fixe)', 'Multa disciplinare (importo fisso)', 'Fixed-penalty fine', 'Multa de ordem (valor fixo)'],
  ['das Strassenverkehrsamt', 'Die kantonale Behörde für Führer- und Fahrzeugausweise.', 'Oficina cantonal de tráfico', 'Service cantonal des automobiles', 'Ufficio cantonale della circolazione', 'Cantonal road traffic office', 'Serviço cantonal de viação'],
  ['der Halter', 'Die Person, auf die das Fahrzeug eingetragen ist.', 'Titular del vehículo', 'Détenteur du véhicule', 'Detentore del veicolo', 'Registered keeper of the vehicle', 'Titular do veículo'],
  ['der Fahrzeugführer / die Lenkerin', 'Die Person, die das Fahrzeug fährt.', 'Conductor', 'Conducteur', 'Conducente', 'Driver', 'Condutor'],
  ['die Begleitperson', 'Die erfahrene Person, die bei der Lernfahrt mitfährt.', 'Acompañante (en la conducción de aprendizaje)', 'Accompagnant (course d’apprentissage)', 'Accompagnatore (guida di apprendistato)', 'Accompanying person (learner drive)', 'Acompanhante (condução de aprendizagem)'],
  ['das Pannendreieck', 'Das Warndreieck bei einer Panne.', 'Triángulo de emergencia', 'Triangle de panne', 'Triangolo di emergenza', 'Warning triangle', 'Triângulo de sinalização'],
  ['der Pannenstreifen', 'Der Seitenstreifen für Notfälle auf der Autobahn.', 'Arcén (carril de emergencia lateral)', 'Bande d’arrêt d’urgence', 'Corsia d’emergenza', 'Hard shoulder', 'Berma de emergência'],
  ['die Rettungsgasse', 'Der freie Streifen für Einsatzfahrzeuge im Stau.', 'Pasillo de emergencia', 'Voie de secours (couloir)', 'Corridoio di emergenza', 'Emergency corridor', 'Corredor de emergência'],
  ['der Nothelferkurs', 'Der Erste-Hilfe-Kurs vor der Lernfahrt.', 'Curso de primeros auxilios', 'Cours de premiers secours', 'Corso di primo soccorso', 'First-aid course', 'Curso de primeiros socorros'],
  ['der Anhänger', 'Ein Fahrzeug ohne Motor, das gezogen wird.', 'Remolque', 'Remorque', 'Rimorchio', 'Trailer', 'Reboque'],
  ['das Zugfahrzeug', 'Das Fahrzeug, das einen Anhänger zieht.', 'Vehículo tractor', 'Véhicule tracteur', 'Veicolo trainante', 'Towing vehicle', 'Veículo trator'],
  ['die Ladung', 'Alles, was ein Fahrzeug transportiert.', 'Carga', 'Chargement', 'Carico', 'Load / cargo', 'Carga'],
  ['das Schritttempo', 'So langsam wie ein Fussgänger.', 'Paso de peatón (muy despacio)', 'Allure du pas', 'Passo d’uomo', 'Walking pace', 'Passo de peão'],
  ['die Haltestelle', 'Der Ort, an dem Bus oder Tram halten.', 'Parada (autobús / tranvía)', 'Arrêt (bus / tram)', 'Fermata (bus / tram)', 'Bus or tram stop', 'Paragem (autocarro / elétrico)'],
  ['das Lichtsignal', 'Die Ampel mit Rot, Gelb und Grün.', 'Semáforo', 'Feu de signalisation', 'Semaforo', 'Traffic light', 'Semáforo'],
  ['die Baustelle', 'Ein Ort, an dem an der Strasse gearbeitet wird.', 'Obras', 'Chantier', 'Cantiere', 'Roadworks site', 'Obras'],
  ['der Gegenverkehr', 'Fahrzeuge, die dir entgegenkommen.', 'Tráfico en sentido contrario', 'Trafic en sens inverse', 'Traffico in senso contrario', 'Oncoming traffic', 'Trânsito em sentido contrário'],
  ['die Höchstgeschwindigkeit', 'Das schnellste erlaubte Tempo.', 'Velocidad máxima', 'Vitesse maximale', 'Velocità massima', 'Maximum speed', 'Velocidade máxima'],
  ['innerorts / ausserorts', 'Im Dorf oder in der Stadt / ausserhalb davon.', 'Dentro / fuera de poblado', 'En / hors localité', 'Nei / fuori dai centri abitati', 'Inside / outside built-up areas', 'Dentro / fora de localidades'],
  ['die Autostrasse', 'Schnelle Strasse nur für Motorfahrzeuge (generell 100 km/h).', 'Vía rápida (Autostrasse)', 'Semi-autoroute', 'Superstrada', 'Expressway (Autostrasse)', 'Via rápida (Autostrasse)'],
  ['die Mittelinsel', 'Die Insel in der Mitte eines Kreisels oder einer Strasse.', 'Isleta central', 'Îlot central', 'Isola centrale', 'Central island', 'Ilhéu central'],
  ['die Kuppe', 'Die höchste Stelle einer Strasse vor dem Gefälle.', 'Cambio de rasante (cima)', 'Sommet de côte', 'Dosso', 'Crest of a hill', 'Lomba (topo da subida)'],
  ['der tote Winkel', 'Der Bereich, den man im Spiegel nicht sieht.', 'Ángulo muerto', 'Angle mort', 'Angolo cieco', 'Blind spot', 'Ângulo morto'],
  ['der Schulterblick', 'Der Blick über die Schulter vor dem Spurwechsel.', 'Mirada por encima del hombro', 'Coup d’œil par-dessus l’épaule', 'Sguardo sopra la spalla', 'Shoulder check', 'Olhar por cima do ombro'],
]

export const VOCAB = RAW.map(([term, ...defs], i) => ({
  id: `w${String(i + 1).padStart(2, '0')}`,
  term,
  def: Object.fromEntries(LANGS.map((l, k) => [l, defs[k]])),
}))

// Lernkarten: Vorderseite = deutscher Begriff, Rückseite = Erklärung in der eigenen Sprache.
export const VOCAB_CARDS = VOCAB.map((w) => ({ id: w.id, front: { de: w.term }, back: w.def }))

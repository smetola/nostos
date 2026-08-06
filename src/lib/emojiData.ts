export interface EmojiItem {
  emoji: string;
  name: string;
  category: string;
  keywords: string[];
}

export interface EmojiCategory {
  id: string;
  name: string;
  icon: string;
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  { id: "all", name: "Todos", icon: "✨" },
  { id: "health", name: "Salud y Bienestar", icon: "🏥" },
  { id: "smileys", name: "Caras y Emociones", icon: "😃" },
  { id: "tech", name: "Tecnología y Ciencia", icon: "💻" },
  { id: "philosophy", name: "Mente y Cultura", icon: "🧠" },
  { id: "nature", name: "Naturaleza y Animales", icon: "🌿" },
  { id: "food", name: "Comida y Bebida", icon: "🍎" },
  { id: "activities", name: "Deportes y Ocio", icon: "⚽" },
  { id: "travel", name: "Viajes y Lugares", icon: "✈️" },
  { id: "objects", name: "Objetos y Negocios", icon: "💰" },
  { id: "symbols", name: "Símbolos", icon: "💡" },
];

export const EMOJI_DATA: EmojiItem[] = [
  // SALUD Y BIENESTAR (Health & Wellness)
  {
    emoji: "🏥",
    name: "Hospital",
    category: "health",
    keywords: ["salud", "health", "hospital", "medicina", "medicine", "doctor", "sanidad", "medico", "clinica", "urgencias", "care", "cuidado"]
  },
  {
    emoji: "🩺",
    name: "Estetoscopio",
    category: "health",
    keywords: ["salud", "health", "estetoscopio", "stethoscope", "doctor", "medico", "revision", "consulta", "medicina", "medicine", "diagnostico"]
  },
  {
    emoji: "💊",
    name: "Pastilla",
    category: "health",
    keywords: ["salud", "health", "pastilla", "pill", "capsula", "medicina", "medicine", "farmacia", "pharmacy", "tratamiento", "remedio", "droga"]
  },
  {
    emoji: "💉",
    name: "Jeringa",
    category: "health",
    keywords: ["salud", "health", "jeringa", "syringe", "vacuna", "vaccine", "sangre", "inyeccion", "analisis", "medicina", "medicine"]
  },
  {
    emoji: "🫀",
    name: "Corazón anatómico",
    category: "health",
    keywords: ["salud", "health", "corazon", "heart", "organo", "organ", "cardiologia", "cardio", "vida", "life", "cuerpo", "body"]
  },
  {
    emoji: "❤️",
    name: "Corazón rojo",
    category: "health",
    keywords: ["salud", "health", "corazon", "heart", "amor", "love", "vida", "afecto", "emocion", "vitalidad", "care"]
  },
  {
    emoji: "🩹",
    name: "Tira adhesiva / Tirita",
    category: "health",
    keywords: ["salud", "health", "tirita", "bandage", "cura", "herida", "auxilio", "socorro", "primeros auxilios", "first aid", "recovery", "recuperacion"]
  },
  {
    emoji: "🚑",
    name: "Ambulancia",
    category: "health",
    keywords: ["salud", "health", "ambulancia", "ambulance", "emergencia", "urgencia", "rescate", "hospital", "sanidad"]
  },
  {
    emoji: "🏋️",
    name: "Pesas / Gimnasio",
    category: "health",
    keywords: ["salud", "health", "ejercicio", "exercise", "gimnasio", "gym", "deporte", "sport", "pesas", "fuerza", "fitness", "workout", "entrenamiento"]
  },
  {
    emoji: "🧘",
    name: "Yoga / Meditación",
    category: "health",
    keywords: ["salud", "health", "yoga", "meditacion", "meditation", "paz", "paz mental", "mente", "mind", "relax", "bienestar", "wellness", "zen"]
  },
  {
    emoji: "🏃",
    name: "Correr",
    category: "health",
    keywords: ["salud", "health", "correr", "run", "running", "atletismo", "ejercicio", "workout", "cardio", "fitness", "maraton"]
  },
  {
    emoji: "🚴",
    name: "Ciclismo",
    category: "health",
    keywords: ["salud", "health", "bicicleta", "bike", "ciclismo", "cycling", "ejercicio", "cardio", "deporte", "fitness"]
  },
  {
    emoji: "🍏",
    name: "Manzana verde",
    category: "health",
    keywords: ["salud", "health", "nutricion", "nutrition", "dieta", "diet", "comida sana", "fruta", "manzana", "apple", "bienestar"]
  },
  {
    emoji: "🥗",
    name: "Ensalada",
    category: "health",
    keywords: ["salud", "health", "ensalada", "salad", "vegetal", "verdura", "comida sana", "healthy", "dietetica", "nutricion", "nutrition"]
  },
  {
    emoji: "😷",
    name: "Mascarilla médica",
    category: "health",
    keywords: ["salud", "health", "mascarilla", "mask", "prevencion", "infeccion", "doctor", "virus", "sanidad"]
  },
  {
    emoji: "🌡️",
    name: "Termómetro",
    category: "health",
    keywords: ["salud", "health", "termometro", "thermometer", "fiebre", "fever", "temperatura", "medicina", "diagnostic"]
  },
  {
    emoji: "🧬",
    name: "ADN",
    category: "health",
    keywords: ["salud", "health", "adn", "dna", "genetica", "genetics", "ciencia", "science", "biologia", "biology", "investigacion", "cuerpo"]
  },
  {
    emoji: "🧪",
    name: "Tubo de ensayo",
    category: "health",
    keywords: ["salud", "health", "ciencia", "science", "laboratorio", "lab", "analisis", "ensayo", "experimento", "quimica"]
  },
  {
    emoji: "💆",
    name: "Masaje / Spa",
    category: "health",
    keywords: ["salud", "health", "masaje", "massage", "spa", "relax", "descanso", "terapia", "therapy", "bienestar", "wellness"]
  },
  {
    emoji: "🩸",
    name: "Gota de sangre",
    category: "health",
    keywords: ["salud", "health", "sangre", "blood", "donacion", "analisis", "medicina", "hospital"]
  },

  // TECNOLOGÍA Y CIENCIA (Tech & Science)
  {
    emoji: "💻",
    name: "Portátil",
    category: "tech",
    keywords: ["tecnologia", "tech", "ordenador", "computer", "laptop", "pc", "codigo", "code", "software", "trabajo", "work", "programacion", "dev", "desarrollo"]
  },
  {
    emoji: "🖥️",
    name: "Ordenador de sobremesa",
    category: "tech",
    keywords: ["tecnologia", "tech", "monitor", "pantalla", "screen", "pc", "desktop", "computadora", "hardware"]
  },
  {
    emoji: "📱",
    name: "Móvil",
    category: "tech",
    keywords: ["tecnologia", "tech", "movil", "phone", "smartphone", "iphone", "android", "app", "celular", "telefono"]
  },
  {
    emoji: "⌨️",
    name: "Teclado",
    category: "tech",
    keywords: ["tecnologia", "tech", "teclado", "keyboard", "mecanografia", "escritura", "typing", "codigo"]
  },
  {
    emoji: "🤖",
    name: "Robot / IA",
    category: "tech",
    keywords: ["tecnologia", "tech", "robot", "ia", "ai", "inteligencia artificial", "bot", "futuro", "automatizacion"]
  },
  {
    emoji: "⚡",
    name: "Energía / Rayo",
    category: "tech",
    keywords: ["tecnologia", "tech", "energia", "energy", "rayo", "lightning", "electricidad", "potencia", "speed", "velocidad", "fast"]
  },
  {
    emoji: "🌐",
    name: "Web / Red global",
    category: "tech",
    keywords: ["tecnologia", "tech", "web", "internet", "red", "network", "global", "mundo", "world", "online", "sitio web"]
  },
  {
    emoji: "📡",
    name: "Antena satélite",
    category: "tech",
    keywords: ["tecnologia", "tech", "antena", "satellite", "conexion", "red", "signal", "wifi", "telecomunicaciones"]
  },
  {
    emoji: "💾",
    name: "Disquete / Guardar",
    category: "tech",
    keywords: ["tecnologia", "tech", "disquete", "disk", "guardar", "save", "datos", "data", "retro", "memoria"]
  },
  {
    emoji: "⚙️",
    name: "Ajustes / Engranaje",
    category: "tech",
    keywords: ["tecnologia", "tech", "ajuste", "settings", "engranaje", "gear", "configuracion", "herramienta", "sistema", "config"]
  },
  {
    emoji: "🔌",
    name: "Enchufe / Conector",
    category: "tech",
    keywords: ["tecnologia", "tech", "enchufe", "plug", "electricidad", "conectividad", "energia", "cable"]
  },
  {
    emoji: "🚀",
    name: "Cohete / Despegue",
    category: "tech",
    keywords: ["tecnologia", "tech", "cohete", "rocket", "despegue", "launch", "espacio", "space", "futuro", "startup", "innovacion"]
  },
  {
    emoji: "🔬",
    name: "Microscopio",
    category: "tech",
    keywords: ["tecnologia", "tech", "microscopio", "microscope", "ciencia", "science", "investigacion", "laboratorio", "biologia"]
  },
  {
    emoji: "📡",
    name: "Radar / Señal",
    category: "tech",
    keywords: ["tecnologia", "tech", "radar", "signal", "deteccion", "sensor", "red"]
  },
  {
    emoji: "🔋",
    name: "Batería",
    category: "tech",
    keywords: ["tecnologia", "tech", "bateria", "battery", "carga", "power", "energia"]
  },

  // MENTE, FILOSOFÍA Y CULTURA (Mind & Culture)
  {
    emoji: "🧠",
    name: "Cerebro / Mente",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "mente", "mind", "cerebro", "brain", "pensamiento", "thought", "psicologia", "psychology", "ideas", "conocimiento"]
  },
  {
    emoji: "📚",
    name: "Libros",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "libros", "books", "lectura", "reading", "biblioteca", "estudio", "educacion", "conocimiento", "knowledge", "literatura"]
  },
  {
    emoji: "📖",
    name: "Libro abierto",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "libro", "book", "lectura", "historia", "relato", "cuento", "paginas"]
  },
  {
    emoji: "🏛️",
    name: "Edificio clásico",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "historia", "history", "grecia", "roma", "clasico", "arquitectura", "museo", "cultura", "institucion"]
  },
  {
    emoji: "🦉",
    name: "Búho / Sabiduría",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "buho", "owl", "sabiduria", "wisdom", "conocimiento", "inteligencia", "noche", "estudio"]
  },
  {
    emoji: "💡",
    name: "Bombilla / Idea",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "idea", "luz", "light", "inspiracion", "invencion", "pensamiento", "creatividad", "solucion"]
  },
  {
    emoji: "⚖️",
    name: "Balanza de la justicia",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "justicia", "justice", "balanza", "scale", "derecho", "ley", "equilibrio", "balance", "etica", "ethics"]
  },
  {
    emoji: "📜",
    name: "Pergamino",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "pergamino", "scroll", "historia", "manifiesto", "escrito", "documento", "antiguo"]
  },
  {
    emoji: "🧭",
    name: "Brújula",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "brujula", "compass", "orientacion", "direccion", "camino", "guia", "viaje", "proposito"]
  },
  {
    emoji: "🤔",
    name: "Cara pensativa",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "pensar", "thinking", "duda", "reflexion", "pregunta", "cuestionamiento", "mind"]
  },
  {
    emoji: "🌌",
    name: "Noche estrellada / Cosmos",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "cosmos", "universo", "universe", "espacio", "estrellas", "contemplacion", "existencia", "noche"]
  },
  {
    emoji: "🔮",
    name: "Bola de cristal",
    category: "philosophy",
    keywords: ["filosofia", "philosophy", "futuro", "misticismo", "destino", "vision", "magia"]
  },

  // CARAS Y EMOCIONES (Smileys & Emotions)
  {
    emoji: "😃",
    name: "Cara sonriente",
    category: "smileys",
    keywords: ["emociones", "smile", "feliz", "happy", "alegria", "risa", "contento"]
  },
  {
    emoji: "😎",
    name: "Cara con gafas de sol",
    category: "smileys",
    keywords: ["emociones", "cool", "gafas", "sol", "guay", "estilazo", "confianza"]
  },
  {
    emoji: "🥰",
    name: "Cara con corazones",
    category: "smileys",
    keywords: ["emociones", "amor", "love", "cariño", "enamorado", "afecto"]
  },
  {
    emoji: "🤯",
    name: "Explosión de cabeza",
    category: "smileys",
    keywords: ["emociones", "alucinante", "mindblown", "sorpresa", "brutal", "increible"]
  },
  {
    emoji: "🔥",
    name: "Fuego / Tendencia",
    category: "smileys",
    keywords: ["popular", "fuego", "fire", "tendencias", "hot", "pasion", "destacado", "top"]
  },
  {
    emoji: "✨",
    name: "Destellos / Magia",
    category: "smileys",
    keywords: ["popular", "magia", "magic", "estrellas", "stars", "nuevo", "destacado", "brillo", "sparkles"]
  },
  {
    emoji: "🌟",
    name: "Estrella brillante",
    category: "smileys",
    keywords: ["estrella", "star", "favorito", "brillo", "excelente", "top"]
  },
  {
    emoji: "🎉",
    name: "Fiesta / Celebración",
    category: "smileys",
    keywords: ["fiesta", "party", "celebracion", "exito", "felicitaciones", "confeti"]
  },
  {
    emoji: "💬",
    name: "Bocadillo de diálogo",
    category: "smileys",
    keywords: ["chat", "mensaje", "comentario", "dialogo", "discusion", "opinion"]
  },

  // NATURALEZA Y ANIMALES (Nature & Animals)
  {
    emoji: "🌿",
    name: "Hierba / Planta",
    category: "nature",
    keywords: ["naturaleza", "nature", "planta", "plant", "hojas", "verde", "ecologia", "botanica", "medio ambiente", "jardin"]
  },
  {
    emoji: "🌲",
    name: "Árbol perenne",
    category: "nature",
    keywords: ["naturaleza", "nature", "arbol", "tree", "bosque", "forest", "pino", "madera"]
  },
  {
    emoji: "🌸",
    name: "Flor de cerezo",
    category: "nature",
    keywords: ["naturaleza", "nature", "flor", "flower", "cerezo", "primavera", "belleza", "rosa"]
  },
  {
    emoji: "☀️",
    name: "Sol",
    category: "nature",
    keywords: ["naturaleza", "nature", "sol", "sun", "dia", "luz", "calor", "verano", "clima"]
  },
  {
    emoji: "🌍",
    name: "Tierra / Planeta",
    category: "nature",
    keywords: ["naturaleza", "nature", "tierra", "earth", "planeta", "planet", "mundo", "ecologia", "global"]
  },
  {
    emoji: "🌊",
    name: "Ola de agua",
    category: "nature",
    keywords: ["naturaleza", "nature", "agua", "water", "mar", "ocean", "ola", "wave", "surf", "playa"]
  },
  {
    emoji: "🍁",
    name: "Hoja de arce",
    category: "nature",
    keywords: ["naturaleza", "nature", "otoño", "autumn", "hoja", "hoja seca", "estacion"]
  },
  {
    emoji: "🍄",
    name: "Seta / Champiñón",
    category: "nature",
    keywords: ["naturaleza", "nature", "seta", "mushroom", "bosque", "hongo"]
  },
  {
    emoji: "🌻",
    name: "Girasol",
    category: "nature",
    keywords: ["naturaleza", "nature", "girasol", "sunflower", "flores", "amarillo"]
  },
  {
    emoji: "🐾",
    name: "Huellas de animal",
    category: "nature",
    keywords: ["animales", "pets", "perro", "gato", "mascota", "huella", "paws"]
  },
  {
    emoji: "🐶",
    name: "Perro",
    category: "nature",
    keywords: ["animales", "pets", "perro", "dog", "mascota", "fiel", "canino"]
  },
  {
    emoji: "🐱",
    name: "Gato",
    category: "nature",
    keywords: ["animales", "pets", "gato", "cat", "felino", "mascota"]
  },

  // COMIDA Y BEBIDA (Food & Drink)
  {
    emoji: "🍎",
    name: "Manzana roja",
    category: "food",
    keywords: ["comida", "food", "manzana", "apple", "fruta", "nutricion", "salud"]
  },
  {
    emoji: "☕",
    name: "Café",
    category: "food",
    keywords: ["comida", "food", "cafe", "coffee", "bebida", "desayuno", "mañana", "energia", "espresso"]
  },
  {
    emoji: "🍕",
    name: "Pizza",
    category: "food",
    keywords: ["comida", "food", "pizza", "queso", "italiana", "cena", "fast food"]
  },
  {
    emoji: "🍔",
    name: "Hamburguesa",
    category: "food",
    keywords: ["comida", "food", "hamburguesa", "burger", "carne", "fast food"]
  },
  {
    emoji: "🥑",
    name: "Aguacate",
    category: "food",
    keywords: ["comida", "food", "aguacate", "avocado", "sano", "saludable", "fruta"]
  },
  {
    emoji: "🍷",
    name: "Copa de vino",
    category: "food",
    keywords: ["comida", "food", "vino", "wine", "copa", "bebida", "cena", "celebracion"]
  },
  {
    emoji: "🍱",
    name: "Bento / Sushi",
    category: "food",
    keywords: ["comida", "food", "sushi", "bento", "japonesa", "arroz", "pescado"]
  },
  {
    emoji: "🍰",
    name: "Pastel",
    category: "food",
    keywords: ["comida", "food", "tarta", "cake", "dulce", "postre", "cumpleaños"]
  },

  // DEPORTES Y OCIO (Sports & Activities)
  {
    emoji: "⚽",
    name: "Fútbol",
    category: "activities",
    keywords: ["deporte", "sport", "futbol", "soccer", "pelota", "juego", "partido"]
  },
  {
    emoji: "🏀",
    name: "Baloncesto",
    category: "activities",
    keywords: ["deporte", "sport", "baloncesto", "basketball", "canasta", "pelota"]
  },
  {
    emoji: "🎾",
    name: "Tenis",
    category: "activities",
    keywords: ["deporte", "sport", "tenis", "tennis", "raqueta", "pista"]
  },
  {
    emoji: "🎮",
    name: "Mando de videojuegos",
    category: "activities",
    keywords: ["juegos", "gaming", "videojuegos", "games", "consola", "play", "ocio", "gamer"]
  },
  {
    emoji: "🎯",
    name: "Diana / Objetivo",
    category: "activities",
    keywords: ["juegos", "gaming", "diana", "target", "objetivo", "gol", "exito", "precision", "meta"]
  },
  {
    emoji: "🏆",
    name: "Trofeo",
    category: "activities",
    keywords: ["deporte", "sport", "trofeo", "trophy", "ganador", "winner", "premio", "victoria", "exito"]
  },
  {
    emoji: "🥇",
    name: "Medalla de oro",
    category: "activities",
    keywords: ["deporte", "sport", "medalla", "medal", "oro", "gold", "primer puesto", "campeon"]
  },
  {
    emoji: "🎲",
    name: "Dado",
    category: "activities",
    keywords: ["juegos", "games", "dado", "dice", "azar", "juego de mesa", "rol"]
  },
  {
    emoji: "🧩",
    name: "Pieza de puzle",
    category: "activities",
    keywords: ["juegos", "games", "puzle", "puzzle", "rompecabezas", "solucion", "logica"]
  },
  {
    emoji: "🎨",
    name: "Paleta de pintura",
    category: "activities",
    keywords: ["arte", "art", "pintura", "painting", "diseño", "design", "creatividad", "colores", "dibujo"]
  },
  {
    emoji: "🎵",
    name: "Nota musical",
    category: "activities",
    keywords: ["musica", "music", "nota", "sonido", "audio", "cancion", "ritmo"]
  },
  {
    emoji: "🎸",
    name: "Guitarra",
    category: "activities",
    keywords: ["musica", "music", "guitarra", "guitar", "rock", "instrumento", "concierto"]
  },
  {
    emoji: "🎬",
    name: "Claqueta de cine",
    category: "activities",
    keywords: ["cine", "cinema", "pelicula", "movie", "video", "produccion", "teatro", "filme"]
  },
  {
    emoji: "📷",
    name: "Cámara fotográfica",
    category: "activities",
    keywords: ["fotografia", "photography", "camara", "camera", "fotos", "imagen", "arte"]
  },
  {
    emoji: "✍️",
    name: "Mano escribiendo",
    category: "activities",
    keywords: ["escritura", "writing", "pluma", "pen", "redactar", "blog", "notas", "nota", "autor"]
  },

  // VIAJES Y LUGARES (Travel & Places)
  {
    emoji: "✈️",
    name: "Avión",
    category: "travel",
    keywords: ["viajes", "travel", "avion", "airplane", "vuelo", "flight", "vacaciones", "turismo", "destino"]
  },
  {
    emoji: "🗺️",
    name: "Mapa del mundo",
    category: "travel",
    keywords: ["viajes", "travel", "mapa", "map", "mundo", "exploracion", "ruta", "guia"]
  },
  {
    emoji: "🧳",
    name: "Maleta",
    category: "travel",
    keywords: ["viajes", "travel", "maleta", "luggage", "equipaje", "viaje", "turismo"]
  },
  {
    emoji: "🚗",
    name: "Coche",
    category: "travel",
    keywords: ["viajes", "travel", "coche", "car", "auto", "transporte", "conducir", "carretera"]
  },
  {
    emoji: "🏝️",
    name: "Isla desierta",
    category: "travel",
    keywords: ["viajes", "travel", "isla", "island", "playa", "beach", "vacaciones", "tropico"]
  },
  {
    emoji: "🏔️",
    name: "Montaña nevada",
    category: "travel",
    keywords: ["viajes", "travel", "montaña", "mountain", "nieve", "senderismo", "escalar", "aventura"]
  },
  {
    emoji: "⛵",
    name: "Velero / Barco",
    category: "travel",
    keywords: ["viajes", "travel", "barco", "boat", "mar", "navegacion", "velero"]
  },
  {
    emoji: "🏰",
    name: "Castillo",
    category: "travel",
    keywords: ["lugares", "places", "castillo", "castle", "historia", "fantasia", "monumento"]
  },

  // OBJETOS Y NEGOCIOS (Objects & Business)
  {
    emoji: "💰",
    name: "Bolsa de dinero",
    category: "objects",
    keywords: ["dinero", "money", "finanzas", "finance", "negocios", "business", "inversion", "economia", "wealth"]
  },
  {
    emoji: "💵",
    name: "Billetes",
    category: "objects",
    keywords: ["dinero", "money", "efectivo", "cash", "dolares", "pagos"]
  },
  {
    emoji: "📈",
    name: "Gráfico ascendente",
    category: "objects",
    keywords: ["dinero", "money", "finanzas", "finance", "crecimiento", "growth", "bolsa", "stock", "mercado", "estadisticas"]
  },
  {
    emoji: "💳",
    name: "Tarjeta de crédito",
    category: "objects",
    keywords: ["dinero", "money", "pago", "payment", "tarjeta", "card", "compras"]
  },
  {
    emoji: "📊",
    name: "Gráfico de barras",
    category: "objects",
    keywords: ["finanzas", "finance", "datos", "analytics", "informe", "report", "estadisticas"]
  },
  {
    emoji: "🪙",
    name: "Moneda",
    category: "objects",
    keywords: ["dinero", "money", "moneda", "coin", "cripto", "crypto", "bitcoin"]
  },
  {
    emoji: "💎",
    name: "Diamante / Gema",
    category: "objects",
    keywords: ["dinero", "money", "diamante", "diamond", "lujo", "valor", "gem", "premium"]
  },
  {
    emoji: "📁",
    name: "Carpeta",
    category: "objects",
    keywords: ["general", "carpeta", "folder", "archivo", "documento", "directorio", "categoria", "default"]
  },
  {
    emoji: "📌",
    name: "Chincheta",
    category: "objects",
    keywords: ["general", "fijar", "pin", "nota", "importante", "marcador"]
  },
  {
    emoji: "🏷️",
    name: "Etiqueta",
    category: "objects",
    keywords: ["general", "etiqueta", "tag", "tema", "categoria", "label"]
  },
  {
    emoji: "🔒",
    name: "Candado cerrado",
    category: "objects",
    keywords: ["privado", "private", "candado", "lock", "seguridad", "secreto", "privacidad"]
  },
  {
    emoji: "🔑",
    name: "Llave",
    category: "objects",
    keywords: ["seguridad", "key", "llave", "acceso", "clave"]
  },

  // SÍMBOLOS (Symbols)
  {
    emoji: "❤️",
    name: "Corazón",
    category: "symbols",
    keywords: ["corazon", "heart", "amor", "love"]
  },
  {
    emoji: "⭐",
    name: "Estrella",
    category: "symbols",
    keywords: ["estrella", "star", "destacado", "favorito"]
  },
  {
    emoji: "⚠️",
    name: "Advertencia",
    category: "symbols",
    keywords: ["alerta", "warning", "precaucion", "atencion"]
  },
  {
    emoji: "✅",
    name: "Verificación",
    category: "symbols",
    keywords: ["check", "ok", "correcto", "listo", "done"]
  },
  {
    emoji: "❓",
    name: "Interrogación",
    category: "symbols",
    keywords: ["pregunta", "question", "duda", "help", "ayuda"]
  },
  {
    emoji: "♾️",
    name: "Infinito",
    category: "symbols",
    keywords: ["infinito", "infinity", "siempre", "eterno", "loop"]
  }
];

/**
 * Filter emojis by search query or selected category
 */
export function filterEmojis(query: string, categoryId: string = "all"): EmojiItem[] {
  let list = EMOJI_DATA;

  if (categoryId !== "all") {
    list = list.filter((item) => item.category === categoryId);
  }

  const cleanQuery = query
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (!cleanQuery) return list;

  return list.filter((item) => {
    // Check direct emoji symbol
    if (item.emoji.includes(cleanQuery)) return true;

    // Check name
    const cleanName = item.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (cleanName.includes(cleanQuery)) return true;

    // Check keywords
    return item.keywords.some((kw) => {
      const cleanKw = kw
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return cleanKw.includes(cleanQuery) || cleanQuery.includes(cleanKw);
    });
  });
}

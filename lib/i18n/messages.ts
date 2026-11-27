import type { Locale } from './types'

export type Messages = typeof es

const es = {
  nav: {
    events: 'eventos',
    resources: 'recursos',
    contact: 'contacto',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
  },
  languages: {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    ar: 'العربية',
    no: 'Norsk',
  },
  hero: {
    title: ['El espacio', 'para conectar', 'founders'],
    body: 'Haz preguntas, comparte ideas y construye conexiones con otros emprendedores — justo en la mesa, no en una charla. Synergy hace que el networking sea estratégico, cercano y con resultados.',
    cta: 'Ir a la próxima reunión',
    howItWorks: 'Cómo funciona',
    matchConfirmed: 'match confirmado',
  },
  matching: {
    heading: ['conexiones que no ocurren', 'por casualidad'],
    intro: 'Nuestra IA te conecta con los founders correctos, en el evento o después.',
    cards: [
      {
        title: ['Tu perfil', 'es el punto', 'de partida.'],
        body: 'Registras tus retos actuales, soluciones que ofreces e intereses. La IA construye tu grafo de afinidad con toda la red.',
      },
      {
        title: ['La IA', 'calcula', 'compatibilidades.'],
        body: 'Cruza perfiles en tiempo real: quién resuelve lo que necesitas, comparte industria o está en tu misma ciudad.',
      },
      {
        title: ['Te conectamos', 'donde', 'estés.'],
        body: 'Recibe recomendaciones semanales por WhatsApp, asistas o no. Si visitas un espacio, la conexión ocurre en persona.',
      },
    ],
  },
  steps: {
    heading: ['lo que sucede', 'cuando vas a synergy'],
    cta: 'Quiero ir a la próxima reunión',
    items: [
      {
        n: '01',
        title: 'tu formulario',
        body: 'Llenas lo que ofreces, lo que necesitas y tus intereses. Ahí empieza tu lugar en la red.',
      },
      {
        n: '02',
        title: 'tu perfil',
        body: 'Identificamos desafíos, soluciones e industria para construir tu mapa de compatibilidad.',
      },
      {
        n: '03',
        title: 'el algoritmo',
        body: 'Cruzamos perfiles y calculamos con quién encajas mejor — antes de cada reunión.',
      },
      {
        n: '04',
        title: 'te avisamos',
        body: 'Recibes tus recomendaciones por WhatsApp, asistas o no al encuentro presencial.',
      },
      {
        n: '05',
        title: 'la reunión',
        body: 'Llegas a un espacio íntimo. Te ubicamos en mesa con founders de manera estratégica.',
      },
      {
        n: '06',
        title: 'la conexión',
        body: 'Conoces en persona a las personas correctas. Sin ruido, sin tarjetas al azar.',
      },
    ],
  },
  experiences: {
    pill: 'experiencias',
    heading: ['nuestro portafolio de ', 'experiencias'],
    intro: 'distintos formatos para distintos momentos de tu camino como founder.',
    founders: 'founders',
    status: {
      ACTIVO: 'ACTIVO',
      PRÓXIMO: 'PRÓXIMO',
      COMPLETADO: 'COMPLETADO',
    },
    frequency: {
      Trimestral: 'Trimestral',
      Cuatrimestre: 'Cuatrimestre',
      Semestral: 'Semestral',
    },
    items: [
      {
        description:
          'Encuentros íntimos entre founders del Caribe para conectar, colaborar y construir alianzas reales.',
      },
      {
        description:
          'Evento en cine con panel de expertos y pitch de 5 startups ante inversores y founders del ecosistema.',
      },
      {
        description:
          'Experiencia inmersiva de varios días donde startup founders conviven, construyen y reciben mentoría entre sí.',
      },
    ],
  },
  gallery: {
    headingBefore: 'imágenes de quienes construyen',
    headingAccent: 'juntos',
    intro: 'un vistazo a encuentros, pitches y la comunidad synergy en el caribe colombiano.',
    photos: [
      { name: 'Networking abierto', badge: 'after office' },
      { name: 'Conexiones en vivo', badge: 'networking' },
      { name: 'Pitch y conversación', badge: 'pitch' },
      { name: 'Plenaria comunidad', badge: 'plenaria' },
      { name: 'Bienvenida al encuentro', badge: 'evento' },
      { name: 'Workshop', badge: 'workshop' },
      { name: 'Noche founders', badge: 'comunidad' },
      { name: 'Nuevas alianzas', badge: 'cierre' },
      { name: 'Espacio pop-up', badge: 'pop-up' },
      { name: 'Equipo y aliados', badge: 'backstage' },
    ],
  },
  whyAttend: {
    heading: ['por qué asisten', 'a synergy'],
    intro: [
      'Synergy es para founders y makers que quieren conexiones con intención: gente que resuelve lo que necesitas, en la misma mesa.',
      'Tú llegas con tu proyecto. Nosotros hacemos el match, la mesa y el seguimiento, para que no dependas del azar.',
    ],
    cta: 'Quiero ir a la próxima reunión',
    stats: [
      { num: '4.9', label: 'valoración media', showStar: true },
      { num: '500+', label: 'founders en eventos' },
      { num: '98%', label: 'recomendarían volver' },
    ],
    reasons: [
      {
        n: '01',
        title: 'encuentras a tu gente',
        body: 'Un grupo curado de founders que entienden el camino y buscan alianzas reales, no tarjetas al azar.',
      },
      {
        n: '02',
        title: 'llegas con el match hecho',
        body: 'Antes de la reunión, la IA cruza perfiles: quién resuelve lo que necesitas, comparte industria o está en tu ciudad.',
      },
      {
        n: '03',
        title: 'la conexión es en persona',
        body: 'Espacios íntimos. Te ubicamos en mesa de forma estratégica, sin ruido y sin pitch forzado.',
      },
      {
        n: '04',
        title: 'la red no se apaga',
        body: 'Recibes recomendaciones por WhatsApp, asistas o no. Si visitas un espacio, la conexión ocurre ahí.',
      },
    ],
  },
  reviews: {
    heading: ['lo que dicen quienes ya', 'vivieron la experiencia'],
    stats: [
      { num: '4.9', label: 'valoración media', showStar: true },
      { num: '500+', label: 'founders en eventos' },
      { num: '98%', label: 'recomendarían la experiencia' },
    ],
    quotes: [
      'Salí con tres reuniones agendadas con gente que buscaba exactamente lo que ofrecemos.',
      'El match antes de llegar marca la diferencia. No es networking al azar.',
      'El pitch me abrió puertas con mentores que no habría conocido de otra forma.',
      'La IA no sustituye al café, lo hace más eficiente.',
      'Como inversionista busco claridad y founders con traction real, no solo slides.',
      'Postulamos nuestra ciudad y el proceso fue claro. Ya piden la siguiente fecha.',
      'Retomé conversaciones que se habían enfriado. Es red viva, no una lista.',
    ],
  },
  faq: {
    heading: ['todo lo que ', 'quieres saber.'],
    intro: 'Si no encuentras tu respuesta aquí, escríbenos directamente.',
    contact: 'contáctanos',
    items: [
      {
        q: '¿Qué es Synergy y para quién es?',
        a: 'Synergy es una comunidad de founders y makers del Caribe colombiano y Latinoamérica. Organizamos experiencias de networking, conectamos perfiles por IA y generamos un ecosistema donde los emprendedores encuentran alianzas, recursos y colaboración real. Si estás construyendo algo, este es tu lugar.',
      },
      {
        q: '¿Cómo funciona el match por inteligencia artificial?',
        a: 'Al registrarte, nuestra IA analiza tu perfil —qué ofreces, qué necesitas y en qué etapa está tu proyecto— y te conecta con founders que complementan lo que buscas. El proceso es automático y sucede antes de cada evento para que llegues con conexiones relevantes desde el primer minuto.',
      },
      {
        q: '¿Cuánto cuesta unirme a Synergy?',
        a: 'Registrarte en la comunidad es gratuito. Cada experiencia (Networking Meetings, Founder House, Spotlight) tiene su propio costo de entrada que varía según el formato. Consulta la página de eventos para ver los precios actualizados de cada uno.',
      },
      {
        q: '¿En qué ciudades operan actualmente?',
        a: 'Actualmente estamos activos en Barranquilla como sede principal, con presencia creciente en el Caribe colombiano. Si quieres llevar Synergy a tu ciudad, puedes postularte desde la sección "Postula tu ciudad" en el sitio.',
      },
      {
        q: '¿Qué diferencia a Synergy de otros eventos de networking?',
        a: 'La mayoría del networking tradicional es aleatorio. En Synergy cada conexión tiene intención: usamos IA para que llegues sabiendo con quién hablar y por qué. Además somos una comunidad continua, no solo un evento puntual — los founders se mantienen conectados entre ediciones.',
      },
      {
        q: '¿Puedo ser aliado o patrocinador de Synergy?',
        a: 'Sí. Trabajamos con universidades, programas de incubación, empresas y marcas que quieran conectarse con el ecosistema founder del Caribe. Escríbenos desde la sección "Proponer alianza" y coordinamos una conversación.',
      },
    ],
  },
  footer: {
    eventsTitle: 'Eventos & Networking',
    contactTitle: 'Contacto',
    legalTitle: 'Legal & Confianza',
    calendar: 'Calendario de eventos',
    applyCity: 'Postula a tu ciudad',
    ia: 'IA para conectar',
    questions: 'Dudas y preguntas',
    partnership: 'Proponer alianza',
    privacy: 'Políticas de Privacidad',
    terms: 'Términos y condiciones',
    cookies: 'Política de cookies',
    data: 'Uso de datos y comunidades',
    rights: 'Derechos reservados Synergy Founders & Makers community',
  },
}

const en: Messages = {
  nav: {
    events: 'events',
    resources: 'resources',
    contact: 'contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
  },
  languages: {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    ar: 'العربية',
    no: 'Norsk',
  },
  hero: {
    title: ['The space', 'to connect', 'founders'],
    body: 'Ask questions, share ideas and build connections with other entrepreneurs — at the table, not in a lecture. Synergy makes networking strategic, close and results-driven.',
    cta: 'Go to the next meetup',
    howItWorks: 'How it works',
    matchConfirmed: 'match confirmed',
  },
  matching: {
    heading: ['connections that don’t happen', 'by chance'],
    intro: 'Our AI connects you with the right founders, at the event or after.',
    cards: [
      {
        title: ['Your profile', 'is the starting', 'point.'],
        body: 'You log your current challenges, the solutions you offer and your interests. The AI builds your affinity graph across the network.',
      },
      {
        title: ['AI', 'calculates', 'compatibility.'],
        body: 'It crosses profiles in real time: who solves what you need, shares your industry or is in the same city.',
      },
      {
        title: ['We connect you', 'wherever', 'you are.'],
        body: 'Get weekly recommendations on WhatsApp, whether you attend or not. If you visit a space, the connection happens in person.',
      },
    ],
  },
  steps: {
    heading: ['what happens', 'when you go to synergy'],
    cta: 'I want to go to the next meetup',
    items: [
      {
        n: '01',
        title: 'your form',
        body: 'You fill in what you offer, what you need and your interests. That’s where your place in the network begins.',
      },
      {
        n: '02',
        title: 'your profile',
        body: 'We map challenges, solutions and industry to build your compatibility map.',
      },
      {
        n: '03',
        title: 'the algorithm',
        body: 'We cross profiles and calculate who you fit with best — before each meetup.',
      },
      {
        n: '04',
        title: 'we ping you',
        body: 'You get your recommendations on WhatsApp, whether you attend in person or not.',
      },
      {
        n: '05',
        title: 'the meetup',
        body: 'You arrive at an intimate space. We seat you with founders, on purpose.',
      },
      {
        n: '06',
        title: 'the connection',
        body: 'You meet the right people in person. No noise, no random business cards.',
      },
    ],
  },
  experiences: {
    pill: 'experiences',
    heading: ['our portfolio of ', 'experiences'],
    intro: 'different formats for different moments on your path as a founder.',
    founders: 'founders',
    status: {
      ACTIVO: 'ACTIVE',
      PRÓXIMO: 'UPCOMING',
      COMPLETADO: 'COMPLETED',
    },
    frequency: {
      Trimestral: 'Quarterly',
      Cuatrimestre: 'Every 4 months',
      Semestral: 'Twice a year',
    },
    items: [
      {
        description:
          'Intimate gatherings of Caribbean founders to connect, collaborate and build real alliances.',
      },
      {
        description:
          'A cinema event with an expert panel and pitches from 5 startups in front of investors and founders.',
      },
      {
        description:
          'A multi-day immersive experience where startup founders live, build and mentor one another.',
      },
    ],
  },
  gallery: {
    headingBefore: 'images of those who build',
    headingAccent: 'together',
    intro: 'a look at meetups, pitches and the synergy community in the colombian caribbean.',
    photos: [
      { name: 'Open networking', badge: 'after office' },
      { name: 'Live connections', badge: 'networking' },
      { name: 'Pitch and conversation', badge: 'pitch' },
      { name: 'Community plenary', badge: 'plenary' },
      { name: 'Welcome to the meetup', badge: 'event' },
      { name: 'Workshop', badge: 'workshop' },
      { name: 'Founders night', badge: 'community' },
      { name: 'New alliances', badge: 'closing' },
      { name: 'Pop-up space', badge: 'pop-up' },
      { name: 'Team and partners', badge: 'backstage' },
    ],
  },
  whyAttend: {
    heading: ['why people come', 'to synergy'],
    intro: [
      'Synergy is for founders and makers who want connections with intent: people who solve what you need, at the same table.',
      'You show up with your project. We handle the match, the seating and the follow-up, so you don’t depend on chance.',
    ],
    cta: 'I want to go to the next meetup',
    stats: [
      { num: '4.9', label: 'average rating', showStar: true },
      { num: '500+', label: 'founders at events' },
      { num: '98%', label: 'would come back' },
    ],
    reasons: [
      {
        n: '01',
        title: 'you find your people',
        body: 'A curated group of founders who get the journey and want real alliances, not random business cards.',
      },
      {
        n: '02',
        title: 'you arrive already matched',
        body: 'Before the meetup, AI crosses profiles: who solves what you need, shares your industry or is in your city.',
      },
      {
        n: '03',
        title: 'the connection is in person',
        body: 'Intimate rooms. We seat you with founders on purpose — no noise, no forced pitch.',
      },
      {
        n: '04',
        title: 'the network stays on',
        body: 'You get WhatsApp recommendations whether you attend or not. If you visit a space, the connection happens there.',
      },
    ],
  },
  reviews: {
    heading: ['what people say after', 'living the experience'],
    stats: [
      { num: '4.9', label: 'average rating', showStar: true },
      { num: '500+', label: 'founders at events' },
      { num: '98%', label: 'would recommend the experience' },
    ],
    quotes: [
      'I left with three meetings booked with people who needed exactly what we offer.',
      'Matching before you arrive is the difference. This isn’t random networking.',
      'The pitch opened doors with mentors I wouldn’t have met any other way.',
      'AI doesn’t replace coffee — it makes it more efficient.',
      'As an investor I look for clarity and founders with real traction, not just slides.',
      'We applied our city and the process was clear. They’re already asking for the next date.',
      'I picked up conversations that had gone cold. It’s a living network, not a list.',
    ],
  },
  faq: {
    heading: ['everything you ', 'want to know.'],
    intro: 'If you don’t find your answer here, write to us directly.',
    contact: 'contact us',
    items: [
      {
        q: 'What is Synergy and who is it for?',
        a: 'Synergy is a community of founders and makers from the Colombian Caribbean and Latin America. We host networking experiences, match profiles with AI and build an ecosystem where entrepreneurs find alliances, resources and real collaboration. If you’re building something, this is your place.',
      },
      {
        q: 'How does AI matching work?',
        a: 'When you register, our AI reads your profile — what you offer, what you need and the stage of your project — and connects you with founders who complement what you’re looking for. It happens automatically before each event so you arrive with relevant connections from minute one.',
      },
      {
        q: 'How much does it cost to join Synergy?',
        a: 'Joining the community is free. Each experience (Networking Meetings, Founder House, Spotlight) has its own ticket price depending on the format. Check the events page for current prices.',
      },
      {
        q: 'Which cities are you in right now?',
        a: 'We’re currently active in Barranquilla as our main hub, with a growing presence across the Colombian Caribbean. If you want to bring Synergy to your city, you can apply from the “Apply your city” section on the site.',
      },
      {
        q: 'How is Synergy different from other networking events?',
        a: 'Most traditional networking is random. At Synergy every connection has intent: we use AI so you arrive knowing who to talk to and why. We’re also an ongoing community, not a one-off event — founders stay connected between editions.',
      },
      {
        q: 'Can I be a partner or sponsor of Synergy?',
        a: 'Yes. We work with universities, incubation programs, companies and brands that want to connect with the Caribbean founder ecosystem. Write to us from the “Propose a partnership” section and we’ll set up a conversation.',
      },
    ],
  },
  footer: {
    eventsTitle: 'Events & Networking',
    contactTitle: 'Contact',
    legalTitle: 'Legal & Trust',
    calendar: 'Events calendar',
    applyCity: 'Apply your city',
    ia: 'AI to connect',
    questions: 'Questions',
    partnership: 'Propose a partnership',
    privacy: 'Privacy Policy',
    terms: 'Terms and conditions',
    cookies: 'Cookie policy',
    data: 'Data use and communities',
    rights: 'All rights reserved Synergy Founders & Makers community',
  },
}

const pt: Messages = {
  nav: {
    events: 'eventos',
    resources: 'recursos',
    contact: 'contato',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    language: 'Idioma',
  },
  languages: {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    ar: 'العربية',
    no: 'Norsk',
  },
  hero: {
    title: ['O espaço', 'para conectar', 'founders'],
    body: 'Faça perguntas, compartilhe ideias e construa conexões com outros empreendedores — na mesa, não numa palestra. A Synergy torna o networking estratégico, próximo e com resultado.',
    cta: 'Ir à próxima reunião',
    howItWorks: 'Como funciona',
    matchConfirmed: 'match confirmado',
  },
  matching: {
    heading: ['conexões que não acontecem', 'por acaso'],
    intro: 'Nossa IA te conecta com os founders certos, no evento ou depois.',
    cards: [
      {
        title: ['Seu perfil', 'é o ponto', 'de partida.'],
        body: 'Você registra seus desafios atuais, as soluções que oferece e seus interesses. A IA constrói seu grafo de afinidade com toda a rede.',
      },
      {
        title: ['A IA', 'calcula', 'compatibilidades.'],
        body: 'Cruza perfis em tempo real: quem resolve o que você precisa, compartilha indústria ou está na mesma cidade.',
      },
      {
        title: ['Conectamos você', 'onde', 'estiver.'],
        body: 'Receba recomendações semanais no WhatsApp, compareça ou não. Se visitar um espaço, a conexão acontece pessoalmente.',
      },
    ],
  },
  steps: {
    heading: ['o que acontece', 'quando você vai à synergy'],
    cta: 'Quero ir à próxima reunião',
    items: [
      {
        n: '01',
        title: 'seu formulário',
        body: 'Você preenche o que oferece, o que precisa e seus interesses. Aí começa o seu lugar na rede.',
      },
      {
        n: '02',
        title: 'seu perfil',
        body: 'Identificamos desafios, soluções e indústria para construir seu mapa de compatibilidade.',
      },
      {
        n: '03',
        title: 'o algoritmo',
        body: 'Cruzamos perfis e calculamos com quem você combina melhor — antes de cada reunião.',
      },
      {
        n: '04',
        title: 'avisamos você',
        body: 'Você recebe suas recomendações no WhatsApp, compareça ou não ao encontro presencial.',
      },
      {
        n: '05',
        title: 'a reunião',
        body: 'Você chega a um espaço íntimo. Sentamos você com founders de forma estratégica.',
      },
      {
        n: '06',
        title: 'a conexão',
        body: 'Você conhece pessoalmente as pessoas certas. Sem ruído, sem cartões ao acaso.',
      },
    ],
  },
  experiences: {
    pill: 'experiências',
    heading: ['nosso portfólio de ', 'experiências'],
    intro: 'formatos diferentes para momentos diferentes da sua jornada como founder.',
    founders: 'founders',
    status: {
      ACTIVO: 'ATIVO',
      PRÓXIMO: 'EM BREVE',
      COMPLETADO: 'CONCLUÍDO',
    },
    frequency: {
      Trimestral: 'Trimestral',
      Cuatrimestre: 'A cada 4 meses',
      Semestral: 'Semestral',
    },
    items: [
      {
        description:
          'Encontros íntimos entre founders do Caribe para conectar, colaborar e construir alianças reais.',
      },
      {
        description:
          'Evento em cinema com painel de especialistas e pitch de 5 startups diante de investidores e founders do ecossistema.',
      },
      {
        description:
          'Experiência imersiva de vários dias em que startup founders convivem, constroem e recebem mentoria entre si.',
      },
    ],
  },
  gallery: {
    headingBefore: 'imagens de quem constrói',
    headingAccent: 'junto',
    intro: 'um olhar sobre encontros, pitches e a comunidade synergy no caribe colombiano.',
    photos: [
      { name: 'Networking aberto', badge: 'after office' },
      { name: 'Conexões ao vivo', badge: 'networking' },
      { name: 'Pitch e conversa', badge: 'pitch' },
      { name: 'Plenária da comunidade', badge: 'plenária' },
      { name: 'Boas-vindas ao encontro', badge: 'evento' },
      { name: 'Workshop', badge: 'workshop' },
      { name: 'Noite founders', badge: 'comunidade' },
      { name: 'Novas alianças', badge: 'encerramento' },
      { name: 'Espaço pop-up', badge: 'pop-up' },
      { name: 'Equipe e parceiros', badge: 'backstage' },
    ],
  },
  whyAttend: {
    heading: ['por que vão', 'à synergy'],
    intro: [
      'A Synergy é para founders e makers que querem conexões com intenção: gente que resolve o que você precisa, na mesma mesa.',
      'Você chega com o seu projeto. Nós fazemos o match, a mesa e o acompanhamento, para você não depender do acaso.',
    ],
    cta: 'Quero ir à próxima reunião',
    stats: [
      { num: '4.9', label: 'avaliação média', showStar: true },
      { num: '500+', label: 'founders em eventos' },
      { num: '98%', label: 'voltariam de novo' },
    ],
    reasons: [
      {
        n: '01',
        title: 'você encontra a sua gente',
        body: 'Um grupo curado de founders que entendem o caminho e buscam alianças reais, não cartões ao acaso.',
      },
      {
        n: '02',
        title: 'você chega com o match feito',
        body: 'Antes da reunião, a IA cruza perfis: quem resolve o que você precisa, compartilha indústria ou está na sua cidade.',
      },
      {
        n: '03',
        title: 'a conexão é pessoal',
        body: 'Espaços íntimos. Sentamos você com founders de forma estratégica, sem ruído e sem pitch forçado.',
      },
      {
        n: '04',
        title: 'a rede não desliga',
        body: 'Você recebe recomendações no WhatsApp, compareça ou não. Se visitar um espaço, a conexão acontece lá.',
      },
    ],
  },
  reviews: {
    heading: ['o que dizem os que já', 'viveram a experiência'],
    stats: [
      { num: '4.9', label: 'avaliação média', showStar: true },
      { num: '500+', label: 'founders em eventos' },
      { num: '98%', label: 'recomendariam a experiência' },
    ],
    quotes: [
      'Saí com três reuniões agendadas com gente que buscava exatamente o que oferecemos.',
      'O match antes de chegar faz a diferença. Não é networking ao acaso.',
      'O pitch me abriu portas com mentores que eu não teria conhecido de outro jeito.',
      'A IA não substitui o café — ela o torna mais eficiente.',
      'Como investidora busco clareza e founders com tração real, não só slides.',
      'Indicamos nossa cidade e o processo foi claro. Já pedem a próxima data.',
      'Retomei conversas que tinham esfriado. É rede viva, não uma lista.',
    ],
  },
  faq: {
    heading: ['tudo o que você ', 'quer saber.'],
    intro: 'Se não encontrar sua resposta aqui, escreva para a gente.',
    contact: 'fale conosco',
    items: [
      {
        q: 'O que é a Synergy e para quem é?',
        a: 'A Synergy é uma comunidade de founders e makers do Caribe colombiano e da América Latina. Organizamos experiências de networking, conectamos perfis com IA e geramos um ecossistema onde empreendedores encontram alianças, recursos e colaboração de verdade. Se você está construindo algo, este é o seu lugar.',
      },
      {
        q: 'Como funciona o match por inteligência artificial?',
        a: 'Ao se cadastrar, nossa IA analisa seu perfil — o que você oferece, o que precisa e em que etapa está o projeto — e te conecta com founders que complementam o que você busca. O processo é automático e acontece antes de cada evento para você chegar com conexões relevantes desde o primeiro minuto.',
      },
      {
        q: 'Quanto custa participar da Synergy?',
        a: 'Entrar na comunidade é gratuito. Cada experiência (Networking Meetings, Founder House, Spotlight) tem o próprio valor de entrada, conforme o formato. Consulte a página de eventos para ver os preços atualizados.',
      },
      {
        q: 'Em quais cidades vocês atuam hoje?',
        a: 'Estamos ativos em Barranquilla como sede principal, com presença crescente no Caribe colombiano. Se quiser levar a Synergy para a sua cidade, você pode se candidatar na seção “Candidate sua cidade” no site.',
      },
      {
        q: 'O que diferencia a Synergy de outros eventos de networking?',
        a: 'A maior parte do networking tradicional é aleatória. Na Synergy cada conexão tem intenção: usamos IA para você chegar sabendo com quem falar e por quê. Além disso somos uma comunidade contínua, não só um evento pontual — os founders seguem conectados entre as edições.',
      },
      {
        q: 'Posso ser aliado ou patrocinador da Synergy?',
        a: 'Sim. Trabalhamos com universidades, programas de incubação, empresas e marcas que queiram se conectar com o ecossistema founder do Caribe. Escreva pela seção “Propor parceria” e agendamos uma conversa.',
      },
    ],
  },
  footer: {
    eventsTitle: 'Eventos & Networking',
    contactTitle: 'Contato',
    legalTitle: 'Legal & Confiança',
    calendar: 'Calendário de eventos',
    applyCity: 'Candidate sua cidade',
    ia: 'IA para conectar',
    questions: 'Dúvidas e perguntas',
    partnership: 'Propor parceria',
    privacy: 'Política de Privacidade',
    terms: 'Termos e condições',
    cookies: 'Política de cookies',
    data: 'Uso de dados e comunidades',
    rights: 'Todos os direitos reservados Synergy Founders & Makers community',
  },
}

const ar: Messages = {
  nav: {
    events: 'الفعاليات',
    resources: 'الموارد',
    contact: 'تواصل',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    language: 'اللغة',
  },
  languages: {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    ar: 'العربية',
    no: 'Norsk',
  },
  hero: {
    title: ['المساحة', 'لربط', 'المؤسسين'],
    body: 'اطرح أسئلة، شارك أفكارك وابنِ علاقات مع رواد أعمال آخرين — على الطاولة، لا في محاضرة. سينرجي تجعل التشبيك استراتيجياً وقريباً وذا نتائج.',
    cta: 'اذهب إلى اللقاء القادم',
    howItWorks: 'كيف يعمل',
    matchConfirmed: 'تم تأكيد التطابق',
  },
  matching: {
    heading: ['علاقات لا تحدث', 'بالمصادفة'],
    intro: 'ذكاءنا الاصطناعي يربطك بالمؤسسين المناسبين، في الحدث أو بعده.',
    cards: [
      {
        title: ['ملفك', 'هو نقطة', 'الانطلاق.'],
        body: 'تسجّل تحدياتك الحالية والحلول التي تقدمها واهتماماتك. الذكاء الاصطناعي يبني شبكة توافقك مع الجميع.',
      },
      {
        title: ['الذكاء', 'يحسب', 'التوافق.'],
        body: 'يعبر الملفات في الوقت الفعلي: من يحل ما تحتاجه، أو يشارك قطاعك، أو يكون في مدينتك.',
      },
      {
        title: ['نصلك', 'أينما', 'كنت.'],
        body: 'تصلك توصيات أسبوعية عبر واتساب، حضرت أم لا. إذا زرت مساحة، تحدث الصلة وجهاً لوجه.',
      },
    ],
  },
  steps: {
    heading: ['ماذا يحدث', 'عندما تأتي إلى synergy'],
    cta: 'أريد الذهاب إلى اللقاء القادم',
    items: [
      {
        n: '01',
        title: 'استمارتك',
        body: 'تملأ ما تقدمه وما تحتاجه واهتماماتك. من هنا يبدأ مكانك في الشبكة.',
      },
      {
        n: '02',
        title: 'ملفك',
        body: 'نحدد التحديات والحلول والقطاع لنبني خريطة توافقك.',
      },
      {
        n: '03',
        title: 'الخوارزمية',
        body: 'نعبر الملفات ونحسب مع من تناسب أكثر — قبل كل لقاء.',
      },
      {
        n: '04',
        title: 'نُعلمك',
        body: 'تصلك توصياتك عبر واتساب، حضرت اللقاء الحضوري أم لا.',
      },
      {
        n: '05',
        title: 'اللقاء',
        body: 'تصل إلى مساحة حميمة. نجلسك مع مؤسسين بشكل استراتيجي.',
      },
      {
        n: '06',
        title: 'الصلة',
        body: 'تلتقي الأشخاص المناسبين وجهاً لوجه. بلا ضوضاء، بلا بطاقات عشوائية.',
      },
    ],
  },
  experiences: {
    pill: 'تجارب',
    heading: ['محفظتنا من ', 'التجارب'],
    intro: 'صيغ مختلفة للحظات مختلفة في طريقك كمؤسس.',
    founders: 'مؤسسون',
    status: {
      ACTIVO: 'نشط',
      PRÓXIMO: 'قادم',
      COMPLETADO: 'مكتمل',
    },
    frequency: {
      Trimestral: 'ربع سنوي',
      Cuatrimestre: 'كل أربعة أشهر',
      Semestral: 'نصف سنوي',
    },
    items: [
      {
        description: 'لقاءات حميمة بين مؤسسي الكاريبي للتواصل والتعاون وبناء تحالفات حقيقية.',
      },
      {
        description: 'حدث في سينما مع لجنة خبراء وعروض من خمس شركات ناشئة أمام مستثمرين ومؤسسين.',
      },
      {
        description: 'تجربة غامرة لعدة أيام يعيش فيها مؤسسو الشركات الناشئة ويبنون ويتبادلون الإرشاد.',
      },
    ],
  },
  gallery: {
    headingBefore: 'صور لمن يبنون',
    headingAccent: 'معاً',
    intro: 'لمحة عن اللقاءات والعروض ومجتمع سينرجي في الكاريبي الكولومبي.',
    photos: [
      { name: 'تشبيك مفتوح', badge: 'after office' },
      { name: 'صلات مباشرة', badge: 'networking' },
      { name: 'عرض وحوار', badge: 'pitch' },
      { name: 'جلسة المجتمع', badge: 'plenaria' },
      { name: 'ترحيب باللقاء', badge: 'evento' },
      { name: 'ورشة', badge: 'workshop' },
      { name: 'ليلة المؤسسين', badge: 'comunidad' },
      { name: 'تحالفات جديدة', badge: 'cierre' },
      { name: 'مساحة مؤقتة', badge: 'pop-up' },
      { name: 'الفريق والشركاء', badge: 'backstage' },
    ],
  },
  whyAttend: {
    heading: ['لماذا يحضرون', 'إلى synergy'],
    intro: [
      'سينرجي للمؤسسين وصنّاع المشاريع الذين يريدون علاقات بنية: أشخاص يحلّون ما تحتاجه، على الطاولة نفسها.',
      'تأتي بمشروعك. نحن نتولى التطابق والطاولة والمتابعة، حتى لا تعتمد على الصدفة.',
    ],
    cta: 'أريد الذهاب إلى اللقاء القادم',
    stats: [
      { num: '4.9', label: 'متوسط التقييم', showStar: true },
      { num: '500+', label: 'مؤسسون في الفعاليات' },
      { num: '98%', label: 'سيعودون مجدداً' },
    ],
    reasons: [
      {
        n: '01',
        title: 'تجد ناسك',
        body: 'مجموعة منتقاة من المؤسسين يفهمون الطريق ويريدون تحالفات حقيقية، لا بطاقات عشوائية.',
      },
      {
        n: '02',
        title: 'تصل والتطابق جاهز',
        body: 'قبل اللقاء، يعبُر الذكاء الاصطناعي الملفات: من يحل ما تحتاجه، أو يشارك قطاعك، أو يكون في مدينتك.',
      },
      {
        n: '03',
        title: 'الصلة وجهاً لوجه',
        body: 'مساحات حميمة. نجلسك مع مؤسسين عن قصد — بلا ضوضاء وبلا عرض إجباري.',
      },
      {
        n: '04',
        title: 'الشبكة لا تنطفئ',
        body: 'تصلك توصيات واتساب حضرت أم لا. إذا زرت مساحة، تحدث الصلة هناك.',
      },
    ],
  },
  reviews: {
    heading: ['ماذا يقول من عاشوا', 'التجربة'],
    stats: [
      { num: '4.9', label: 'متوسط التقييم', showStar: true },
      { num: '500+', label: 'مؤسسون في الفعاليات' },
      { num: '98%', label: 'سيوصون بالتجربة' },
    ],
    quotes: [
      'خرجت بثلاثة مواعيد مع أشخاص كانوا يبحثون تماماً عما نقدمه.',
      'التطابق قبل الوصول يصنع الفرق. هذا ليس تشبيكاً عشوائياً.',
      'العرض فتح لي أبواباً مع مرشدين ما كنت لألقاهم بطريقة أخرى.',
      'الذكاء الاصطناعي لا يحل محل القهوة، بل يجعلها أجدى.',
      'كمستثمر أبحث عن وضوح ومؤسسين بتقدم حقيقي، لا شرائح فقط.',
      'رشّحنا مدينتنا وكانت العملية واضحة. يطلبون الموعد التالي منذ الآن.',
      'استأنفت محادثات كانت قد بردت. إنها شبكة حية، لا قائمة.',
    ],
  },
  faq: {
    heading: ['كل ما ', 'تريد معرفته.'],
    intro: 'إن لم تجد إجابتك هنا، اكتب لنا مباشرة.',
    contact: 'تواصل معنا',
    items: [
      {
        q: 'ما هي سينرجي ولمن هي؟',
        a: 'سينرجي مجتمع لمؤسسين وصنّاع من الكاريبي الكولومبي وأمريكا اللاتينية. ننظم تجارب تشبيك، نربط الملفات بالذكاء الاصطناعي، ونبني منظومة يجد فيها رواد الأعمال تحالفات وموارد وتعاوناً حقيقياً. إن كنت تبني شيئاً، فهذا مكانك.',
      },
      {
        q: 'كيف يعمل التطابق بالذكاء الاصطناعي؟',
        a: 'عند تسجيلك، يقرأ ذكاؤنا الاصطناعي ملفك — ما تقدمه وما تحتاجه ومرحلة مشروعك — ويربطك بمؤسسين يكمّلون ما تبحث عنه. العملية تلقائية وتحدث قبل كل فعالية لتصل بصلات ذات صلة من الدقيقة الأولى.',
      },
      {
        q: 'كم يكلف الانضمام إلى سينرجي؟',
        a: 'التسجيل في المجتمع مجاني. لكل تجربة (Networking Meetings وFounder House وSpotlight) سعر دخول حسب الصيغة. راجع صفحة الفعاليات للأسعار المحدّثة.',
      },
      {
        q: 'في أي مدن تعملون حالياً؟',
        a: 'نعمل في بارانكيا كمقر رئيسي، مع حضور متزايد في الكاريبي الكولومبي. إذا أردت جلب سينرجي إلى مدينتك، يمكنك التقديم من قسم «رشّح مدينتك» في الموقع.',
      },
      {
        q: 'ما الذي يميز سينرجي عن فعاليات التشبيك الأخرى؟',
        a: 'معظم التشبيك التقليدي عشوائي. في سينرجي لكل صلة نية: نستخدم الذكاء الاصطناعي لتصل وأنت تعرف مع من تتحدث ولماذا. ونحن مجتمع مستمر، لا فعالية واحدة — يبقى المؤسسون متصلين بين الدورات.',
      },
      {
        q: 'هل يمكنني أن أكون شريكاً أو راعياً لسينرجي؟',
        a: 'نعم. نعمل مع جامعات وبرامج احتضان وشركات وعلامات تريد الارتباط بمنظومة المؤسسين في الكاريبي. اكتب لنا من قسم «اقترح شراكة» وننسّق حواراً.',
      },
    ],
  },
  footer: {
    eventsTitle: 'فعاليات وتشبيك',
    contactTitle: 'تواصل',
    legalTitle: 'قانوني وثقة',
    calendar: 'تقويم الفعاليات',
    applyCity: 'رشّح مدينتك',
    ia: 'ذكاء للربط',
    questions: 'أسئلة واستفسارات',
    partnership: 'اقترح شراكة',
    privacy: 'سياسة الخصوصية',
    terms: 'الشروط والأحكام',
    cookies: 'سياسة ملفات التعريف',
    data: 'استخدام البيانات والمجتمعات',
    rights: 'جميع الحقوق محفوظة لمجتمع Synergy Founders & Makers',
  },
}

const no: Messages = {
  nav: {
    events: 'arrangementer',
    resources: 'ressurser',
    contact: 'kontakt',
    openMenu: 'Åpne meny',
    closeMenu: 'Lukk meny',
    language: 'Språk',
  },
  languages: {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    ar: 'العربية',
    no: 'Norsk',
  },
  hero: {
    title: ['Rommet', 'for å knytte', 'founders'],
    body: 'Still spørsmål, del ideer og bygg relasjoner med andre gründere — ved bordet, ikke i et foredrag. Synergy gjør nettverking strategisk, nært og resultatorientert.',
    cta: 'Gå til neste møte',
    howItWorks: 'Slik fungerer det',
    matchConfirmed: 'match bekreftet',
  },
  matching: {
    heading: ['relasjoner som ikke skjer', 'tilfeldig'],
    intro: 'KI-en vår kobler deg med de riktige founderene, på arrangementet eller etterpå.',
    cards: [
      {
        title: ['Profilen din', 'er start-', 'punktet.'],
        body: 'Du registrerer utfordringer, løsninger du tilbyr og interesser. KI-en bygger affinitetsgrafen din mot hele nettverket.',
      },
      {
        title: ['KI', 'beregner', 'kompatibilitet.'],
        body: 'Den krysser profiler i sanntid: hvem løser det du trenger, deler bransje eller er i samme by.',
      },
      {
        title: ['Vi kobler deg', 'der du', 'er.'],
        body: 'Få ukentlige anbefalinger på WhatsApp, enten du deltar eller ikke. Besøker du et sted, skjer forbindelsen ansikt til ansikt.',
      },
    ],
  },
  steps: {
    heading: ['det som skjer', 'når du kommer til synergy'],
    cta: 'Jeg vil på neste møte',
    items: [
      {
        n: '01',
        title: 'skjemaet ditt',
        body: 'Du fyller inn hva du tilbyr, hva du trenger og interessene dine. Der starter plassen din i nettverket.',
      },
      {
        n: '02',
        title: 'profilen din',
        body: 'Vi kartlegger utfordringer, løsninger og bransje for å bygge kompatibilitetskartet ditt.',
      },
      {
        n: '03',
        title: 'algoritmen',
        body: 'Vi krysser profiler og beregner hvem du passer best med — før hvert møte.',
      },
      {
        n: '04',
        title: 'vi gir beskjed',
        body: 'Du får anbefalingene dine på WhatsApp, enten du møter opp eller ikke.',
      },
      {
        n: '05',
        title: 'møtet',
        body: 'Du kommer til et intimt rom. Vi plasserer deg ved bord med founders med hensikt.',
      },
      {
        n: '06',
        title: 'forbindelsen',
        body: 'Du møter de riktige menneskene ansikt til ansikt. Uten støy, uten tilfeldige visittkort.',
      },
    ],
  },
  experiences: {
    pill: 'opplevelser',
    heading: ['porteføljen vår av ', 'opplevelser'],
    intro: 'ulike formater for ulike øyeblikk på veien som founder.',
    founders: 'founders',
    status: {
      ACTIVO: 'AKTIV',
      PRÓXIMO: 'KOMMENDE',
      COMPLETADO: 'FULLFØRT',
    },
    frequency: {
      Trimestral: 'Kvartalsvis',
      Cuatrimestre: 'Hver 4. måned',
      Semestral: 'Halvårlig',
    },
    items: [
      {
        description:
          'Intime samlinger mellom karibiske founders for å knytte kontakt, samarbeide og bygge ekte allianser.',
      },
      {
        description:
          'Kinoarrangement med ekspertpanel og pitch fra 5 startups foran investorer og founders.',
      },
      {
        description:
          'En fler dagers oppslukende opplevelse der startup-founders bor, bygger og veileder hverandre.',
      },
    ],
  },
  gallery: {
    headingBefore: 'bilder av dem som bygger',
    headingAccent: 'sammen',
    intro: 'et blikk på møter, pitcher og synergy-fellesskapet i det colombianske karibia.',
    photos: [
      { name: 'Åpen nettverking', badge: 'after office' },
      { name: 'Forbindelser live', badge: 'networking' },
      { name: 'Pitch og samtale', badge: 'pitch' },
      { name: 'Fellesskapsplenum', badge: 'plenary' },
      { name: 'Velkommen til møtet', badge: 'event' },
      { name: 'Workshop', badge: 'workshop' },
      { name: 'Founders-kveld', badge: 'community' },
      { name: 'Nye allianser', badge: 'closing' },
      { name: 'Pop-up-sted', badge: 'pop-up' },
      { name: 'Team og partnere', badge: 'backstage' },
    ],
  },
  whyAttend: {
    heading: ['hvorfor de kommer', 'til synergy'],
    intro: [
      'Synergy er for founders og makers som vil ha relasjoner med intensjon: folk som løser det du trenger, ved samme bord.',
      'Du kommer med prosjektet ditt. Vi tar match, plassering og oppfølging, så du ikke er avhengig av tilfeldigheter.',
    ],
    cta: 'Jeg vil på neste møte',
    stats: [
      { num: '4.9', label: 'gjennomsnittlig vurdering', showStar: true },
      { num: '500+', label: 'founders på arrangementer' },
      { num: '98%', label: 'ville kommet tilbake' },
    ],
    reasons: [
      {
        n: '01',
        title: 'du finner dine folk',
        body: 'En kuratert gruppe founders som kjenner reisen og vil ha ekte allianser, ikke tilfeldige visittkort.',
      },
      {
        n: '02',
        title: 'du ankommer allerede matchet',
        body: 'Før møtet krysser KI profiler: hvem løser det du trenger, deler bransje eller er i byen din.',
      },
      {
        n: '03',
        title: 'forbindelsen er ansikt til ansikt',
        body: 'Intime rom. Vi setter deg sammen med founders med hensikt — uten støy og uten tvungen pitch.',
      },
      {
        n: '04',
        title: 'nettverket slår ikke av',
        body: 'Du får WhatsApp-anbefalinger enten du deltar eller ikke. Besøker du et sted, skjer forbindelsen der.',
      },
    ],
  },
  reviews: {
    heading: ['det de sier som allerede', 'har levd opplevelsen'],
    stats: [
      { num: '4.9', label: 'gjennomsnittlig vurdering', showStar: true },
      { num: '500+', label: 'founders på arrangementer' },
      { num: '98%', label: 'ville anbefalt opplevelsen' },
    ],
    quotes: [
      'Jeg gikk derfra med tre møter booket med folk som trengte akkurat det vi tilbyr.',
      'Match før ankomst er forskjellen. Dette er ikke tilfeldig nettverking.',
      'Pitchen åpnet dører til mentorer jeg ikke ville møtt på annen måte.',
      'KI erstatter ikke kaffen — den gjør den mer effektiv.',
      'Som investor ser jeg etter klarhet og founders med ekte trekkraft, ikke bare slides.',
      'Vi søkte med byen vår og prosessen var tydelig. De ber allerede om neste dato.',
      'Jeg tok opp samtaler som hadde blitt kalde. Det er et levende nettverk, ikke en liste.',
    ],
  },
  faq: {
    heading: ['alt du ', 'vil vite.'],
    intro: 'Finner du ikke svaret her, skriv til oss direkte.',
    contact: 'kontakt oss',
    items: [
      {
        q: 'Hva er Synergy, og hvem er det for?',
        a: 'Synergy er et fellesskap av founders og makers fra det colombianske Karibia og Latin-Amerika. Vi arrangerer nettverksopplevelser, matcher profiler med KI og bygger et økosystem der gründere finner allianser, ressurser og ekte samarbeid. Hvis du bygger noe, er dette stedet ditt.',
      },
      {
        q: 'Hvordan fungerer KI-match?',
        a: 'Når du registrerer deg, leser KI-en vår profilen din — hva du tilbyr, hva du trenger og hvor prosjektet står — og kobler deg med founders som utfyller det du leter etter. Det skjer automatisk før hvert arrangement, så du kommer med relevante relasjoner fra første minutt.',
      },
      {
        q: 'Hva koster det å bli med i Synergy?',
        a: 'Å bli med i fellesskapet er gratis. Hver opplevelse (Networking Meetings, Founder House, Spotlight) har sin egen billettpris etter format. Se arrangementssiden for oppdaterte priser.',
      },
      {
        q: 'Hvilke byer er dere i nå?',
        a: 'Vi er aktive i Barranquilla som hovedbase, med økende tilstedeværelse i det colombianske Karibia. Vil du ta Synergy til byen din, kan du søke fra seksjonen «Foreslå byen din» på nettstedet.',
      },
      {
        q: 'Hva skiller Synergy fra andre nettverksarrangementer?',
        a: 'Mest tradisjonell nettverking er tilfeldig. Hos Synergy har hver relasjon intensjon: vi bruker KI slik at du kommer og vet hvem du skal snakke med og hvorfor. Vi er også et løpende fellesskap, ikke et engangsarrangement — founders holder kontakten mellom utgavene.',
      },
      {
        q: 'Kan jeg være partner eller sponsor for Synergy?',
        a: 'Ja. Vi samarbeider med universiteter, inkubasjonsprogrammer, selskaper og merkevarer som vil knytte seg til founder-økosystemet i Karibia. Skriv til oss fra «Foreslå partnerskap», så setter vi opp en samtale.',
      },
    ],
  },
  footer: {
    eventsTitle: 'Arrangementer & nettverk',
    contactTitle: 'Kontakt',
    legalTitle: 'Juridisk & tillit',
    calendar: 'Arrangementskalender',
    applyCity: 'Foreslå byen din',
    ia: 'KI for å koble',
    questions: 'Spørsmål',
    partnership: 'Foreslå partnerskap',
    privacy: 'Personvernerklæring',
    terms: 'Vilkår og betingelser',
    cookies: 'Informasjonskapsler',
    data: 'Bruk av data og fellesskap',
    rights: 'Alle rettigheter forbeholdt Synergy Founders & Makers community',
  },
}

export const messages: Record<Locale, Messages> = { es, en, pt, ar, no }

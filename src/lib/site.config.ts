// ============================================================
// BECOMEUS — CONFIGURATION VISUELLE COMPLÈTE
// Modifiez ce fichier pour changer TOUS les aspects visuels
// ============================================================

export const SITE_CONFIG = {

  // ── IDENTITÉ ────────────────────────────────────────────
  brand: {
    name: 'BecomeUs',
    namePart1: 'Become',
    namePart2: 'Us',
    tagline: 'On arrive seul. On repart en équipe.',
    subtitle: "BecomeUs transforme l'intégration RH en véritable coaching d'équipe. Chaque nouveau talent devient un pilier. Chaque manager, un coach.",
    heroTitle: 'La plateforme RH qui',
    heroTitleAccent1: 'coache',
    heroTitleAccent2: 'vos équipes',
  },

  // ── COULEURS PRINCIPALES ─────────────────────────────────
  colors: {
    primary: '#7A90B5',        // Bleu ardoise (Become)
    secondary: '#C4956A',      // Corail/pêche (Us)
    accent: '#9B85C4',         // Lavande
    background: '#FAFAFA',     // Fond principal
    text: '#1E2A3A',           // Texte principal
    textMuted: '#6B7A90',      // Texte secondaire
    cardBg: '#FFFFFF',         // Fond des cartes
    border: '#E5E9F0',         // Bordures
  },

  // ── TYPOGRAPHIE ──────────────────────────────────────────
  fonts: {
    family: 'Poppins',         // Police principale (Poppins / Inter / Montserrat / Raleway / Nunito)
    heroSize: '3.5rem',        // Taille titre hero (desktop)
    heroSizeMobile: '2rem',    // Taille titre hero (mobile)
    h2Size: '2.5rem',          // Taille titres de section
    bodySize: '1rem',          // Taille texte courant
    smallSize: '0.875rem',     // Petits textes
    taglineSize: '1rem',       // Taille de la citation
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // ── ESPACEMENT & LAYOUT ──────────────────────────────────
  spacing: {
    sectionPadding: '6rem',    // Padding vertical des sections
    containerMax: '72rem',     // Largeur max du conteneur
    cardPadding: '1.75rem',    // Padding interne des cartes
    cardRadius: '1rem',        // Arrondi des cartes
    buttonRadius: '9999px',    // Arrondi des boutons (9999 = pilule)
    gap: '1.5rem',             // Espacement entre éléments
  },

  // ── NAVIGATION ───────────────────────────────────────────
  nav: {
    links: [
      { label: 'Concept', id: 'concept' },
      { label: 'Comment ça marche', id: 'how-it-works' },
      { label: 'Témoignages', id: 'testimonials' },
      { label: 'Tarifs', id: 'pricing' },
    ],
    ctaText: 'Essayer gratuitement',
    loginText: 'Se connecter',
  },

  // ── SECTION CONCEPT ──────────────────────────────────────
  concept: {
    badge: 'Notre approche',
    title: "Le management, c'est du coaching",
    titleAccent: "c'est du coaching",
    subtitle: "Les meilleurs coachs sportifs ne font pas juste jouer leurs joueurs. Ils les intègrent, les forment et créent une dynamique d'équipe. Vous aussi.",
    cards: [
      {
        icon: '🏆',
        title: "Coaching d'intégration",
        description: "Guidez chaque nouveau talent comme un coach guide son joueur : étape par étape, avec méthode et bienveillance.",
        bgColor: '#EDF2FB',
        borderColor: '#D0DDF0',
      },
      {
        icon: '🤝',
        title: 'Collaboration renforcée',
        description: "Transformez les individus en une équipe soudée. Chaque interaction est une opportunité de créer du lien.",
        bgColor: '#FDF3EC',
        borderColor: '#F0DDD0',
      },
      {
        icon: '📊',
        title: 'Suivi de performance',
        description: "Mesurez la progression de vos talents avec des indicateurs clairs, comme un tableau de bord sportif.",
        bgColor: '#F3EFFC',
        borderColor: '#DDD0F0',
      },
    ],
  },

  // ── SECTION HOW IT WORKS ─────────────────────────────────
  howItWorks: {
    badge: '3 étapes simples',
    title: 'Comment ça marche',
    steps: [
      {
        number: '01',
        title: 'Accueillez le talent',
        description: "Créez un parcours d'intégration personnalisé dès le premier jour. Chaque nouveau collaborateur reçoit son «\u00a0kit de départ d'équipe\u00a0».",
        color: '#7A90B5',
        bg: '#EDF2FB',
      },
      {
        number: '02',
        title: 'Activez la cohésion',
        description: "Des questionnaires, des bilans et des rituels d'équipe pour tisser les liens. Le manager devient coach, l'équipe devient famille.",
        color: '#C4956A',
        bg: '#FDF3EC',
      },
      {
        number: '03',
        title: 'Mesurez & progressez',
        description: "Suivez la montée en puissance de vos équipes avec des données concrètes. Ajustez, améliorez, célébrez les victoires.",
        color: '#9B85C4',
        bg: '#F3EFFC',
      },
    ],
  },

  // ── SECTION TÉMOIGNAGES ──────────────────────────────────
  testimonials: {
    badge: 'Ils nous font confiance',
    title: 'Ce que disent nos clients',
    items: [
      {
        name: 'Sophie M.',
        role: 'DRH — Scale-up Tech',
        quote: "BecomeUs a transformé notre façon d'intégrer. En 3 mois, notre taux de rétention a augmenté de 40\u00a0%. C'est exactement l'outil qu'il nous fallait.",
        avatar: '👩‍💼',
        stars: 5,
      },
      {
        name: 'Thomas R.',
        role: "Manager d'équipe — Cabinet Conseil",
        quote: "La métaphore coaching sportif, ça parle à tout le monde. Mes équipes sont plus engagées, les nouveaux s'intègrent 2x plus vite.",
        avatar: '👨‍💻',
        stars: 5,
      },
      {
        name: 'Amira K.',
        role: 'Responsable RH — PME Industrielle',
        quote: "Simple, humain, efficace. Exactement ce dont on avait besoin pour ne plus perdre de talents dans les 6 premiers mois.",
        avatar: '👩‍🔬',
        stars: 5,
      },
    ],
  },

  // ── SECTION TARIFS ───────────────────────────────────────
  pricing: {
    badge: 'Tarifs transparents',
    title: 'Choisissez votre formule',
    subtitle: '14 jours gratuits — sans carte bancaire — annulez quand vous voulez.',
    plans: [
      {
        name: 'Starter',
        price: '29€',
        period: '/mois',
        description: 'Pour les petites équipes qui débutent',
        features: [
          "Jusqu'à 10 collaborateurs",
          "Parcours d'intégration de base",
          'Questionnaires post-intégration',
          'Tableau de bord simple',
          'Support email',
        ],
        cta: 'Commencer gratuitement',
        highlighted: false,
      },
      {
        name: 'Coach',
        price: '79€',
        period: '/mois',
        description: 'Le choix des équipes ambitieuses',
        features: [
          "Jusqu'à 50 collaborateurs",
          'Parcours personnalisés illimités',
          'Bilans post-formation',
          'Analytics avancés',
          'Exports PDF & CSV',
          'Support prioritaire',
        ],
        cta: 'Essayer 14 jours gratuits',
        highlighted: true,
        badge: '⭐ Le plus populaire',
      },
      {
        name: 'Champion',
        price: 'Sur devis',
        period: '',
        description: 'Pour les grandes organisations',
        features: [
          'Collaborateurs illimités',
          'Intégration SSO / HRIS',
          'Personnalisation avancée',
          'Tableau de bord multi-équipes',
          'Account Manager dédié',
          'SLA garanti',
        ],
        cta: 'Nous contacter',
        highlighted: false,
      },
    ],
  },

  // ── CTA FINAL ────────────────────────────────────────────
  cta: {
    title: 'Prêt à devenir',
    titleAccent: 'une équipe',
    subtitle: "Rejoignez 500+ organisations qui ont transformé leur intégration RH. Le premier match commence maintenant.",
    buttonText: "Commencer — c'est gratuit",
  },

  // ── FOOTER ───────────────────────────────────────────────
  footer: {
    copyright: '© 2026 BecomeUs — Transformez l\'intégration en coaching d\'équipe',
    links: ['Confidentialité', 'CGU', 'Contact'],
  },

  // ── STATS HERO ───────────────────────────────────────────
  stats: [
    { label: 'équipes accompagnées', value: '500+', icon: 'users' },
    { label: 'de rétention en moyenne', value: '+40%', icon: 'trending' },
    { label: 'plus vite intégré', value: '2x', icon: 'zap' },
  ],
};

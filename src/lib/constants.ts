export const ROUTE_PATHS = {
  HOME: '/',
} as const;

export const NAV_LINKS = [
  { label: 'Concept', id: 'concept' },
  { label: 'Comment ça marche', id: 'how-it-works' },
  { label: 'Témoignages', id: 'testimonials' },
  { label: 'Tarifs', id: 'pricing' },
];

export const FEATURES = [
  {
    icon: '🏆',
    title: 'Coaching d\'intégration',
    description: 'Guidez chaque nouveau talent comme un coach guide son joueur : étape par étape, avec méthode et bienveillance.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-[#E8EFF8]',
  },
  {
    icon: '🤝',
    title: 'Collaboration renforcée',
    description: 'Transformez les individus en une équipe soudée. Chaque interaction est une opportunité de créer du lien.',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-[#FDEEE6]',
  },
  {
    icon: '📊',
    title: 'Suivi de performance',
    description: 'Mesurez la progression de vos talents avec des indicateurs clairs, comme un tableau de bord sportif.',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-[#F0ECF8]',
  },
];

export const STEPS = [
  {
    number: '01',
    title: 'Accueillez le talent',
    description: 'Créez un parcours d\'intégration personnalisé dès le premier jour. Chaque nouveau collaborateur reçoit son "kit de départ d\'équipe".',
    color: 'text-[#7A90B5]',
    bg: 'bg-[#E8EFF8]',
  },
  {
    number: '02',
    title: 'Activez la cohésion',
    description: 'Des questionnaires, des bilans et des rituels d\'équipe pour tisser les liens. Le manager devient coach, l\'équipe devient famille.',
    color: 'text-[#C4956A]',
    bg: 'bg-[#FDEEE6]',
  },
  {
    number: '03',
    title: 'Mesurez & progressez',
    description: 'Suivez la montée en puissance de vos équipes avec des données concrètes. Ajustez, améliorez, célébrez les victoires.',
    color: 'text-[#9B85C4]',
    bg: 'bg-[#F0ECF8]',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    role: 'DRH — Scale-up Tech',
    quote: 'BecomeUs a transformé notre façon d\'intégrer. En 3 mois, notre taux de rétention a augmenté de 40%. C\'est exactement l\'outil qu\'il nous fallait.',
    avatar: '👩‍💼',
    stars: 5,
  },
  {
    name: 'Thomas R.',
    role: 'Manager d\'équipe — Cabinet Conseil',
    quote: 'La métaphore coaching sportif, ça parle à tout le monde. Mes équipes sont plus engagées, les nouveaux s\'intègrent 2x plus vite.',
    avatar: '👨‍💻',
    stars: 5,
  },
  {
    name: 'Amira K.',
    role: 'Responsable RH — PME Industrielle',
    quote: 'Simple, humain, efficace. Exactement ce dont on avait besoin pour ne plus perdre de talents dans les 6 premiers mois.',
    avatar: '👩‍🔬',
    stars: 5,
  },
];

export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '29€',
    period: '/mois',
    description: 'Pour les petites équipes qui débutent',
    features: [
      'Jusqu\'à 10 collaborateurs',
      'Parcours d\'intégration de base',
      'Questionnaires post-intégration',
      'Tableau de bord simple',
      'Support email',
    ],
    cta: 'Commencer gratuitement',
    highlighted: false,
    color: 'border-border',
  },
  {
    name: 'Coach',
    price: '79€',
    period: '/mois',
    description: 'Le choix des équipes ambitieuses',
    features: [
      'Jusqu\'à 50 collaborateurs',
      'Parcours personnalisés illimités',
      'Bilans post-formation',
      'Analytics avancés',
      'Exports PDF & CSV',
      'Support prioritaire',
    ],
    cta: 'Essayer 14 jours gratuits',
    highlighted: true,
    color: 'border-primary',
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
    color: 'border-border',
  },
];

/**
 * Typed per-locale map of all UI micro-labels — strings that are not part
 * of the portfolio content narrative but are needed to render the site's
 * navigation, buttons, and accessible controls.
 *
 * No JSX, no component imports, no presentation logic — declarations only.
 * The `Record<'fr' | 'en', UiLabels>` typing enforces that both locales
 * provide every key; a missing key in either locale is a compile-time error.
 */

export type UiLabels = {
  // Navigation labels (8 keys — one per section)
  navHero: string
  navAbout: string
  navSkills: string
  navExperience: string
  navProjects: string
  navEducation: string
  navLanguages: string
  navContact: string

  // Button labels
  viewProjects: string
  downloadCv: string
  contact: string

  // Aria-labels for the chrome toggles
  languageSwitcher: string
  themeToggle: string

  // Footer
  builtWith: string

  // ── Atelier shell labels (story 01-03) ──
  // Per-route nav (new routes; navExperience/navSkills/navContact reused above)
  navHome: string
  navWork: string
  navProcess: string

  // Command-palette group headers
  cmdkNavigation: string
  cmdkQuick: string
  cmdkProjects: string

  // Command-palette quick-action item labels (contact actions)
  cmdkActionEmail: string
  cmdkActionWhatsapp: string

  // Command-palette per-item descriptions (right-aligned `.meta`)
  cmdkDescHome: string
  cmdkDescWork: string
  cmdkDescExperience: string
  cmdkDescSkills: string
  cmdkDescProcess: string
  cmdkDescContact: string
  cmdkDescEmail: string
  cmdkDescWhatsapp: string
  cmdkDescTheme: string
  cmdkDescLanguage: string
  cmdkDescDownloadCv: string

  // Copy-to-clipboard feedback
  copy: string
  copied: string

  // Project actions
  readCase: string
  visitLive: string

  // Project detail modal section labels + close controls
  modalRole: string
  modalImpact: string
  modalStack: string
  modalClose: string
  modalCloseAria: string

  // Work view editorial header (reference "Atelier Terminal" copy).
  // The title renders as `{lead}<span class="mark">{mark}</span>{tail}`.
  workTitleLead: string
  workTitleMark: string
  workTitleTail: string
  // The sub renders as `{subLead}<strong>{subStrong1}</strong>{subMid}
  // <strong>{subStrong2}</strong>{subTail}`.
  workSubLead: string
  workSubStrong1: string
  workSubMid: string
  workSubStrong2: string
  workSubTail: string

  // View eyebrows
  eyebrowWork: string
  eyebrowExperience: string
  eyebrowSkills: string
  eyebrowProcess: string
  eyebrowContact: string

  // ── Experience / Skills / Process / Contact editorial headers (04-03) ──
  // Each `.section-title` renders as `{lead}<span class="mark">{mark}</span>{tail}`
  // and each `.section-sub` renders the corresponding `*Sub` string. Sub strings
  // that carry `<strong>` emphasis in the reference are split into segments.
  experienceTitleLead: string
  experienceTitleMark: string
  experienceTitleTail: string
  experienceSub: string
  /** Muted prefix before each timeline company (reference: "at"). */
  experienceAt: string

  skillsTitleLead: string
  skillsTitleMark: string
  skillsTitleTail: string
  skillsSubLead: string
  skillsSubStrong: string
  skillsSubTail: string
  /** Noun in the per-card "{n} tools" count (reference: "tools"). */
  skillsToolsLabel: string

  processTitleLead: string
  processTitleMark: string
  processTitleTail: string
  processSubLead: string
  processSubStrong1: string
  processSubMid: string
  processSubStrong2: string
  processSubTail: string

  contactTitleLead: string
  contactTitleMark: string
  contactTitleTail: string
  contactSubLead: string
  contactSubStrong: string
  contactSubTail: string

  // Sidebar footer status — two-column key/value rows.
  // Keys (left column):
  sbStatusKey: string
  sbRegionKey: string
  sbPairedKey: string
  // Values (right column):
  footerStatus: string
  footerRegion: string
  footerPaired: string
  footerPairedValue: string
}

export const ui: Record<'fr' | 'en', UiLabels> = {
  fr: {
    // Navigation
    navHero: 'Accueil',
    navAbout: 'À propos',
    navSkills: 'Compétences',
    navExperience: 'Expérience',
    navProjects: 'Projets',
    navEducation: 'Éducation',
    navLanguages: 'Langues',
    navContact: 'Contact',

    // Buttons
    viewProjects: 'Voir les projets',
    downloadCv: 'Télécharger le CV',
    contact: 'Me contacter',

    // Aria-labels
    languageSwitcher: 'Changer de langue',
    themeToggle: 'Basculer le thème clair/sombre',

    // Footer
    builtWith: 'Créé avec React & Vite',

    // ── Atelier shell ──
    navHome: 'Accueil',
    navWork: 'Projets sélectionnés',
    navProcess: 'Ma méthode',

    cmdkNavigation: 'Navigation',
    cmdkQuick: 'Actions rapides',
    cmdkProjects: 'Projets',

    cmdkActionEmail: 'Copier l’e-mail',
    cmdkActionWhatsapp: 'Ouvrir WhatsApp',

    cmdkDescHome: 'Retour au début',
    cmdkDescWork: 'Galerie de projets (8 cas)',
    cmdkDescExperience: 'Parcours depuis 2018',
    cmdkDescSkills: 'Référence de la stack',
    cmdkDescProcess: 'Mes principes de travail',
    cmdkDescContact: 'E-mail · WhatsApp · localisation',
    cmdkDescEmail: 'Copier l’e-mail dans le presse-papiers',
    cmdkDescWhatsapp: 'Ouvrir une discussion WhatsApp',
    cmdkDescTheme: 'Changer de thème (ember → ocean → forest → paper)',
    cmdkDescLanguage: 'Basculer la langue (fr ↔ en)',
    cmdkDescDownloadCv: 'Télécharger le CV (PDF)',

    copy: 'Copier',
    copied: 'Copié',

    readCase: 'Lire le cas',
    visitLive: 'Voir en ligne',

    modalRole: 'Mon rôle',
    modalImpact: 'Impact',
    modalStack: 'Stack',
    modalClose: 'Fermer',
    modalCloseAria: 'Fermer la fenêtre',

    workTitleLead: 'Ce que j’ai livré — ',
    workTitleMark: 'pas des pixels',
    workTitleTail: ' sur un moodboard.',
    workSubLead: 'Neuf projets des cinq dernières années, à travers la ',
    workSubStrong1: 'fintech, le gaming, la civic tech',
    workSubMid: ' et les ',
    workSubStrong2: 'pipelines IA',
    workSubTail:
      '. Certains menés de bout en bout, d’autres en pilotant des équipes. Cliquez sur une carte pour ouvrir le cas.',

    eyebrowWork: '01 · Projets sélectionnés',
    eyebrowExperience: '02 · Expérience',
    eyebrowSkills: '03 · Boîte à outils',
    eyebrowProcess: '04 · Ma méthode',
    eyebrowContact: '05 · Discutons',

    experienceTitleLead: 'Sept ans, ',
    experienceTitleMark: 'sept entreprises',
    experienceTitleTail: ', un seul métier.',
    experienceSub:
      "D'un premier poste chez Ingenosya en 2018 au pilotage de l'écosystème SOKA aujourd'hui. La lignée de chaque framework sur lequel je m'appuie, et chaque leçon difficile que je garde.",
    experienceAt: 'chez',

    skillsTitleLead: 'Une stack choisie pour la ',
    skillsTitleMark: 'longévité',
    skillsTitleTail: ', pas pour la hype.',
    skillsSubLead:
      'Les frameworks que je dégaine en premier, regroupés selon leur place dans la stack. ',
    skillsSubStrong: "Tout ce qui figure ici, je l'ai livré en production.",
    skillsSubTail:
      ' Les éléments dans les pilules arrondies sont les outils du quotidien.',
    skillsToolsLabel: 'outils',

    processTitleLead: "Cinq règles que j'ai gagnées, ",
    processTitleMark: 'un projet à la fois.',
    processTitleTail: '',
    processSubLead: 'Je ne suis pas seulement développeur. Je pense aux ',
    processSubStrong1: 'systèmes',
    processSubMid: ', aux ',
    processSubStrong2: 'interfaces',
    processSubTail:
      ", à l'équipe à côté de moi et au client à l'autre bout. Ces principes résument ma façon de travailler — et celle dont j'aimerais travailler avec vous.",

    contactTitleLead: 'Un projet à construire ? ',
    contactTitleMark: 'Je vous écoute.',
    contactTitleTail: '',
    contactSubLead: 'Disponible en ',
    contactSubStrong: 'freelance ou plein temps, à distance',
    contactSubTail:
      ', à partir du T3 2026. Je réponds sous 24 heures, souvent plus vite.',

    sbStatusKey: 'statut',
    sbRegionKey: 'région',
    sbPairedKey: 'en binôme avec',
    footerStatus: 'disponible',
    footerRegion: 'tnr · utc+3',
    footerPaired: 'en binôme avec claude-code',
    footerPairedValue: 'claude-code',
  },

  en: {
    // Navigation
    navHero: 'Home',
    navAbout: 'About',
    navSkills: 'Skills',
    navExperience: 'Experience',
    navProjects: 'Projects',
    navEducation: 'Education',
    navLanguages: 'Languages',
    navContact: 'Contact',

    // Buttons
    viewProjects: 'View projects',
    downloadCv: 'Download CV',
    contact: 'Get in touch',

    // Aria-labels
    languageSwitcher: 'Switch language',
    themeToggle: 'Toggle light/dark theme',

    // Footer
    builtWith: 'Built with React & Vite',

    // ── Atelier shell ──
    navHome: 'Home',
    navWork: 'Selected work',
    navProcess: 'How I work',

    cmdkNavigation: 'Navigation',
    cmdkQuick: 'Quick actions',
    cmdkProjects: 'Projects',

    cmdkActionEmail: 'Copy email',
    cmdkActionWhatsapp: 'Open WhatsApp',

    cmdkDescHome: 'Back to start',
    cmdkDescWork: 'Project gallery (8 cases)',
    cmdkDescExperience: 'Career timeline since 2018',
    cmdkDescSkills: 'Stack reference',
    cmdkDescProcess: 'Principles I work by',
    cmdkDescContact: 'Email · WhatsApp · location',
    cmdkDescEmail: 'Copy email to clipboard',
    cmdkDescWhatsapp: 'Open WhatsApp chat',
    cmdkDescTheme: 'Cycle theme (ember → ocean → forest → paper)',
    cmdkDescLanguage: 'Toggle language (fr ↔ en)',
    cmdkDescDownloadCv: 'Download CV (PDF)',

    copy: 'Copy',
    copied: 'Copied',

    readCase: 'Read case',
    visitLive: 'Visit live',

    modalRole: 'My role',
    modalImpact: 'Impact',
    modalStack: 'Stack',
    modalClose: 'Close',
    modalCloseAria: 'Close dialog',

    workTitleLead: 'Things I shipped — ',
    workTitleMark: 'not pixels',
    workTitleTail: ' on a moodboard.',
    workSubLead: 'Nine projects from the last five years across ',
    workSubStrong1: 'fintech, gaming, civic tech',
    workSubMid: ' and ',
    workSubStrong2: 'AI pipelines',
    workSubTail:
      '. Some I owned end-to-end, some I led teams through. Click any card to open the case.',

    eyebrowWork: '01 · Selected work',
    eyebrowExperience: '02 · Experience',
    eyebrowSkills: '03 · Toolbox',
    eyebrowProcess: '04 · How I work',
    eyebrowContact: "05 · Let's talk",

    experienceTitleLead: 'Seven years, ',
    experienceTitleMark: 'seven companies',
    experienceTitleTail: ', one craft.',
    experienceSub:
      'From a first job at Ingenosya in 2018 to leading the SOKA ecosystem today. The lineage of every framework I lean on, and every hard lesson I keep.',
    experienceAt: 'at',

    skillsTitleLead: 'A stack chosen for ',
    skillsTitleMark: 'longevity',
    skillsTitleTail: ', not hype.',
    skillsSubLead:
      'The frameworks I reach for first, grouped by where they sit in the stack. ',
    skillsSubStrong: "Everything here is something I've shipped to production.",
    skillsSubTail: ' Highlights in the rounded pills are the daily drivers.',
    skillsToolsLabel: 'tools',

    processTitleLead: "Five rules I've earned, ",
    processTitleMark: 'one project at a time.',
    processTitleTail: '',
    processSubLead: "I'm not just a developer. I think about ",
    processSubStrong1: 'systems',
    processSubMid: ', about ',
    processSubStrong2: 'interfaces',
    processSubTail:
      ', about the team next to me and the customer at the other end. These principles are the shorthand for how I work — and how I’d like to work with you.',

    contactTitleLead: 'Have a thing to build? ',
    contactTitleMark: "I'm listening.",
    contactTitleTail: '',
    contactSubLead: 'Available for ',
    contactSubStrong: 'contract or full-time, remote',
    contactSubTail: ', from Q3 2026. I reply within 24 hours, usually sooner.',

    sbStatusKey: 'status',
    sbRegionKey: 'region',
    sbPairedKey: 'paired with',
    footerStatus: 'available',
    footerRegion: 'tnr · utc+3',
    footerPaired: 'paired with claude-code',
    footerPairedValue: 'claude-code',
  },
}

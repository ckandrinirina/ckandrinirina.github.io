// Module de contenu en français — locale par défaut.
//
// Ce fichier est l'unique source de vérité pour tout le contenu du portfolio
// en français. Il satisfait l'interface `PortfolioContent` via l'opérateur
// `satisfies` : tout champ manquant ou superflu est une erreur TypeScript.
//
// Règles :
// - Texte brut UTF-8 uniquement (pas de HTML, pas de JSX, pas de Markdown).
// - Noms de technologies et noms propres restent en anglais/non traduits.
// - Localisation de contact : ville et pays uniquement, jamais l'adresse complète.

import type { PortfolioContent } from './types'

export default {
  // ─── HERO ────────────────────────────────────────────────────────────────────

  hero: {
    name: 'Erick Andrinirina',
    title: 'Développeur Fullstack JavaScript',
    positioning:
      "Plus de 7 ans d'expérience en applications web — banque en ligne, intranet d'entreprise, plateformes de jeux et de paiement. Près de cinq ans comme lead dev.",
    location: 'Antananarivo, Madagascar',
    ctaViewProjects: 'Voir les projets',
    ctaDownloadCv: 'Télécharger le CV',
    ctaContact: 'Me contacter',
    greet: 'Bonjour, je suis',
    tagline:
      'Je conçois des produits web performants et évolutifs, de bout en bout.',
    roles: [
      'Ingénieur Fullstack',
      'Spécialiste React & Node',
      'Bâtisseur Web3',
      'Résolveur de problèmes',
    ],
  },

  // ─── ABOUT ───────────────────────────────────────────────────────────────────

  about: {
    narrative:
      "Développeur Fullstack expérimenté avec 7 ans d'expertise dans la conception d'applications web haute performance. À l'aise dans les écosystèmes JavaScript et PHP — React et Angular côté front-end, Node.js, Symfony et Laravel côté back-end — avec une solide maîtrise des bases de données MongoDB, PostgreSQL et MySQL. Motivé par les défis techniques et toujours à la recherche de nouvelles opportunités pour contribuer au succès d'un projet.",
  },

  // ─── SKILLS ──────────────────────────────────────────────────────────────────

  skills: [
    {
      label: 'Langages',
      items: [
        'TypeScript',
        'JavaScript',
        'PHP',
        'Python',
        'Java',
        'C/C++/.NET',
        'HTML5',
        'CSS/SCSS',
        'SQL',
      ],
    },
    {
      label: 'Frameworks & bibliothèques Front-end',
      items: [
        'React',
        'Angular',
        'Vue.js',
        'Redux',
        'Recoil',
        'React Native',
        'Angular Material',
        'PrimeReact',
        'Bootstrap',
        'Tailwind CSS',
        'Formik',
        'Zod',
      ],
    },
    {
      label: 'Frameworks Back-end',
      items: [
        'Node.js',
        'NestJS',
        'Symfony',
        'Laravel',
        'CodeIgniter',
        'API Platform',
      ],
    },
    {
      label: 'Bases de données',
      items: [
        'PostgreSQL',
        'MySQL',
        'MariaDB',
        'MongoDB',
        'SQLite',
        'Firebase',
      ],
    },
    {
      label: 'Outils & DevOps',
      items: [
        'Git',
        'Docker',
        'Vercel',
        'Google Cloud Run',
        'Azure',
        'NPM',
        'Composer',
      ],
    },
    {
      label: 'Tests',
      items: ['Jest', 'Jasmine', 'Karma'],
    },
    {
      label: 'IA & Spécialisé',
      items: ['OpenAI', 'Tesseract / Node-Tesseract OCR', 'Blockchain'],
    },
    {
      label: 'Gestion de projet & design',
      items: ['Jira', 'Trello', 'Figma / Adobe XD'],
    },
  ],

  // ─── EXPERIENCE ──────────────────────────────────────────────────────────────
  // Ordre : du plus récent au plus ancien.

  experience: [
    // 1 — SOKA / YAS Madagascar
    {
      company: 'SOKA / YAS Madagascar',
      role: 'Développeur Full Stack',
      period: 'Janv. 2025 – présent',
      techHighlights: [
        'Next.js',
        'NestJS',
        'Prisma',
        'Redux Toolkit',
        'React Admin',
        'Tailwind CSS',
        'PostgreSQL',
        'Web3/blockchain',
        'Messagerie temps réel',
        'Google Cloud',
      ],
      projects: [
        {
          name: 'SOKA CLUB',
          description:
            "Plateforme digitale multifonctionnelle combinant billetterie d'événements, boutique en ligne et mini-jeux interactifs, avec paiements en USDC et un système de points SOKA.",
        },
        {
          name: 'SOKA LIVE',
          description:
            'Plateforme de pronostics footballistiques avec classements et récompenses pour les meilleurs pronostiqueurs.',
        },
        {
          name: 'LUDOKA',
          description:
            "Jeux de Ludo compétitifs intégrés à l'écosystème SOKA, avec classements et gains pour les joueurs.",
        },
      ],
    },

    // 2 — BMOI Madagascar
    {
      company: 'BMOI Madagascar',
      role: 'Développeur Full Stack',
      period: 'Juill. 2024 – Janv. 2025',
      techHighlights: [
        'React',
        'Node.js',
        'TypeScript',
        "Vérification vidéo d'identité",
        'Gestion sécurisée de documents',
        'KYC',
      ],
      projects: [
        {
          name: 'EER Full Digital',
          description:
            "Service en ligne de création de compte bancaire avec vérification d'identité par vidéo et gestion sécurisée des documents pour le processus KYC.",
        },
      ],
    },

    // 3 — SHOYO
    {
      company: 'SHOYO',
      role: 'Développeur Full Stack / Lead Developer',
      period: 'Janv. 2021 – Juill. 2024',
      techHighlights: [
        'React',
        'Angular',
        'Node.js',
        'NestJS',
        'TypeScript',
        'PostgreSQL',
        'MongoDB',
        'OpenAI GPT-4',
        'OCR / Tesseract',
        'Migration PHP vers JavaScript',
      ],
      projects: [
        {
          name: 'SHOYO',
          description:
            "Plateforme de dossier numérique simplifiant les procédures financières, incluant une migration majeure d'un framework PHP vers une stack JavaScript moderne.",
        },
        {
          name: 'THESEIS',
          description:
            "Solution de gestion numérique de documents permettant la classification, le stockage et la recherche de documents d'entreprise.",
        },
        {
          name: 'Happy Capital / My Capital Immo',
          description:
            'Plateforme de financement participatif immobilier avec suivi en temps réel des investissements et tableaux de bord investisseurs.',
        },
        {
          name: "OCR – Extraction d'informations",
          description:
            "Solution exploitant l'OCR et GPT-4 pour convertir des images et PDF (cartes d'identité, coordonnées bancaires, passeports) en données structurées.",
        },
      ],
    },

    // 4 — VTC Academy
    {
      company: 'VTC Academy',
      role: 'Développeur Full Stack',
      period: 'Juin 2020 – Déc. 2020',
      techHighlights: [
        'React',
        'Node.js',
        'MySQL',
        'QCM interactifs',
        'Tableau de bord administrateur',
      ],
      projects: [
        {
          name: 'Plateforme VTC Academy',
          description:
            'Site de formation pour chauffeurs VTC avec quiz à choix multiples et tableau de bord administrateur pour le suivi de la progression des étudiants.',
        },
      ],
    },

    // 5 — PANAFRI HELP
    {
      company: 'PANAFRI HELP',
      role: 'Développeur Full Stack',
      period: 'Janv. 2020 – Juin 2020',
      techHighlights: [
        'React',
        'Node.js',
        'PostgreSQL',
        'Conception de plateforme de bout en bout',
      ],
      projects: [
        {
          name: 'Plateforme PANAFRI HELP',
          description:
            "Plateforme de financement de projets développée de A à Z, de la conception à la mise en production, pour faciliter l'accès au financement en Afrique.",
        },
      ],
    },

    // 6 — CREACTISOFT
    {
      company: 'CREACTISOFT',
      role: 'Développeur Full Stack / Lead Developer',
      period: 'Sept. 2019 – Déc. 2020',
      techHighlights: [
        'Angular',
        'Symfony',
        'Laravel',
        'MySQL',
        'ERP sur mesure',
        'Automatisation',
      ],
      projects: [
        {
          name: 'IPSUM',
          description:
            'ERP commercial complet pour la gestion des ventes, des stocks et de la facturation.',
        },
        {
          name: 'SOLIUS',
          description:
            'ERP dédié au secteur de la construction pour la gestion des chantiers, des ressources et des devis.',
        },
        {
          name: 'MOZART',
          description:
            'ERP de gestion de la relation client (CRM) pour le suivi des interactions, des réclamations et du service après-vente.',
        },
        {
          name: 'ELISE',
          description:
            "Système automatisé de questionnaire après-vente permettant de collecter les retours clients et d'améliorer la qualité de service.",
        },
      ],
    },

    // 7 — INGENOSYA
    {
      company: 'INGENOSYA',
      role: 'Développeur Full Stack',
      period: 'Oct. 2018 – Sept. 2019',
      techHighlights: [
        'Angular',
        'Symfony',
        'Laravel',
        'MySQL',
        'React Native',
        'Applications multiplateformes',
      ],
      projects: [
        {
          name: 'BNI Madagascar',
          description:
            'Plateforme en ligne de demande de crédit bancaire permettant aux clients de simuler et soumettre leur dossier de prêt directement depuis leur navigateur.',
        },
        {
          name: 'FMFP',
          description:
            'Portail de financement inter-entreprises facilitant les échanges et les demandes de financement entre sociétés partenaires.',
        },
        {
          name: 'FORET MAD',
          description:
            "Application multiplateforme de classification de documents pour le Ministère des Forêts, permettant d'organiser et d'indexer les données forestières.",
        },
      ],
    },
  ],

  // ─── PROJECTS (curated showcase) ─────────────────────────────────────────────

  projects: [
    {
      name: 'SOKA Club',
      company: 'SOKA / YAS Madagascar',
      description:
        'Plateforme digitale multifonctionnelle combinant billetterie, boutique en ligne et mini-jeux, avec paiements en USDC et système de fidélité SOKA.',
      techTags: [
        'Next.js',
        'NestJS',
        'Prisma',
        'PostgreSQL',
        'Web3',
        'Tailwind CSS',
      ],
    },
    {
      name: 'SOKA Live',
      company: 'SOKA / YAS Madagascar',
      description:
        'Plateforme de pronostics footballistiques en temps réel avec classements dynamiques et système de récompenses.',
      techTags: [
        'Next.js',
        'NestJS',
        'Redux Toolkit',
        'PostgreSQL',
        'WebSocket',
      ],
    },
    {
      name: 'LUDOKA',
      company: 'SOKA / YAS Madagascar',
      description:
        "Jeux de Ludo compétitifs en ligne intégrés à l'écosystème SOKA avec gestion des parties en temps réel.",
      techTags: [
        'Next.js',
        'NestJS',
        'Prisma',
        'PostgreSQL',
        'Messagerie temps réel',
      ],
    },
    {
      name: 'EER Full Digital',
      company: 'BMOI Madagascar',
      description:
        "Service bancaire en ligne d'ouverture de compte avec vérification d'identité par vidéo et gestion sécurisée des documents KYC.",
      techTags: ['React', 'Node.js', 'TypeScript', 'KYC', 'Vérification vidéo'],
    },
    {
      name: 'SHOYO',
      company: 'SHOYO',
      description:
        'Plateforme de dossier numérique pour la gestion des procédures financières, incluant une migration de PHP vers JavaScript.',
      techTags: [
        'React',
        'NestJS',
        'TypeScript',
        'PostgreSQL',
        'Migration PHP',
      ],
    },
    {
      name: 'THESEIS',
      company: 'SHOYO',
      description:
        'Solution de gestion de documents numériques pour la classification, le stockage et la recherche documentaire en entreprise.',
      techTags: ['Angular', 'Node.js', 'MongoDB', 'TypeScript'],
    },
    {
      name: 'Happy Capital / My Capital Immo',
      company: 'SHOYO',
      description:
        'Plateforme de crowdfunding immobilier avec suivi en temps réel des investissements et tableaux de bord investisseurs interactifs.',
      techTags: ['React', 'NestJS', 'PostgreSQL', 'WebSocket', 'TypeScript'],
    },
    {
      name: 'OCR / GPT-4',
      company: 'SHOYO',
      description:
        "Extraction automatique de données depuis des images et PDF (identités, IBAN, passeports) grâce à l'OCR et GPT-4.",
      techTags: [
        'Node.js',
        'OpenAI GPT-4',
        'Tesseract OCR',
        'TypeScript',
        'PDF',
      ],
    },
    {
      name: 'VTC Academy',
      company: 'VTC Academy',
      description:
        'Plateforme de formation pour chauffeurs VTC avec quiz interactifs et tableau de bord de suivi pédagogique.',
      techTags: ['React', 'Node.js', 'MySQL', 'QCM'],
    },
    {
      name: 'PANAFRI HELP',
      company: 'PANAFRI HELP',
      description:
        "Plateforme de financement de projets construite de bout en bout, de la conception à la production, pour l'Afrique.",
      techTags: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      name: 'IPSUM – ERP Commercial',
      company: 'CREACTISOFT',
      description:
        'ERP sur mesure pour la gestion commerciale : ventes, stocks, devis et facturation.',
      techTags: ['Angular', 'Symfony', 'MySQL', 'ERP'],
    },
    {
      name: 'BNI Madagascar',
      company: 'INGENOSYA',
      description:
        'Plateforme en ligne de demande de crédit bancaire pour BNI Madagascar, avec simulation et soumission de dossier en ligne.',
      techTags: ['Angular', 'Laravel', 'MySQL'],
    },
  ],

  // ─── EDUCATION ───────────────────────────────────────────────────────────────
  // Ordre : du plus récent au plus ancien.

  education: [
    {
      qualification: 'Formation en développement web avancé',
      institution: 'NEITIC',
      year: 'Juin 2019',
    },
    {
      qualification:
        'Ingénieur Master en Électronique, option Informatique Appliquée',
      institution: "École Supérieure Polytechnique d'Antananarivo",
      year: 'Juin 2018',
    },
    {
      // Institution inconnue — valeur vide conforme à la définition du type.
      qualification: 'Baccalauréat Scientifique',
      institution: '',
      year: 'Juin 2013',
    },
  ],

  // ─── SPOKEN LANGUAGES ────────────────────────────────────────────────────────

  spokenLanguages: [
    {
      language: 'Malgache',
      proficiency: 'Langue maternelle',
    },
    {
      language: 'Français',
      proficiency: 'Courant',
    },
    {
      language: 'Anglais',
      proficiency: 'Intermédiaire',
    },
  ],

  // ─── CONTACT ─────────────────────────────────────────────────────────────────

  contact: {
    location: 'Antananarivo, Madagascar',
    intro:
      "Disponible pour de nouvelles opportunités. N'hésitez pas à me contacter pour discuter de votre projet.",
    pitch: {
      heading: 'Ce que je cherche pour la suite.',
      paragraphs: [
        "Une équipe qui livre, un produit qui me tient à cœur, et un problème assez riche pour entretenir ma curiosité. Je suis ouvert à la fintech, au gaming, à l'IA — partout où je peux écrire du code qui mérite sa place.",
        "Si cela vous ressemble, écrivez-moi. Dites-moi ce que vous construisez et comment je pourrais m'y intégrer.",
      ],
      signature: '— Erick',
    },
    languages: ['Malgache', 'Français', 'English'],
    meta: [
      {
        label: 'Email',
        value: 'ckandrinirina@gmail.com',
        href: 'mailto:ckandrinirina@gmail.com',
        copy: true,
      },
      {
        label: 'WhatsApp',
        value: '+261 38 50 966 64',
        href: 'https://wa.me/261385096664',
        copy: true,
        copyValue: '+261385096664',
      },
      {
        label: 'Basé à',
        value: 'Antananarivo, Madagascar',
        muted: '· UTC+3',
      },
      {
        label: 'Disponibilité',
        value: 'ouvert · à distance, freelance ou plein temps',
        dot: 'success',
      },
    ],
  },

  // ─── NOW ───────────────────────────────────────────────────────────────────

  now: {
    headline: "Je construis l'écosystème SOKA",
    body: "Développement fullstack de l'écosystème SOKA — billetterie, boutique, pronostics football et jeux en temps réel, avec paiements USDC et MVola.",
    meta: {
      label: 'En ce moment',
      period: 'Jan 2025 — présent',
    },
  },

  // ─── STATS ───────────────────────────────────────────────────────────────────

  stats: [
    { n: 7, suffix: '+', label: "Années d'expérience" },
    { n: 20, suffix: '+', label: 'Projets livrés' },
    { n: 9, label: 'Projets phares' },
    { n: 7, label: 'Entreprises' },
  ],

  // ─── MARQUEE ─────────────────────────────────────────────────────────────────

  marquee: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'Prisma',
    'Tailwind CSS',
    'Web3',
    'OpenAI',
    'Docker',
    'Google Cloud',
  ],

  // ─── TIMELINE (nouvelle forme de l'expérience) ───────────────────────────────

  timeline: [
    {
      year: '2025 — Présent',
      role: 'Développeur Fullstack',
      company: 'SOKA · YAS Madagascar',
      desc: "Construction de l'écosystème SOKA — Club, Live, Ludoka. Billetterie événementielle, boutique en ligne, pronostics football et Ludo compétitif, reliés par les points SOKA, les paiements USDC et mobile money (MVola) et une infrastructure temps réel.",
      stack: [
        'Next.js 14',
        'NestJS',
        'Prisma',
        'Ably',
        'MVola',
        'Web3Auth',
        'GCP Cloud Run',
      ],
    },
    {
      year: '2024 — 2025',
      role: 'Développeur Fullstack',
      company: 'BMOI Madagascar',
      desc: "Construction de l'intranet de la banque (Groupe BCP) — un monorepo NestJS / React de 14 modules métier en DDD / CQRS, connexion Azure AD, déployé avec Podman sur Red Hat. Livraison d'EER Full Digital — ouverture de compte en ligne avec KYC par appel vidéo et une UX qui ne ressemble pas à un portail bancaire de 2008.",
      stack: [
        'NestJS',
        'React 19',
        'Drizzle ORM',
        'PostgreSQL',
        'Redis',
        'Laravel 10',
        'Podman',
      ],
    },
    {
      year: '2021 — 2024',
      role: 'Lead Developer',
      company: 'SHOYO',
      desc: 'Trois ans et demi à piloter la plateforme de dossiers numériques. Direction de la migration Symfony → Angular + Node. Livraison de THESEIS, Happy Capital / My Capital Immo et un pipeline OCR propulsé par Tesseract + GPT-4.',
      stack: ['Angular 16', 'Symfony 4', 'Node.js', 'Vue.js', 'MongoDB', 'OpenAI'],
    },
    {
      year: '2020',
      role: 'Développeur Fullstack',
      company: 'VTC Academy',
      desc: 'Plateforme de formation pour chauffeurs de taxi — cours, évaluations QCM, tableau de bord backoffice pour suivre la progression des élèves.',
      stack: ['Angular', 'Angular Material', 'Symfony', 'API Platform'],
    },
    {
      year: '2020',
      role: 'Développeur Fullstack',
      company: 'PANAFRI Help',
      desc: "Construction en solo d'une plateforme de financement de projets de bout en bout. Concept → production. Soumissions de prêts, financement de projets, une UX qui inspire confiance sur un sujet sensible.",
      stack: ['React', 'Symfony', 'PrimeReact', 'Formik'],
    },
    {
      year: '2019 — 2020',
      role: 'Lead Developer',
      company: 'Creactisoft',
      desc: "Lead sur un portefeuille d'ERP — IPSUM pour la vente, SOLIUS pour le bâtiment, MOZART pour le service client — et ELISE, un questionnaire automatisé de diagnostic pour le service après-vente.",
      stack: ['Angular', 'React', 'Symfony', 'Laravel', 'MongoDB'],
    },
    {
      year: '2018 — 2019',
      role: 'Développeur Fullstack',
      company: 'Ingenosya',
      desc: "Première mission à la sortie de l'école d'ingénieurs. Portail bancaire pour BNI Madagascar, financement de projets FMFP, classifieur de documents multiplateforme pour le Ministère des Forêts.",
      stack: ['Symfony', 'CodeIgniter', 'Node.js', 'React', 'Angular', 'Electron'],
    },
  ],

  // ─── SKILL CARDS (nouvelle forme des compétences) ────────────────────────────

  skillCards: [
    {
      title: 'Frontend',
      deco: 'F',
      lead: ['React 19', 'Next.js 14', 'Angular 16'],
      items: [
        'Redux Toolkit',
        'TanStack Query',
        'Zustand',
        'Vue.js',
        'React Native',
        'Tailwind CSS',
        'shadcn/ui',
        'Angular Material',
        'PrimeReact',
        'TipTap',
        'Formik',
        'Zod',
      ],
    },
    {
      title: 'Backend',
      deco: 'B',
      lead: ['Node.js', 'NestJS', 'Symfony'],
      items: [
        'Laravel 10',
        'API Platform',
        'Prisma',
        'Drizzle ORM',
        'BullMQ',
        'Electron',
        'PHP 8',
        'Python',
        'Java',
      ],
    },
    {
      title: 'Données & Cloud',
      deco: 'D',
      lead: ['PostgreSQL', 'Redis', 'Docker'],
      items: [
        'MongoDB',
        'MariaDB',
        'MySQL',
        'SQLite',
        'Podman',
        'Google Cloud Run',
        'Cloud SQL',
        'Vercel',
        'Azure AD',
        'Red Hat Linux',
      ],
    },
    {
      title: 'IA & Artisanat',
      deco: 'A',
      lead: ['Claude Code', 'GPT-4', 'Figma'],
      items: [
        'Tesseract OCR',
        'pdf2image',
        'DDD / CQRS',
        'Playwright',
        'Jest',
        'Web3Auth',
        'USDC',
        'MVola',
        'Ably Realtime',
        'PostHog',
      ],
    },
  ],

  // ─── PROCESS ─────────────────────────────────────────────────────────────────

  process: [
    {
      num: '01',
      title: 'Le design et le code ne sont pas des disciplines distinctes.',
      body: "C'est le même geste, à un pouce d'écart. Le bouton que vous dessinez dans Figma est le bouton que je rends en React. Je circule librement entre les deux — et le travail n'en est que meilleur.",
    },
    {
      num: '02',
      title: 'Faire équipe avec la machine. Rester aux commandes.',
      body: "Je travaille chaque jour avec Claude Code comme copilote. Il accélère les parties évidentes pour que je consacre mon attention à ce qui compte — l'architecture, les cas limites, le ressenti.",
    },
    {
      num: '03',
      title: 'Typer le système, pas seulement la fonction.',
      body: 'Des types solides aux jointures. Des schémas partout. Zod, Prisma, TypeScript. Le moi du futur remercie le moi du présent quand quelque chose doit changer.',
    },
    {
      num: '04',
      title: "Lire le code legacy avant de l'enterrer.",
      body: "La plupart des réécritures échouent parce que l'auteur ne comprenait pas ce qu'il remplaçait. J'ai migré un monolithe Symfony vers Angular + Node en lisant chaque contrôleur d'abord.",
    },
    {
      num: '05',
      title: 'Livrer petit. Livrer souvent. Bien dormir.',
      body: "Je préfère fusionner dix pull requests bien typées qu'une seule branche héroïque. La livraison continue n'est pas un process — c'est une posture face au risque.",
    },
  ],
} satisfies PortfolioContent

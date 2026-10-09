// English portfolio content module.
//
// This file mirrors `src/content/fr.ts` in every structural aspect —
// same interface, same keys, same array lengths, same ordering — but
// every user-visible string is idiomatic English.
//
// Technology names, company names, project names, and period strings are
// proper nouns or stack identifiers; they are intentionally unchanged between
// locales. Only narrative copy is translated.
//
// No JSX, no Tailwind classes, no logic — data only.
import type { PortfolioContent } from './types'
import { SOCIAL_LINKS } from '../lib/constants'

export default {
  hero: {
    name: 'Erick Andrinirina',
    title: 'Fullstack JavaScript Engineer',
    positioning:
      '7+ years building web applications — online banking, enterprise intranets, gaming and payment platforms. Nearly five years as lead developer.',
    location: 'Antananarivo, Madagascar',
    ctaViewProjects: 'View projects',
    ctaDownloadCv: 'Download CV',
    ctaContact: 'Get in touch',
    greet: "Hi, I'm",
    tagline: 'I build performant, scalable web products end-to-end.',
    roles: [
      'Fullstack Engineer',
      'React & Node specialist',
      'Web3 builder',
      'Problem solver',
    ],
  },

  about: {
    narrative:
      'Experienced Fullstack Developer with 7 years of expertise building high-performance web applications. Comfortable across both JavaScript and PHP ecosystems — React and Angular on the front end, Node.js, Symfony, and Laravel on the back end — with solid experience in databases such as MongoDB, PostgreSQL, and MySQL. Motivated by technical challenges and always looking for new opportunities to contribute to the success of ambitious projects.',
  },

  skills: [
    {
      label: 'Languages',
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
      label: 'Front-end frameworks & libraries',
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
      label: 'Back-end frameworks',
      items: [
        'Node.js',
        'Symfony',
        'Laravel',
        'CodeIgniter',
        'NestJS',
        'API Platform',
      ],
    },
    {
      label: 'Databases',
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
      label: 'Tooling & DevOps',
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
      label: 'Testing',
      items: ['Jest', 'Jasmine', 'Karma'],
    },
    {
      label: 'AI & Specialized',
      items: ['OpenAI', 'Tesseract / Node-Tesseract OCR', 'Blockchain'],
    },
    {
      label: 'Project & design tools',
      items: ['Jira', 'Trello', 'Figma / Adobe XD'],
    },
  ],

  experience: [
    {
      company: 'SOKA / YAS Madagascar',
      role: 'Full Stack Developer',
      period: 'Jan 2025 – present',
      techHighlights: [
        'Next.js',
        'NestJS',
        'Prisma',
        'Redux Toolkit',
        'React Admin',
        'Tailwind CSS',
        'PostgreSQL',
        'Google Cloud',
        'Web3',
        'Blockchain',
      ],
      projects: [
        {
          name: 'SOKA CLUB',
          description:
            'A multifunctional digital platform combining event ticketing, an online shop, and interactive mini-games, with USDC payments and a SOKA points loyalty system.',
        },
        {
          name: 'SOKA LIVE',
          description:
            'A football-prediction platform featuring competitive leaderboards and a rewards system.',
        },
        {
          name: 'LUDOKA',
          description:
            'Competitive Ludo games integrated into the broader SOKA ecosystem.',
        },
      ],
    },
    {
      company: 'BMOI Madagascar',
      role: 'Full Stack Developer',
      period: 'Jul 2024 – Jan 2025',
      techHighlights: ['React', 'Node.js', 'PostgreSQL'],
      projects: [
        {
          name: 'EER Full Digital',
          description:
            'An online bank-account creation service with video-based identity verification and secure document handling for the KYC process.',
        },
      ],
    },
    {
      company: 'SHOYO',
      role: 'Full Stack Developer / Lead Developer',
      period: 'Jan 2021 – Jul 2024',
      techHighlights: [
        'React',
        'Angular',
        'Node.js',
        'NestJS',
        'PostgreSQL',
        'MongoDB',
        'OpenAI',
        'Tesseract',
      ],
      projects: [
        {
          name: 'SHOYO',
          description:
            'A digital-dossier platform simplifying financial procedures, including a major migration from a PHP framework to a modern JavaScript stack.',
        },
        {
          name: 'THESEIS',
          description: 'A digital document-management solution.',
        },
        {
          name: 'Happy Capital / My Capital Immo',
          description:
            'A real-estate crowdfunding platform with real-time investment tracking.',
        },
        {
          name: 'OCR information extraction',
          description:
            'A solution leveraging OCR and GPT-4 to convert images and PDFs (ID cards, bank details, passports) into structured data.',
        },
      ],
    },
    {
      company: 'VTC Academy',
      role: 'Full Stack Developer',
      period: 'Jun 2020 – Dec 2020',
      techHighlights: ['React', 'Node.js', 'MySQL'],
      projects: [
        {
          name: 'VTC Academy',
          description:
            'A training platform for taxi drivers featuring multiple-choice quizzes and an administrative dashboard for tracking student progress.',
        },
      ],
    },
    {
      company: 'PANAFRI HELP',
      role: 'Full Stack Developer',
      period: 'Jan 2020 – Jun 2020',
      techHighlights: ['React', 'Node.js', 'MongoDB'],
      projects: [
        {
          name: 'PANAFRI HELP',
          description:
            'A project-funding platform built end-to-end, from concept to production.',
        },
      ],
    },
    {
      company: 'CREACTISOFT',
      role: 'Full Stack Developer / Lead Developer',
      period: 'Sept 2019 – Dec 2020',
      techHighlights: ['Angular', 'Symfony', 'PostgreSQL', 'MySQL'],
      projects: [
        {
          name: 'IPSUM',
          description: 'A sales ERP solution.',
        },
        {
          name: 'SOLIUS',
          description: 'A construction ERP solution.',
        },
        {
          name: 'MOZART',
          description: 'A customer-service ERP solution.',
        },
        {
          name: 'ELISE',
          description: 'An automated after-sales questionnaire system.',
        },
      ],
    },
    {
      company: 'INGENOSYA',
      role: 'Full Stack Developer',
      period: 'Oct 2018 – Sept 2019',
      techHighlights: ['Angular', 'Laravel', 'MySQL', 'PostgreSQL'],
      projects: [
        {
          name: 'BNI Madagascar',
          description: 'An online bank-loan application platform.',
        },
        {
          name: 'FMFP',
          description: 'An inter-company financing portal.',
        },
        {
          name: 'FORET MAD',
          description:
            'A cross-platform document classification application for the Ministry of Forests.',
        },
      ],
    },
  ],

  projects: [
    {
      name: 'SOKA Club',
      company: 'SOKA / YAS Madagascar',
      description:
        'Multifunctional digital platform combining event ticketing, an online shop, and interactive mini-games with USDC payments and a loyalty points system.',
      techTags: [
        'Next.js',
        'NestJS',
        'Prisma',
        'Redux Toolkit',
        'Tailwind CSS',
        'PostgreSQL',
        'Web3',
      ],
    },
    {
      name: 'SOKA Live',
      company: 'SOKA / YAS Madagascar',
      description:
        'Real-time sports prediction platform with dynamic leaderboards and rewards system.',
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
        'Competitive online Ludo games integrated into the broader SOKA ecosystem with real-time game management.',
      techTags: [
        'Next.js',
        'NestJS',
        'Prisma',
        'PostgreSQL',
        'Real-time messaging',
      ],
    },
    {
      name: 'EER Full Digital',
      company: 'BMOI Madagascar',
      description:
        'Online bank-account creation service with video-based identity verification and secure KYC document handling.',
      techTags: ['React', 'Node.js', 'TypeScript', 'KYC', 'Video verification'],
    },
    {
      name: 'SHOYO',
      company: 'SHOYO',
      description:
        'Digital dossier platform for managing financial procedures, including a major migration from PHP to JavaScript.',
      techTags: [
        'React',
        'NestJS',
        'TypeScript',
        'PostgreSQL',
        'PHP migration',
      ],
    },
    {
      name: 'THESEIS',
      company: 'SHOYO',
      description:
        'Digital document management solution for enterprise-level document classification, storage, and retrieval.',
      techTags: ['Angular', 'Node.js', 'MongoDB', 'TypeScript'],
    },
    {
      name: 'Happy Capital / My Capital Immo',
      company: 'SHOYO',
      description:
        'Real-estate crowdfunding platform with real-time investment tracking and interactive investor dashboards.',
      techTags: ['React', 'NestJS', 'PostgreSQL', 'WebSocket', 'TypeScript'],
    },
    {
      name: 'OCR / GPT-4',
      company: 'SHOYO',
      description:
        'Automated data extraction from images and PDFs (IDs, IBANs, passports) using OCR and GPT-4.',
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
        'Training platform for VTC drivers with interactive quizzes and educational progress dashboards.',
      techTags: ['React', 'Node.js', 'MySQL', 'Quiz'],
    },
    {
      name: 'PANAFRI HELP',
      company: 'PANAFRI HELP',
      description:
        'End-to-end project financing platform built from design through production for Africa.',
      techTags: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      name: 'IPSUM – Commercial ERP',
      company: 'CREACTISOFT',
      description:
        'Custom ERP for commercial management: sales, inventory, quotes, and invoicing.',
      techTags: ['Angular', 'Symfony', 'MySQL', 'ERP'],
    },
    {
      name: 'BNI Madagascar',
      company: 'INGENOSYA',
      description:
        'Online banking credit application platform for BNI Madagascar with loan simulation and document submission.',
      techTags: ['Angular', 'Laravel', 'MySQL'],
    },
  ],

  education: [
    {
      qualification:
        "Master's Engineer in Electronics, Applied Computing track",
      institution: "École Supérieure Polytechnique d'Antananarivo",
      year: 'June 2018',
    },
    {
      qualification: 'Advanced web development training',
      institution: 'NEITIC',
      year: 'June 2019',
    },
    {
      qualification: 'Scientific Baccalaureate',
      institution: '',
      year: '2013',
    },
  ],

  spokenLanguages: [
    { language: 'Malagasy', proficiency: 'Native' },
    { language: 'French', proficiency: 'Fluent' },
    { language: 'English', proficiency: 'Intermediate' },
  ],

  contact: {
    location: 'Antananarivo, Madagascar',
    intro:
      'Feel free to reach out — I am always open to discussing new projects, opportunities, or ideas.',
    pitch: {
      heading: "What I'm looking for next.",
      paragraphs: [
        "A team that ships, a product I care about, and a problem with enough substance to keep me curious. I'm open to fintech, gaming, AI — anywhere I can write code that earns its place.",
        "If that sounds like you, drop me a line. Tell me what you're building, and how I might fit.",
      ],
      signature: '— Erick',
    },
    languages: ['Malagasy', 'Français', 'English'],
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
        label: 'GitHub',
        value: 'github.com/ckandrinirina',
        href: SOCIAL_LINKS.github,
      },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/andrinirina-erick',
        href: SOCIAL_LINKS.linkedin,
      },
      {
        label: 'Based in',
        value: 'Antananarivo, Madagascar',
        muted: '· UTC+3',
      },
      {
        label: 'Available',
        value: 'open · remote, contract or full-time',
        dot: 'success',
      },
    ],
  },

  // ─── NOW ───────────────────────────────────────────────────────────────────

  now: {
    headline: 'Building the SOKA ecosystem',
    body: 'Fullstack development on the SOKA ecosystem — ticketing, commerce, football predictions and real-time games, with USDC and MVola payments.',
    meta: {
      label: 'Currently',
      period: 'Jan 2025 — present',
    },
  },

  // ─── STATS ───────────────────────────────────────────────────────────────────

  stats: [
    { n: 7, suffix: '+', label: 'Years building' },
    { n: 20, suffix: '+', label: 'Projects shipped' },
    { n: 9, label: 'Featured works' },
    { n: 7, label: 'Companies' },
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

  // ─── TIMELINE (new experience shape) ─────────────────────────────────────────

  timeline: [
    {
      year: '2025 — Present',
      role: 'Fullstack Developer',
      company: 'SOKA · YAS Madagascar',
      desc: 'Building the SOKA ecosystem — Club, Live, Ludoka. Event ticketing, an online store, football predictions and competitive Ludo, glued together by SOKA points, USDC and MVola mobile-money payments, and realtime infrastructure.',
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
      role: 'Fullstack Developer',
      company: 'BMOI Madagascar',
      desc: "Built the bank's intranet (Groupe BCP) — a NestJS / React monorepo of 14 business modules in DDD / CQRS, Azure AD sign-in, deployed with Podman on Red Hat. Shipped EER Full Digital — online account opening with video-call KYC and a UX that doesn't feel like a 2008 bank portal.",
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
      desc: 'Three and a half years owning the digital case-file platform. Led the Symfony → Angular + Node migration. Shipped THESEIS, Happy Capital / My Capital Immo, and an OCR pipeline powered by Tesseract + GPT-4.',
      stack: ['Angular 16', 'Symfony 4', 'Node.js', 'Vue.js', 'MongoDB', 'OpenAI'],
    },
    {
      year: '2020',
      role: 'Fullstack Developer',
      company: 'VTC Academy',
      desc: 'Training platform for taxi drivers — courses, MCQ assessments, backoffice dashboard for tracking student progress.',
      stack: ['Angular', 'Angular Material', 'Symfony', 'API Platform'],
    },
    {
      year: '2020',
      role: 'Fullstack Developer',
      company: 'PANAFRI Help',
      desc: 'Solo build of a project-financing platform end-to-end. Concept → production. Loan submissions, project funding, a UX that earns trust on a sensitive topic.',
      stack: ['React', 'Symfony', 'PrimeReact', 'Formik'],
    },
    {
      year: '2019 — 2020',
      role: 'Lead Developer',
      company: 'Creactisoft',
      desc: 'Lead on a portfolio of ERPs — IPSUM for sales, SOLIUS for construction, MOZART for customer service — plus ELISE, an automated after-sales diagnostic questionnaire.',
      stack: ['Angular', 'React', 'Symfony', 'Laravel', 'MongoDB'],
    },
    {
      year: '2018 — 2019',
      role: 'Fullstack Developer',
      company: 'Ingenosya',
      desc: 'First gig out of engineering school. Banking portal for BNI Madagascar, FMFP project financing, cross-platform document classifier for the Ministry of Forests.',
      stack: ['Symfony', 'CodeIgniter', 'Node.js', 'React', 'Angular', 'Electron'],
    },
  ],

  // ─── SKILL CARDS (new skills shape) ──────────────────────────────────────────

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
      title: 'Data & Cloud',
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
      title: 'AI & Craft',
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
      title: "Design and code aren't separate disciplines.",
      body: "They're the same act, one inch apart. The button you draw in Figma is the button I render in React. I move freely between both — and the work is better for it.",
    },
    {
      num: '02',
      title: "Pair with the machine. Stay in the driver's seat.",
      body: 'I work daily with Claude Code as a co-pilot. It accelerates the obvious parts so I can spend my attention on the parts that matter — the architecture, the edge cases, the feel.',
    },
    {
      num: '03',
      title: 'Type the system, not just the function.',
      body: 'Strong types at the seams. Schemas everywhere. Zod, Prisma, TypeScript. Future-me thanks present-me when something needs to change.',
    },
    {
      num: '04',
      title: 'Read the legacy code before you bury it.',
      body: "Most rewrites fail because the author didn't understand what they were replacing. I migrated a Symfony monolith to Angular + Node by reading every controller first.",
    },
    {
      num: '05',
      title: 'Ship small. Ship often. Sleep well.',
      body: "I'd rather merge ten well-typed pull requests than one heroic branch. Continuous delivery isn't a process — it's a stance toward risk.",
    },
  ],
} satisfies PortfolioContent

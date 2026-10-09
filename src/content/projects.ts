// Featured works dataset for the Atelier Work view and project detail modal.
//
// Locale-independent fields (project names, clients, tech stacks, years, tags)
// are proper nouns / identifiers, so they are NOT duplicated across fr.ts/en.ts.
// This array is the ENGLISH baseline: `role`, `category`, the card summary
// (`desc`) and the `detail` copy are written in English. The French copy lives
// in `projects.fr.ts` and is merged over this baseline by `localizeProjects`.
//
// Ordering is the showcase order — `num` "01"…"09" follows the array index.
// Copy started as a port of the "Atelier Terminal" reference (app.jsx PROJECTS)
// and is kept in sync with the CV (public/cv/erick-andrinirina-cv.pdf).
//
// Screenshots are not referenced here: a file named `<id>.webp|png|jpg` in
// `src/assets/projects/` is picked up by `ProjectMedia` (SVG art otherwise).
import type { Project } from './types'
import { projectsCopyFr } from './projects.fr'

export const projects: Project[] = [
  {
    id: 'soka',
    num: '01',
    name: 'SOKA Club',
    year: '2025',
    role: 'Lead Fullstack',
    client: 'YAS Madagascar',
    category: 'Platform · Web3',
    link: 'https://www.soka.club/',
    repo: null,
    desc: 'Multifunctional digital platform — event ticketing, online store and interactive mini-games. USDC and MVola mobile-money payments, SOKA points to earn and spend, glued together by realtime infrastructure.',
    tags: ['Next.js 14', 'NestJS', 'Prisma', 'Web3Auth', 'MVola', 'Ably'],
    detail: {
      role: 'Architecture, payments rail, points economy, realtime store and leaderboard.',
      impact:
        'An end-to-end engagement loop — buy, play, earn, spend. Sub-second realtime sync across leaderboards, store and games. Built for an audience that shouldn\'t have to think about "blockchain".',
      stack:
        'Next.js 14 · Redux Toolkit · React Admin · Tailwind · NestJS · Prisma · PostgreSQL · Ably Realtime · MVola · Web3Auth · Docker · Vercel · GCP Cloud Run',
    },
  },
  {
    id: 'soka-live',
    num: '02',
    name: 'SOKA Live',
    year: '2025',
    role: 'Fullstack',
    client: 'YAS Madagascar',
    category: 'Realtime · Gaming',
    link: 'https://live.soka.club/',
    repo: null,
    desc: 'Live football prediction platform. Players forecast results, compete on a leaderboard and earn SOKA points spendable across the ecosystem — with MVola payments.',
    tags: ['Realtime', 'Ably', 'NestJS', 'Leaderboard', 'MVola'],
    detail: {
      role: 'Realtime systems, scoring rules, wallet integration with SOKA Club.',
      impact:
        'Designed prediction windows and a live leaderboard that feels stadium-loud even on a 3G phone.',
      stack: 'Next.js 14 · NestJS · Prisma · Ably Realtime · PostgreSQL · MVola · Tailwind',
    },
  },
  {
    id: 'ludoka',
    num: '03',
    name: 'Ludoka',
    year: '2025',
    role: 'Fullstack',
    client: 'YAS Madagascar',
    category: 'Game · Casual',
    link: 'https://ludoka.soka.club/',
    repo: null,
    desc: 'Competitive Ludo games wired into the SOKA points economy — and now real-money matches paid through MVola. Matchmaking, verifiable RNG, payouts into the same wallet.',
    tags: ['Game loop', 'Realtime', 'RNG', 'MVola'],
    detail: {
      role: 'Game state machine, matchmaking, anti-cheat, points accrual, MVola paid matches.',
      impact:
        'A folk board game turned into a native web experience. Animated tokens, fair RNG, payouts into the SOKA wallet.',
      stack: 'Next.js 14 · NestJS · Prisma · Ably Realtime · PostgreSQL · MVola',
    },
  },
  {
    id: 'bmoi-intranet',
    num: '04',
    name: 'Intranet BMOI',
    year: '2024',
    role: 'Fullstack',
    client: 'BMOI · Groupe BCP',
    category: 'Enterprise · Intranet',
    link: null,
    repo: null,
    desc: 'The bank intranet for BMOI (Groupe BCP): a NestJS / React monorepo of 14 business modules in a DDD / CQRS architecture, Azure AD sign-in and a backoffice with roles and permissions.',
    tags: ['NestJS', 'React 19', 'DDD / CQRS', 'Azure AD', 'Monorepo'],
    detail: {
      role: 'Business modules, CQRS command/query layer, Azure AD integration, role-and-permission backoffice, Podman deployment.',
      impact:
        'Fourteen business modules behind a single Azure AD sign-in, on one typed monorepo — deployed on-premise with Podman on Red Hat.',
      stack:
        'NestJS · Drizzle ORM · PostgreSQL · Redis · React 19 · TanStack Query · Zustand · Tailwind · shadcn/ui · Playwright · Podman · RHEL',
    },
  },
  {
    id: 'eer',
    num: '05',
    name: 'EER Full Digital',
    year: '2024',
    role: 'Fullstack',
    client: 'BMOI Madagascar',
    category: 'Banking · KYC',
    link: null,
    repo: null,
    desc: 'Online bank account opening for BMOI. Video-call identity verification, secure document vault, banking-grade KYC compliance.',
    tags: ['Banking', 'KYC', 'WebRTC', 'Laravel', 'React 18'],
    detail: {
      role: 'Full KYC flow, video identity check, secure document handling.',
      impact:
        'Replaced a branch visit with a 12-minute online flow. Auditable for the bank, frictionless for the customer.',
      stack:
        'React 18 · PHP 8 · Laravel 10 · PrimeReact · Tailwind · PostgreSQL · Docker',
    },
  },
  {
    id: 'shoyo',
    num: '06',
    name: 'SHOYO',
    year: '2021–24',
    role: 'Lead Developer',
    client: 'SHOYO · France',
    category: 'Fintech · Migration',
    link: 'https://shoyo.io/',
    repo: null,
    desc: 'Digital case file that simplifies financial paperwork for subscribers. Led the major Symfony → Angular + Node.js rewrite end-to-end, with the team and the cutover.',
    tags: ['Angular 16', 'Symfony', 'Migration', 'Lead', 'MongoDB'],
    detail: {
      role: 'Migration architect, team mentorship, system refactor.',
      impact:
        'Killed a creaking Symfony monolith. Typed Angular + Node stack, zero-downtime cutover, happier engineers.',
      stack:
        'Angular 16 · Symfony 4 · Angular Material · Node.js · MariaDB · MongoDB',
    },
  },
  {
    id: 'ocr',
    num: '07',
    name: 'OCR Intelligence',
    year: '2023',
    role: 'R&D · Fullstack',
    client: 'SHOYO · France',
    category: 'AI · Pipeline',
    link: null,
    repo: null,
    desc: 'OCR + GPT-4 pipeline turning photos and PDFs of ID cards, RIBs and passports into typed, validated JSON.',
    tags: ['OCR', 'Tesseract', 'GPT-4', 'pdf2image', 'AI'],
    detail: {
      role: 'Pipeline design, prompt engineering, model orchestration.',
      impact:
        'Replaced manual data-entry teams. Scans in, validated JSON out — ready for downstream systems.',
      stack:
        'Node.js · Tesseract · node-tesseract · OpenAI GPT-4 · pdf2image · Python',
    },
  },
  {
    id: 'happy',
    num: '08',
    name: 'Happy Capital / My Capital Immo',
    year: '2022',
    role: 'Fullstack',
    client: 'SHOYO · France',
    category: 'Fintech · Crowdfunding',
    link: 'https://www.happy-capital.com/',
    repo: null,
    desc: 'Real-estate crowdfunding platforms. Investor accounts, project pages, real-time tracking of every investment.',
    tags: ['Fintech', 'Investing', 'Angular'],
    detail: {
      role: 'Investor dashboards, project flow, payments integration.',
      impact:
        "A serious investment product that doesn't condescend. Clear numbers, real-time portfolio view.",
      stack: 'Angular · Symfony · MariaDB',
    },
  },
  {
    id: 'theseis',
    num: '09',
    name: 'THESEIS',
    year: '2022',
    role: 'Fullstack',
    client: 'SHOYO · France',
    category: 'Documents',
    link: 'https://edoc-test.shoyo.io/',
    repo: null,
    desc: 'Document management: digitisation, secure storage and search — cutting the cost and delays of paper for clients drowning in it.',
    tags: ['Documents', 'Search', 'Angular'],
    detail: {
      role: 'Frontend architecture, search UX, document pipeline.',
      impact:
        'Retrieval time went from minutes to seconds — structured metadata + a search that actually understands the corpus.',
      stack: 'Angular · Symfony · MongoDB',
    },
  },
]

/**
 * Return the featured works localized for `locale`. The English baseline above
 * is returned as-is for `'en'`; for `'fr'` the per-id copy in `projects.fr.ts`
 * is overlaid onto the locale-dependent fields (`role`, `category`, `desc`,
 * `detail.role`, `detail.impact`), leaving every locale-independent field
 * (id, num, name, year, client, tags, stack, link, repo) untouched.
 */
export function localizeProjects(locale: 'fr' | 'en'): Project[] {
  if (locale === 'en') return projects
  return projects.map((project) => {
    const copy = projectsCopyFr[project.id]
    return {
      ...project,
      role: copy.role,
      category: copy.category,
      desc: copy.desc,
      detail: {
        ...project.detail,
        role: copy.detail.role,
        impact: copy.detail.impact,
      },
    }
  })
}

// French copy overlay for the 9 featured works (BUG-20260612-01).
//
// `content/projects.ts` is the English baseline and the single source for the
// locale-independent fields (id, num, name, year, client, tags, stack, link).
// This module supplies ONLY the locale-dependent copy — role, category, card
// summary (`desc`) and the modal `detail` (role + impact) — keyed by project id.
// `localizeProjects('fr')` (in projects.ts) merges this over the baseline.
//
// Translation rules mirror fr.ts: technology names and proper nouns stay in
// English; common tech anglicisms used in French (Fullstack, Lead, R&D,
// gaming, crowdfunding) are kept as-is.
import type { ProjectCopy, ProjectId } from './types'

export const projectsCopyFr: Record<ProjectId, ProjectCopy> = {
  soka: {
    role: 'Lead Fullstack',
    category: 'Plateforme · Web3',
    desc: 'Plateforme digitale multifonctionnelle — billetterie événementielle, boutique en ligne et mini-jeux interactifs. Paiements USDC et mobile money (MVola), points SOKA à gagner et à dépenser, reliés par une infrastructure temps réel.',
    detail: {
      role: 'Architecture, rail de paiement, économie de points, boutique et classement en temps réel.',
      impact:
        'Une boucle d’engagement de bout en bout — acheter, jouer, gagner, dépenser. Synchronisation temps réel en moins d’une seconde entre classements, boutique et jeux. Conçue pour un public qui ne devrait jamais avoir à penser à la « blockchain ».',
    },
  },
  'soka-live': {
    role: 'Fullstack',
    category: 'Temps réel · Gaming',
    desc: 'Plateforme de pronostics football en direct. Les joueurs prédisent les résultats, s’affrontent au classement et gagnent des points SOKA dépensables dans tout l’écosystème — avec paiement MVola.',
    detail: {
      role: 'Systèmes temps réel, règles de scoring, intégration du portefeuille avec SOKA Club.',
      impact:
        'Conception des fenêtres de pronostic et d’un classement en direct qui vibre comme un stade, même sur un téléphone en 3G.',
    },
  },
  ludoka: {
    role: 'Fullstack',
    category: 'Jeu · Casual',
    desc: 'Jeux de Ludo compétitifs branchés sur l’économie de points SOKA — et désormais des parties payantes en argent réel via MVola. Matchmaking, RNG vérifiable, gains versés dans le même portefeuille.',
    detail: {
      role: 'Machine à états du jeu, matchmaking, anti-triche, accumulation de points, parties payantes MVola.',
      impact:
        'Un jeu de plateau populaire transformé en expérience web native. Pions animés, RNG équitable, gains versés dans le portefeuille SOKA.',
    },
  },
  'bmoi-intranet': {
    role: 'Fullstack',
    category: 'Entreprise · Intranet',
    desc: 'L’intranet de la banque BMOI (Groupe BCP) : un monorepo NestJS / React de 14 modules métier en architecture DDD / CQRS, intégration Azure AD et un backoffice avec rôles et permissions.',
    detail: {
      role: 'Modules métier, couche CQRS commandes/requêtes, intégration Azure AD, backoffice rôles et permissions, déploiement Podman.',
      impact:
        'Quatorze modules métier derrière une seule connexion Azure AD, dans un monorepo typé — déployé on-premise avec Podman sur Red Hat.',
    },
  },
  eer: {
    role: 'Fullstack',
    category: 'Banque · KYC',
    desc: 'Ouverture de compte bancaire en ligne pour BMOI. Vérification d’identité par appel vidéo, coffre-fort documentaire sécurisé, conformité KYC de niveau bancaire.',
    detail: {
      role: 'Parcours KYC complet, contrôle d’identité par vidéo, gestion sécurisée des documents.',
      impact:
        'Remplace une visite en agence par un parcours en ligne de 12 minutes. Auditable pour la banque, sans friction pour le client.',
    },
  },
  shoyo: {
    role: 'Développeur Lead',
    category: 'Fintech · Migration',
    desc: 'Dossier numérique qui simplifie les démarches financières des souscripteurs. Refonte majeure de Symfony vers Angular et Node.js pilotée de bout en bout, avec l’équipe et la bascule en production.',
    detail: {
      role: 'Architecte de la migration, mentorat de l’équipe, refonte du système.',
      impact:
        'Enterré un monolithe Symfony vieillissant. Stack typée Angular + Node, bascule sans interruption, des ingénieurs plus heureux.',
    },
  },
  ocr: {
    role: 'R&D · Fullstack',
    category: 'IA · Pipeline',
    desc: 'Pipeline OCR + GPT-4 transformant photos et PDF de cartes d’identité, RIB et passeports en JSON typé et validé.',
    detail: {
      role: 'Conception du pipeline, prompt engineering, orchestration des modèles.',
      impact:
        'Remplace les équipes de saisie manuelle. Scans en entrée, JSON validé en sortie — prêt pour les systèmes en aval.',
    },
  },
  happy: {
    role: 'Fullstack',
    category: 'Fintech · Crowdfunding',
    desc: 'Plateformes de financement participatif immobilier. Comptes investisseurs, pages projets, suivi des placements en temps réel.',
    detail: {
      role: 'Tableaux de bord investisseurs, parcours projet, intégration des paiements.',
      impact:
        'Un produit d’investissement sérieux qui ne prend pas l’utilisateur de haut. Des chiffres clairs, un portefeuille en temps réel.',
    },
  },
  theseis: {
    role: 'Fullstack',
    category: 'Documents',
    desc: 'Gestion documentaire : numérisation, stockage sécurisé et recherche des documents — pour réduire les coûts et les délais du papier chez des clients qui s’y noyaient.',
    detail: {
      role: 'Architecture front-end, UX de recherche, pipeline documentaire.',
      impact:
        'Le temps de recherche est passé de plusieurs minutes à quelques secondes — métadonnées structurées et un moteur qui comprend vraiment le corpus.',
    },
  },
}

# MAAT Studio AI™ - Roadmap d'Implémentation & Architecture Technique

**Dernière révision :** 2026-07-20  
**Projet :** MAAT Studio AI

---

## 1. Roadmap de Déploiement en 4 Phases

```text
  PHASE 1 : SOCLE & INTERFACE V1 (Séquence Actuelle)
  ├── Setup du Projet Next.js / TypeScript / Design System
  ├── Dashboard QG & Navigation Studio
  ├── Module "Missions™" (Création, Suivi & Journal de bord)
  └── Multi-Brain System Configurator (Founder & Company Brain)

  PHASE 2 : MOTEUR COGNITIF & CONSEIL D'ADMINISTRATION IA
  ├── Orchestrateur d'Agents (CEO, Marketing, Finance, Créatif)
  ├── Moteur de Débat & Explicabilité des Décisions (Score de Confiance %)
  └── Mode Simulation™ (Scénarios ROI et risques)

  PHASE 3 : RACCORDEMENT MAATFEED & PASSERELLE D'INTELLIGENCE
  ├── Authentification Unique (Compte MAAT SSO)
  ├── MAAT Intelligence Core API (Tendances & Signaux culturels)
  └── Multi-channel Publishing & Feedback Loop

  PHASE 4 : ENTERPRISE KNOWLEDGE GRAPH & EXPANSION MULTI-DÉPARTEMENTS
  ├── Connecteurs Ventes, RH & Support
  └── GraphDB & Vector DB RAG Long-terme
```

---

## 2. Principes d'Architecture Frontend (Web App Studio)

1. **Design System Ultra-Premium (Aesthetics & UX) :**
   - Palette tailleur Dark Mode / Obsidian avec accents néon harmonieux.
   - Glassmorphism subtil, animations fluides (transitions CSS & micro-interactions).
   - Typographies modernes (Google Fonts : *Inter* / *Outfit*).

2. **Fiabilité & Code-First (Protocole Agent Exigé) :**
   - Zéro composant mort ou factice. Chaque carte, statut ou bouton contrôle un état d'application réel.
   - Mobile-First : Rendu et navigation irréprochables sur 390x844.
   - Gestion d'états d'erreur, de chargement et d'absence de données.

---

## 3. Architecture des Composants Core

```text
  src/
  ├── components/
  │   ├── layout/            # Header, Sidebar Studio, BottomNav Mobile
  │   ├── dashboard/         # QG Studio, Score de Santé, Journal de bord
  │   ├── missions/          # Création, Kanban/Fiche de Mission, Simulation
  │   ├── brain/             # Founder Brain, Company Brain, Knowledge Graph
  │   ├── agents/            # Board of Directors, Agent Chat & Debates
  │   └── ui/                # Boutons, Cards, Modal, Badges, Loaders (Design System)
  ├── types/                 # Typage strict (Mission, Agent, Decision, Brain)
  ├── store/                 # Gestionnaire d'état applicatif (Missions, Agents, AppState)
  └── styles/                # CSS Tokens, animations, variables globales
```

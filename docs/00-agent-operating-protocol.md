# MAAT Studio AI™ — Agent Operating Protocol & Quality Standards

**Dernière révision :** 2026-07-20  
**Statut :** Norme de développement obligatoire

Ce protocole régit l'intégralité du développement de **MAAT Studio AI™**. Inspiré des exigences rigoureuses instaurées sur le projet MAATFEED, ce document élève la méthodologie pour répondre aux ambitions d'un **AI Company Operating System™**.

---

## 1. Principes Fondateurs : Mandat Zéro UI Morte & Logic-First

### 1.1 Mandat Zéro UI Morte
- **Interface Réelle :** Aucun agent ou développeur ne doit créer de simples composants "maquillés" ou statiques simulant un fonctionnement.
- **Surface Utile :** Chaque bouton, tableau de bord, graphe ou panneau de contrôle visible à l'écran doit être connecté à la logique d'état, être cliquable, réactif et testable.
- **Données Dynamiques :** Pas de listes codées en dur présentées comme du contenu temps réel. Les états de simulation ou de chargement doivent utiliser de vrais flux d'états applicatifs.

### 1.2 Le Priorité au Moteur Cognitif (*Logic-First*)
- L'esthétique premium (Dark mode, animations fluides, glassmorphism) est indispensable, mais elle ne doit jamais masquer l'absence de logique métier.
- Tout composant UI doit refléter directement un concept de la Bible Produit :
  - **Missions™** (État, progression, priorités)
  - **Workflows Cognitifs™** (Cycles Débat → Décision → Exécution)
  - **Conseil d'Administration IA / Agents** (Status, rôle, niveau de confiance)
  - **Multi-Brain System** (Founder Brain, Company Brain, Market Brain)

---

## 2. Rigueur d'Ingénierie & Cycle de Développement

Avant toute écriture de code ou modification d'architecture :

1. **Analyse Code-First & Spécifications :**
   - Consulter la source de vérité : le code source et [`MEMORY.md`](file:///C:/Users/Franck/web-apps/MAAT-STUDIO-IA/MEMORY.md).
   - Vérifier la conformité avec la **Product Bible** réorganisée.

2. **Garantie Sans Régression :**
   - Évaluer l'impact transverse de toute modification sur les contrats de données, les types TypeScript ou les agents IA.
   - Maintenir la compatibilité d'authentification avec l'écosystème MAAT (compte unique).

3. **Responsivité & Ergonomie Mobile-First :**
   - Chaque écran du studio de pilotage doit offrir une expérience d'utilisation optimale sur écran mobile (390x844) comme sur grand écran Desktop (1920x1080).

4. **Gestion Système des États Limites :**
   - Tout composant ou page doit prévoir explicitement les 4 états :
     - ⏳ `Loading` (Squelettes de chargement élégants)
     - ⚠️ `Error` (Messages d'erreur explicites avec reprise d'action)
     - 📭 `Empty` (États vides guidés avec call-to-action pour lancer une Mission)
     - 🔌 `Offline` / `Degraded` (Gestion de la perte de réseau ou d'API IA)

---

## 3. Matrice de Validation Definition of Done (DoD)

Une fonctionnalité ou un module de MAAT Studio AI est considéré comme **Terminé (Done)** si et seulement si :

| Critère | Exigence | Validation |
| :--- | :--- | :--- |
| **Logic & State** | État applicatif synchronisé, aucune donnée fictive non contrôlée. | ✅ Vérifié |
| **Mobile & Desktop** | Layout fluide, lisibilité parfaite sur 390x844 et 1080p+. | ✅ Validé UI |
| **Type Safety** | Typage TypeScript strict (`no implicit any`), zero warning critique. | ✅ `npm run typecheck` |
| **Code Quality** | Lint propre, absence de `console.log` de debug en production. | ✅ `npm run lint` |
| **Build Stability** | Bundle de production compilable sans erreur. | ✅ `npm run build` |
| **Doc Sync** | Mises à jour effectuées dans `MEMORY.md` et `/docs`. | ✅ Synchronisé |

---

## 4. Synergie Humain-Agent (*Human-Augmented Architecture*)

L'équipe et l'IA collaborent selon le principe de la boucle d'apprentissage :
- **Humains :** Vision stratégique, arbitrage des risques majeurs, critères d'acceptation, créativité.
- **Agents IA :** Exécution des tâches spécialisées, analyse des signaux de marché, mise à jour des graphes de connaissances, détection proactive d'opportunités.

import jsPDF from 'jspdf';
import {
  Mission,
  SystemHealth,
  FounderBrainConfig,
  CompanyBrainConfig,
  CRMContact,
  SimulationScenario,
  DecisionLog,
  ExecutiveAuditReport,
  Agent
} from '../types';

// ─── Design Token Constants ───────────────────────────────────────────────────
const COLOR = {
  obsidian: '#0B0E17',
  surface:  '#0F1220',
  slate800: '#1E293B',
  amber:    '#F59E0B',
  amber600: '#D97706',
  emerald:  '#10B981',
  cyan:     '#06B6D4',
  rose:     '#F43F5E',
  white:    '#F8FAFC',
  muted:    '#64748B',
  text:     '#CBD5E1',
} as const;

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// ─── Core Layout Helpers ──────────────────────────────────────────────────────
class MaatPDF {
  doc: jsPDF;
  pageW: number;
  pageH: number;
  marginX = 16;
  y = 0;

  constructor() {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    this.pageW = this.doc.internal.pageSize.getWidth();
    this.pageH = this.doc.internal.pageSize.getHeight();
    this.y = 0;
  }

  // Fill page background
  background() {
    const [r, g, b] = hexToRgb(COLOR.obsidian);
    this.doc.setFillColor(r, g, b);
    this.doc.rect(0, 0, this.pageW, this.pageH, 'F');
  }

  // Add a new page with background
  newPage() {
    this.doc.addPage();
    this.background();
    this.y = 20;
  }

  // Check if we need a page break
  checkPage(neededHeight = 20) {
    if (this.y + neededHeight > this.pageH - 20) {
      this.newPage();
    }
  }

  // ── Typography Helpers ──────────────────────────────────────────────────────
  setColor(hex: string) {
    const [r, g, b] = hexToRgb(hex);
    this.doc.setTextColor(r, g, b);
  }

  setFill(hex: string) {
    const [r, g, b] = hexToRgb(hex);
    this.doc.setFillColor(r, g, b);
  }

  setDraw(hex: string) {
    const [r, g, b] = hexToRgb(hex);
    this.doc.setDrawColor(r, g, b);
  }

  text(str: string, x: number, y: number, opts?: { align?: 'left' | 'center' | 'right' }) {
    this.doc.text(str, x, y, opts);
  }

  // ── Gold Header Bar ─────────────────────────────────────────────────────────
  headerBar(title: string, subtitle: string, date: string) {
    this.background();

    // Gold top stripe
    this.setFill(COLOR.amber);
    this.doc.rect(0, 0, this.pageW, 1.5, 'F');

    // Brand wordmark
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.setColor(COLOR.amber);
    this.text('MAAT STUDIO AI', this.marginX, 18);

    // OS tag
    this.doc.setFontSize(7);
    this.setColor(COLOR.muted);
    this.text('AI COMPANY OPERATING SYSTEM™', this.marginX, 23);

    // Date right-aligned
    this.doc.setFontSize(7);
    this.setColor(COLOR.muted);
    this.text(date, this.pageW - this.marginX, 20, { align: 'right' });

    // Divider
    this.setDraw(COLOR.slate800);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.marginX, 27, this.pageW - this.marginX, 27);

    // Document title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(18);
    this.setColor(COLOR.white);
    this.text(title, this.marginX, 39);

    // Subtitle
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.setColor(COLOR.text);
    this.text(subtitle, this.marginX, 47);

    // Bottom separator
    this.setDraw(COLOR.amber);
    this.doc.setLineWidth(0.4);
    this.doc.line(this.marginX, 52, this.marginX + 60, 52);

    this.y = 60;
  }

  // ── Section Header ──────────────────────────────────────────────────────────
  sectionHeader(label: string) {
    this.checkPage(14);
    // Pill background
    this.setFill(COLOR.slate800);
    this.doc.roundedRect(this.marginX - 2, this.y - 4, this.pageW - this.marginX * 2 + 4, 9, 2, 2, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7.5);
    this.setColor(COLOR.amber);
    this.text(`▶  ${label.toUpperCase()}`, this.marginX + 2, this.y + 2);
    this.y += 12;
  }

  // ── Metric Card row ──────────────────────────────────────────────────────────
  metricCards(cards: { label: string; value: string; color: string }[], rowY?: number) {
    const startY = rowY ?? this.y;
    const count = cards.length;
    const gap = 4;
    const cardW = (this.pageW - this.marginX * 2 - gap * (count - 1)) / count;

    cards.forEach((card, i) => {
      const x = this.marginX + i * (cardW + gap);
      // Card background
      this.setFill(COLOR.surface);
      this.setDraw(COLOR.slate800);
      this.doc.setLineWidth(0.3);
      this.doc.roundedRect(x, startY, cardW, 20, 2, 2, 'FD');

      // Label
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(6.5);
      this.setColor(COLOR.muted);
      this.doc.text(card.label.toUpperCase(), x + 3, startY + 6);

      // Value
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(11);
      this.setColor(card.color);
      this.doc.text(card.value, x + 3, startY + 15);
    });

    this.y = startY + 24;
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  table(headers: string[], rows: string[][], colWidths?: number[]) {
    const contentW = this.pageW - this.marginX * 2;
    const widths = colWidths ?? headers.map(() => contentW / headers.length);
    const rowH = 8;

    // Header row
    this.setFill(COLOR.slate800);
    this.doc.rect(this.marginX, this.y, contentW, rowH, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(7);
    this.setColor(COLOR.amber);

    let colX = this.marginX;
    headers.forEach((h, i) => {
      this.doc.text(h, colX + 2, this.y + 5.5);
      colX += widths[i];
    });
    this.y += rowH;

    // Data rows
    rows.forEach((row, ri) => {
      this.checkPage(rowH + 2);
      if (ri % 2 === 0) {
        this.setFill(COLOR.surface);
        this.doc.rect(this.marginX, this.y, contentW, rowH, 'F');
      }

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(6.5);
      this.setColor(COLOR.text);
      colX = this.marginX;
      row.forEach((cell, ci) => {
        const cellStr = String(cell).substring(0, 45);
        this.doc.text(cellStr, colX + 2, this.y + 5.5);
        colX += widths[ci];
      });
      this.y += rowH;
    });

    this.y += 4;
  }

  // ── Highlighted Block ───────────────────────────────────────────────────────
  highlightBlock(text: string, colorHex: string = COLOR.amber, prefix = '•') {
    this.checkPage(14);
    const [r, g, b] = hexToRgb(colorHex);
    this.doc.setFillColor(r, g, b, 0.08);
    this.setDraw(colorHex);
    this.doc.setLineWidth(0.2);
    this.doc.roundedRect(this.marginX, this.y, this.pageW - this.marginX * 2, 10, 2, 2, 'FD');

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7.5);
    this.setColor(COLOR.text);
    const lines = this.doc.splitTextToSize(`${prefix}  ${text}`, this.pageW - this.marginX * 2 - 6) as string[];
    this.doc.text(lines[0], this.marginX + 3, this.y + 6.5);
    this.y += 13;
  }

  // ── Score Bar ───────────────────────────────────────────────────────────────
  scoreBar(label: string, score: number) {
    this.checkPage(12);
    const barW = this.pageW - this.marginX * 2;
    const fillW = (score / 100) * (barW - 40);
    const barColor = score >= 80 ? COLOR.emerald : score >= 50 ? COLOR.amber : COLOR.rose;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.setColor(COLOR.text);
    this.doc.text(label, this.marginX, this.y + 4);

    // Background track
    this.setFill(COLOR.slate800);
    this.doc.roundedRect(this.marginX + 40, this.y, barW - 40, 5, 1, 1, 'F');

    // Filled portion
    this.setFill(barColor);
    if (fillW > 0) {
      this.doc.roundedRect(this.marginX + 40, this.y, fillW, 5, 1, 1, 'F');
    }

    // Score text
    this.doc.setFont('helvetica', 'bold');
    this.setColor(barColor);
    this.doc.text(`${score}%`, this.pageW - this.marginX + 2, this.y + 4, { align: 'right' });

    this.y += 10;
  }

  // ── Footer Bar ──────────────────────────────────────────────────────────────
  footer() {
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.setDraw(COLOR.slate800);
      this.doc.setLineWidth(0.3);
      this.doc.line(this.marginX, this.pageH - 14, this.pageW - this.marginX, this.pageH - 14);

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(6.5);
      this.setColor(COLOR.muted);
      this.doc.text(
        `MAAT Studio AI - Document Confidentiel - Généré le ${new Date().toLocaleDateString('fr-FR')}`,
        this.marginX,
        this.pageH - 9
      );
      this.doc.text(`Page ${i} / ${totalPages}`, this.pageW - this.marginX, this.pageH - 9, { align: 'right' });

      // Bottom gold line
      this.setFill(COLOR.amber);
      this.doc.rect(0, this.pageH - 1.5, this.pageW, 1.5, 'F');
    }
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  save(filename: string) {
    this.footer();
    this.doc.save(filename);
  }
}

// ─── Public Export Functions ──────────────────────────────────────────────────

export function exportMissionPDF(mission: Mission) {
  const pdf = new MaatPDF();
  const now = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  pdf.headerBar(
    mission.title,
    `Mission ${mission.category.toUpperCase()} • Créée le ${mission.createdAt}`,
    now
  );

  // KPI Metrics
  pdf.sectionHeader('Indicateurs Clés de la Mission');
  pdf.metricCards([
    { label: 'Progression', value: `${mission.progress}%`, color: COLOR.amber },
    { label: 'Confiance IA', value: `${mission.confidenceScore}%`, color: COLOR.emerald },
    { label: 'Budget Alloué', value: `$${mission.budget.toLocaleString()}`, color: COLOR.cyan },
    { label: 'Budget Dépensé', value: `$${mission.spentBudget.toLocaleString()}`, color: COLOR.rose },
  ]);

  // Objective
  pdf.sectionHeader('Objectif Stratégique');
  pdf.checkPage(20);
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(8.5);
  pdf.setColor(COLOR.text);
  const objLines = pdf.doc.splitTextToSize(mission.objective, pdf.pageW - pdf.marginX * 2) as string[];
  pdf.doc.text(objLines, pdf.marginX, pdf.y);
  pdf.y += objLines.length * 5 + 6;

  // Plan Steps
  pdf.sectionHeader('Plan d\'Exécution 6-Couches');
  pdf.table(
    ['Département', 'Action', 'Agent', 'Statut'],
    mission.planSteps.map(s => [
      s.department,
      s.action.substring(0, 40),
      s.assignedAgent,
      s.status === 'completed' ? '✓ Terminé' : s.status === 'in_progress' ? '→ En cours' : '○ En attente'
    ]),
    [28, 75, 40, 25]
  );

  // Constraints
  if (mission.constraints.length > 0) {
    pdf.sectionHeader('Contraintes & Règles');
    mission.constraints.forEach(c => pdf.highlightBlock(c, COLOR.amber));
  }

  // Learnings
  if (mission.learnings.length > 0) {
    pdf.sectionHeader('Apprentissages IA');
    mission.learnings.forEach(l => pdf.highlightBlock(l, COLOR.emerald, '✓'));
  }

  pdf.save(`MAAT_Mission_${mission.title.replace(/\s+/g, '_').substring(0, 40)}.pdf`);
}

export function exportHealthReportPDF(
  systemHealth: SystemHealth,
  founderConfig: FounderBrainConfig,
  companyConfig: CompanyBrainConfig,
  missions: Mission[],
  agents: Agent[]
) {
  const pdf = new MaatPDF();
  const now = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  pdf.headerBar(
    'Rapport de Santé Exécutif',
    `Organisation : ${companyConfig.companyName || 'MAAT Studio AI'} • Directeur : ${founderConfig.founderName || 'Fondateur'}`,
    now
  );

  // Global Score
  pdf.sectionHeader('Score de Santé Globale du Système');
  pdf.metricCards([
    { label: 'Santé Globale', value: `${systemHealth.overallHealth}%`, color: systemHealth.overallHealth >= 80 ? COLOR.emerald : systemHealth.overallHealth >= 50 ? COLOR.amber : COLOR.rose },
    { label: 'Missions Actives', value: String(missions.filter(m => m.status === 'active').length), color: COLOR.cyan },
    { label: 'Directeurs IA', value: String(agents.length), color: COLOR.amber },
    { label: 'Missions Totales', value: String(missions.length), color: COLOR.text },
  ]);

  // Score Breakdown
  pdf.sectionHeader('Analyse par Axe Stratégique');
  pdf.scoreBar('Stratégie & Direction', systemHealth.strategicScore);
  pdf.scoreBar('Contenu & Marketing', systemHealth.contentScore);
  pdf.scoreBar('SEO & Visibilité', systemHealth.seoScore);
  pdf.scoreBar('Conversion & Pipeline', systemHealth.conversionScore);
  pdf.scoreBar('Automatisation IA', systemHealth.automationScore);
  pdf.scoreBar('Cohérence de Marque', systemHealth.brandConsistency);
  pdf.y += 4;

  // Founder Brain Summary
  if (founderConfig.founderName) {
    pdf.sectionHeader('Configuration Founder Brain™');
    pdf.doc.setFont('helvetica', 'normal');
    pdf.doc.setFontSize(8);
    pdf.setColor(COLOR.text);

    const fields = [
      ['Dirigeant', founderConfig.founderName],
      ['Vision', founderConfig.visionStatement || 'Non renseigné'],
      ['Style Stratégique', founderConfig.strategicStyle || 'Non renseigné'],
      ['Tolérance Risque', founderConfig.riskTolerance],
    ];
    fields.forEach(([label, value]) => {
      pdf.checkPage(10);
      pdf.doc.setFont('helvetica', 'bold');
      pdf.setColor(COLOR.amber);
      pdf.doc.text(`${label} :`, pdf.marginX, pdf.y);
      pdf.doc.setFont('helvetica', 'normal');
      pdf.setColor(COLOR.text);
      const lines = pdf.doc.splitTextToSize(value, pdf.pageW - pdf.marginX * 2 - 30) as string[];
      pdf.doc.text(lines, pdf.marginX + 32, pdf.y);
      pdf.y += lines.length * 5 + 3;
    });
    pdf.y += 4;
  }

  // Missions Table
  if (missions.length > 0) {
    pdf.checkPage(30);
    pdf.sectionHeader(`Portefeuille de Missions (${missions.length})`);
    pdf.table(
      ['Mission', 'Statut', 'Progression', 'Budget', 'Confiance'],
      missions.map(m => [
        m.title.substring(0, 35),
        m.status,
        `${m.progress}%`,
        `$${m.budget.toLocaleString()}`,
        `${m.confidenceScore}%`
      ]),
      [60, 22, 20, 25, 20]
    );
  }

  pdf.save(`MAAT_Rapport_Sante_Executive_${now.replace(/\s+/g, '_')}.pdf`);
}

export function exportCRMContactPDF(contact: CRMContact) {
  const pdf = new MaatPDF();
  const now = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  pdf.headerBar(
    `Fiche Contact : ${contact.name}`,
    `${contact.company} • ${contact.industry}`,
    now
  );

  // AI Scores
  pdf.sectionHeader('Scores d\'Analyse IA');
  pdf.metricCards([
    { label: 'Score Qualification', value: `${contact.aiAnalysis.qualificationScore}%`, color: COLOR.emerald },
    { label: 'Intention Achat', value: `${contact.aiAnalysis.buyerIntentScore}%`, color: COLOR.amber },
    { label: 'Budget Estimé', value: `$${contact.estimatedBudget.toLocaleString()}`, color: COLOR.cyan },
    { label: 'Statut Pipeline', value: contact.status.toUpperCase(), color: COLOR.text },
  ]);

  // Contact Details
  pdf.sectionHeader('Informations de Contact');
  const details = [
    ['Email', contact.email],
    ['Téléphone', contact.phone],
    ['Entreprise', contact.company],
    ['Secteur', contact.industry],
    ['Dernier Contact', contact.lastContactDate],
    ['Agent Recommandé', contact.aiAnalysis.recommendedAgent],
  ];
  details.forEach(([label, value]) => {
    pdf.checkPage(10);
    pdf.doc.setFont('helvetica', 'bold');
    pdf.doc.setFontSize(7.5);
    pdf.setColor(COLOR.amber);
    pdf.doc.text(`${label} :`, pdf.marginX, pdf.y);
    pdf.doc.setFont('helvetica', 'normal');
    pdf.setColor(COLOR.text);
    pdf.doc.text(value, pdf.marginX + 36, pdf.y);
    pdf.y += 8;
  });
  pdf.y += 4;

  // Notes
  if (contact.notes) {
    pdf.sectionHeader('Notes & Contexte');
    const noteLines = pdf.doc.splitTextToSize(contact.notes, pdf.pageW - pdf.marginX * 2) as string[];
    pdf.doc.setFont('helvetica', 'normal');
    pdf.doc.setFontSize(8);
    pdf.setColor(COLOR.text);
    pdf.doc.text(noteLines, pdf.marginX, pdf.y);
    pdf.y += noteLines.length * 5 + 6;
  }

  // Key Insights
  pdf.sectionHeader('Analyses Clés du Conseil IA');
  contact.aiAnalysis.keyInsights.forEach(insight => pdf.highlightBlock(insight, COLOR.cyan, '→'));

  // Next Action
  pdf.sectionHeader('Prochaine Action Recommandée');
  pdf.highlightBlock(contact.aiAnalysis.nextAction, COLOR.emerald, '✓');

  pdf.save(`MAAT_Contact_${contact.name.replace(/\s+/g, '_')}.pdf`);
}

export function exportSimulationPDF(scenario: SimulationScenario) {
  const pdf = new MaatPDF();
  const now = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  pdf.headerBar(
    `Simulation ROI : ${scenario.title}`,
    `Moteur What-If Engine™ • Variable : ${scenario.variable}`,
    now
  );

  // KPIs
  pdf.sectionHeader('Indicateurs Financiers Projetés');
  pdf.metricCards([
    { label: 'ROI Estimé', value: `${scenario.estimatedROI}x`, color: COLOR.emerald },
    { label: 'Niveau de Risque', value: scenario.riskLevel, color: scenario.riskLevel === 'Faible' ? COLOR.emerald : scenario.riskLevel === 'Modéré' ? COLOR.amber : COLOR.rose },
    { label: 'Confiance', value: `${scenario.confidenceScore}%`, color: COLOR.cyan },
  ]);

  // Projections
  pdf.sectionHeader('Projections par Axe');
  pdf.table(
    ['Axe', 'Projection'],
    [
      ['Augmentation de Revenus', scenario.projections.revenueIncrease],
      ['Acquisition Client', scenario.projections.customerAcquisition],
      ['Délai de Rentabilité', scenario.projections.timeline],
    ],
    [70, 100]
  );

  // Description
  pdf.sectionHeader('Description du Scénario');
  const descLines = pdf.doc.splitTextToSize(scenario.description, pdf.pageW - pdf.marginX * 2) as string[];
  pdf.doc.setFont('helvetica', 'normal');
  pdf.doc.setFontSize(8.5);
  pdf.setColor(COLOR.text);
  pdf.doc.text(descLines, pdf.marginX, pdf.y);
  pdf.y += descLines.length * 5 + 8;

  // Recommendation
  pdf.sectionHeader('Recommandation du Decision Engine™');
  pdf.highlightBlock(scenario.recommendation, COLOR.amber, '★');

  pdf.save(`MAAT_Simulation_${scenario.title.replace(/\s+/g, '_').substring(0, 40)}.pdf`);
}

export function exportAuditReportPDF(
  report: ExecutiveAuditReport,
  companyName: string,
  founderName: string
) {
  const pdf = new MaatPDF();
  const now = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  pdf.headerBar(
    'Audit Stratégique Exécutif 360°',
    `${companyName} • Fondateur : ${founderName} • Généré le ${report.generatedAt}`,
    now
  );

  // Global Score
  pdf.sectionHeader('Score Global de l\'Organisation');
  const scoreColor = report.overallScore >= 80 ? COLOR.emerald : report.overallScore >= 50 ? COLOR.amber : COLOR.rose;
  pdf.metricCards([
    { label: 'Score Exécutif Global', value: `${report.overallScore}/100`, color: scoreColor },
    { label: 'Alignement Stratégique', value: `${report.scores.strategicAlignment}%`, color: COLOR.amber },
    { label: 'Conversion Commerciale', value: `${report.scores.commercialConversion}%`, color: COLOR.cyan },
    { label: 'Efficacité Financière', value: `${report.scores.financialEfficiency}%`, color: COLOR.emerald },
  ]);

  // Agent Diagnostics
  pdf.sectionHeader('Diagnostic du Conseil d\'Administration IA');
  pdf.table(
    ['Directeur', 'Role', 'Statut', 'Verdict'],
    report.agentDiagnostics.map(d => [
      d.agentName,
      d.role.substring(0, 30),
      d.status === 'optimal' ? '✓ Optimal' : d.status === 'warning' ? '⚠ Attention' : '✗ Critique',
      d.quote.substring(0, 40)
    ]),
    [38, 45, 20, 60]
  );

  // Bottlenecks
  if (report.bottlenecks.length > 0) {
    pdf.sectionHeader('Goulots d\'Étranglement Détectés');
    report.bottlenecks.forEach(b => {
      const color = b.severity === 'Faible' ? COLOR.emerald : b.severity === 'Modéré' ? COLOR.amber : COLOR.rose;
      pdf.highlightBlock(`[${b.severity}] ${b.issue} - Impact : ${b.impact}`, color, '⚠');
    });
  }

  // Action Plan
  if (report.actionPlan.length > 0) {
    pdf.sectionHeader('Plan d\'Action Prioritaire');
    pdf.table(
      ['Action', 'Département', 'ROI Estimé', 'Priorité'],
      report.actionPlan.map(a => [
        a.title.substring(0, 40),
        a.targetDepartment,
        a.estimatedROI,
        a.priority
      ]),
      [70, 32, 25, 20]
    );
  }

  pdf.save(`MAAT_Audit_Executif_${companyName.replace(/\s+/g, '_')}_${now.replace(/\s+/g, '_')}.pdf`);
}

export function exportDecisionLogPDF(logs: DecisionLog[]) {
  const pdf = new MaatPDF();
  const now = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  pdf.headerBar(
    'Journal des Décisions IA',
    `${logs.length} décisions traçables - Exporté le ${now}`,
    now
  );

  pdf.sectionHeader(`Registre Complet (${logs.length} Entrées)`);
  pdf.table(
    ['Horodatage', 'Agent', 'Décision', 'Confiance', 'Statut'],
    logs.map(l => [
      l.timestamp,
      l.agentName,
      l.title.substring(0, 40),
      `${l.confidenceScore}%`,
      l.status
    ]),
    [25, 30, 72, 18, 20]
  );

  pdf.save(`MAAT_Journal_Decisions_${now.replace(/\s+/g, '_')}.pdf`);
}

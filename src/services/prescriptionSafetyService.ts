import { Medication, Patient, PrescriptionLine, SafetyAlert } from '../types/medical';

export class PrescriptionSafetyEngine {
  /**
   * Analyse complète de la sécurité de prescription :
   * 1. Allergies du patient
   * 2. Antécédents / Pathologies du patient
   * 3. Interactions médicamenteuses croisées (Prescription actuelle + Traitements au long cours)
   */
  static analyze(
    prescribedLines: PrescriptionLine[],
    patient: Patient | null
  ): SafetyAlert[] {
    const alerts: SafetyAlert[] = [];
    if (!prescribedLines.length) return alerts;

    const prescribedMeds = prescribedLines.map((l) => l.medication);
    // Combine current prescription with patient's ongoing baseline treatments
    const allMedNamesAndDcis = [
      ...prescribedMeds.map((m) => `${m.name} ${m.dci}`.toLowerCase()),
      ...(patient?.ongoingTreatments || []).map((t) => t.toLowerCase()),
    ];

    prescribedLines.forEach((line) => {
      const med = line.medication;
      const medText = `${med.name} ${med.dci}`.toLowerCase();

      // 1. ALLERGY CHECKS
      if (patient?.allergies?.length) {
        patient.allergies.forEach((allergy) => {
          const allergyLower = allergy.toLowerCase();

          // Penicillin / Betalactams
          if (
            (allergyLower.includes('pénicilline') || allergyLower.includes('penicilline') || allergyLower.includes('bêtalactamine') || allergyLower.includes('betalactamine')) &&
            (medText.includes('amoxicilline') || medText.includes('augmentin') || medText.includes('clavulanique') || medText.includes('ampicilline') || medText.includes('ceftriaxone'))
          ) {
            alerts.push({
              id: `allergy-penicillin-${med.cis}`,
              level: 'ALLERGIE',
              title: 'Alerte Allergie Majeure : Pénicillines / Bêtalactamines',
              culpritMedication: med.name,
              conflictingEntity: `Allergie connue du patient : "${allergy}"`,
              description: `Le patient présente une allergie répertoriée aux pénicillines/bêtalactamines. Risque élevé de choc anaphylactique ou de toxidermie sévère.`,
              recommendation: 'Contre-indication absolue. Remplacer par un macrolide (ex: Azithromycine, Clarithromycine) ou une fluoroquinolone selon l\'antibiogramme.'
            });
          }

          // Aspirin / NSAIDs
          if (
            (allergyLower.includes('aspirine') || allergyLower.includes('ains') || allergyLower.includes('anti-inflammatoire')) &&
            (medText.includes('ibuprof') || medText.includes('kardegic') || medText.includes('aspirin') || medText.includes('kétoprof') || medText.includes('naprox'))
          ) {
            alerts.push({
              id: `allergy-ains-${med.cis}`,
              level: 'ALLERGIE',
              title: 'Alerte Allergie : Dérivés salicylés & AINS',
              culpritMedication: med.name,
              conflictingEntity: `Allergie patient : "${allergy}"`,
              description: 'Risque de réaction d\'hypersensibilité immédiate, bronchospasme sévère (syndrome de Widal) ou angioedème.',
              recommendation: 'Privilégier le Paracétamol en 1ère intention ou un antalgique de palier II.'
            });
          }

          // Paracetamol
          if (allergyLower.includes('paracétamol') || allergyLower.includes('paracetamol')) {
            if (medText.includes('paracétamol') || medText.includes('doliprane') || medText.includes('efferalgan') || medText.includes('dafalgan')) {
              alerts.push({
                id: `allergy-paracetamol-${med.cis}`,
                level: 'ALLERGIE',
                title: 'Alerte Allergie : Paracétamol',
                culpritMedication: med.name,
                conflictingEntity: `Allergie patient : "${allergy}"`,
                description: 'Antécédent d\'intolérance ou d\'hypersensibilité documentée au paracétamol.',
                recommendation: 'Prescrire une alternative antalgique adaptée selon l\'intensité de la douleur.'
              });
            }
          }
        });
      }

      // 2. PATHOLOGY / MEDICAL HISTORY CONTRAINDICATIONS
      if (patient?.medicalHistory?.length) {
        patient.medicalHistory.forEach((condition) => {
          const condLower = condition.toLowerCase();

          // Renal Failure / Insuffisance Rénale
          if (condLower.includes('rénale') || condLower.includes('renale') || condLower.includes('rein')) {
            if (medText.includes('ibuprof') || medText.includes('kétoprof') || medText.includes('ains')) {
              alerts.push({
                id: `ci-renal-ains-${med.cis}`,
                level: 'CONTRE_INDICATION',
                title: 'Contre-indication : Insuffisance Rénale & AINS',
                culpritMedication: med.name,
                conflictingEntity: `Terrain : ${condition}`,
                description: 'Les anti-inflammatoires non stéroïdiens provoquent une vasoconstriction de l\'artériole afférente glomérulaire, risquant de précipiter une insuffisance rénale aiguë.',
                recommendation: 'Éviter les AINS. Utiliser le Paracétamol ou un topique local.'
              });
            }
            if (medText.includes('metformine')) {
              alerts.push({
                id: `ci-renal-metformine-${med.cis}`,
                level: 'PRECAUTION',
                title: 'Surveillance requise : Metformine & Fonction Rénale',
                culpritMedication: med.name,
                conflictingEntity: `Terrain : ${condition}`,
                description: 'Risque d\'accumulation de metformine et d\'acidose lactique sévère si DFG < 30 mL/min.',
                recommendation: 'Vérifier la clairance de la créatinine (DFG-CKD-EPI) récente et adapter la posologie.'
              });
            }
          }

          // Gastroduodenal Ulcer / Hémorragie digestive
          if (condLower.includes('ulcère') || condLower.includes('ulcere') || condLower.includes('gastrite') || condLower.includes('hémorragie digestive')) {
            if (medText.includes('ibuprof') || medText.includes('aspirin') || medText.includes('kardegic')) {
              alerts.push({
                id: `ci-ulcer-ains-${med.cis}`,
                level: 'CONTRE_INDICATION',
                title: 'Contre-indication : Antécédent d\'Ulcère Gastro-Duodénal',
                culpritMedication: med.name,
                conflictingEntity: `Pathologie : ${condition}`,
                description: 'Risque élevé de récidive ulcéreuse, perforation ou hémorragie digestive haute.',
                recommendation: 'Si la prescription est formellement requise, associer systématiquement un IPP (Ésoméprazole 20mg).'
              });
            }
          }

          // Hypertension Artérielle
          if (condLower.includes('hypertension') || condLower.includes('hta')) {
            if (medText.includes('ibuprof') || medText.includes('célestène') || medText.includes('prednisone') || medText.includes('cortancyl')) {
              alerts.push({
                id: `ci-hta-cortico-${med.cis}`,
                level: 'PRECAUTION',
                title: 'Précaution d\'emploi : HTA & Rétention Hydrosodée',
                culpritMedication: med.name,
                conflictingEntity: `Pathologie : ${condition}`,
                description: 'Peut provoquer une déstabilisation tensionnelle par rétention hydrosodée.',
                recommendation: 'Surveiller l\'auto-mesure tensionnelle au cours du traitement.'
              });
            }
          }

          // Asthme
          if (condLower.includes('asthme')) {
            if (medText.includes('ibuprof') || medText.includes('aspirin') || medText.includes('kardegic')) {
              alerts.push({
                id: `ci-asthme-aspirin-${med.cis}`,
                level: 'PRECAUTION',
                title: 'Précaution : Asthme & AINS / Dérivés salicylés',
                culpritMedication: med.name,
                conflictingEntity: `Pathologie : ${condition}`,
                description: 'Risque de bronchospasme aigu chez les patients asthmatiques (triade de Widal).',
                recommendation: 'S\'assurer de la bonne tolérance antérieure des AINS ou privilégier le paracétamol.'
              });
            }
          }
        });
      }

      // 3. DRUG-DRUG INTERACTIONS (Interactions médicamenteuses)
      // Check against other lines in current prescription + patient's ongoing baseline medications
      const hasAnticoagulant = allMedNamesAndDcis.some((txt) =>
        txt.includes('eliquis') || txt.includes('apixaban') || txt.includes('xarelto') || txt.includes('rivaroxaban') || txt.includes('pradaxa') || txt.includes('antivitamine k') || txt.includes('previscan') || txt.includes('sintrom')
      );
      const hasAntiplatelet = allMedNamesAndDcis.some((txt) =>
        txt.includes('kardegic') || txt.includes('plavix') || txt.includes('clopidogrel') || txt.includes('aspirine')
      );
      const hasNsaid = medText.includes('ibuprof') || medText.includes('kétoprof') || medText.includes('diclofénac');
      const hasAceInhibitor = allMedNamesAndDcis.some((txt) =>
        txt.includes('ramipril') || txt.includes('enalapril') || txt.includes('perindopril') || txt.includes('lisinopril')
      );

      // NSAID + Anticoagulant (e.g. Ibuprofen + Eliquis)
      if (hasNsaid && (hasAnticoagulant || hasAntiplatelet)) {
        // Prevent duplicate alert
        if (!alerts.some((a) => a.id === `ddi-nsaid-anticoag`)) {
          alerts.push({
            id: `ddi-nsaid-anticoag`,
            level: 'CONTRE_INDICATION',
            title: 'Interaction Majeure : AINS + Anticoagulant / Antiagrégant',
            culpritMedication: med.name,
            conflictingEntity: hasAnticoagulant ? 'Anticoagulant (ex: Eliquis / Apixaban)' : 'Antiagrégant (Kardegic / Plavix)',
            description: 'Association formellement déconseillée : majoration synergique et dramatique du risque hémorragique digestif et intracrânien.',
            recommendation: 'Arrêter l\'AINS. Remplacer impérativement par Paracétamol ou palier II (Tramadol faible dose).'
          });
        }
      }

      // ACE Inhibitor + NSAID (e.g. Ramipril + Ibuprofène)
      if (hasNsaid && hasAceInhibitor) {
        if (!alerts.some((a) => a.id === `ddi-nsaid-ie`)) {
          alerts.push({
            id: `ddi-nsaid-ie`,
            level: 'ASSOCIATION_DECONSEILLEE',
            title: 'Interaction Déconseillée : IEC + AINS',
            culpritMedication: med.name,
            conflictingEntity: 'Inhibiteur de l\'Enzyme de Conversion (Ramipril)',
            description: 'Risque de défaillance rénale aiguë par baisse brutale de la filtration glomérulaire, et atténuation de l\'efficacité antihypertensive.',
            recommendation: 'Hydratation abondante, surveillance de la créatininémie et de la kaliémie.'
          });
        }
      }

      // Paracetamol overdosage check (Doliprane + Tramadol/Paracetamol)
      const countParacetamol = prescribedLines.filter((l) =>
        `${l.medication.name} ${l.medication.dci}`.toLowerCase().includes('paracétamol')
      ).length;

      if (countParacetamol > 1 && !alerts.some((a) => a.id === 'ddi-paracetamol-duplicate')) {
        alerts.push({
          id: 'ddi-paracetamol-duplicate',
          level: 'ASSOCIATION_DECONSEILLEE',
          title: 'Cumul de Paracétamol Détecté',
          culpritMedication: med.name,
          conflictingEntity: 'Autre spécialité contenant du paracétamol',
          description: 'Attention : présence simultanée de plusieurs molécules renfermant du paracétamol. Risque élevé d\'hépatotoxicité aiguë par dépassement de la dose maximale de 4 g / 24h chez l\'adulte.',
          recommendation: 'Calculer la dose totale quotidienne de paracétamol ou supprimer l\'un des deux traitements.'
        });
      }
    });

    return alerts;
  }
}

import { Medication } from '../types/medical';

export const FRENCH_MEDICATIONS: Medication[] = [
  {
    cis: '65239103',
    name: 'DOLIPRANE 1000 mg, comprimé',
    dci: 'Paracétamol',
    dosage: '1000 mg',
    form: 'Comprimé',
    laboratory: 'OPELLA HEALTHCARE FRANCE',
    statusAmm: 'Commercialisée',
    atcClass: 'N02BE01',
    contraindications: ['Insuffisance hépatocellulaire sévère', 'Allergie au paracétamol'],
    cautions: ['Poids inférieur à 50 kg', 'Alcoolisme chronique', 'Dénutrition']
  },
  {
    cis: '67439121',
    name: 'DOLIPRANE 500 mg, gélule',
    dci: 'Paracétamol',
    dosage: '500 mg',
    form: 'Gélule',
    laboratory: 'OPELLA HEALTHCARE FRANCE',
    statusAmm: 'Commercialisée',
    atcClass: 'N02BE01',
    contraindications: ['Insuffisance hépatocellulaire sévère', 'Allergie au paracétamol']
  },
  {
    cis: '60234125',
    name: 'AMOXICILLINE BIOGARAN 1 g, comprimé dispersible',
    dci: 'Amoxicilline',
    dosage: '1 g',
    form: 'Comprimé dispersible',
    laboratory: 'BIOGARAN',
    statusAmm: 'Commercialisée',
    atcClass: 'J01CA04',
    contraindications: ['Allergie aux bêtalactamines', 'Allergie à la pénicilline', 'Mononucléose infectieuse'],
    cautions: ['Insuffisance rénale', 'Épilepsie']
  },
  {
    cis: '60341890',
    name: 'AMOXICILLINE / ACIDE CLAVULANIQUE SANDOZ 1 g/125 mg, poudre pour suspension buvable',
    dci: 'Amoxicilline / Acide clavulanique',
    dosage: '1 g / 125 mg',
    form: 'Poudre pour suspension',
    laboratory: 'SANDOZ',
    statusAmm: 'Commercialisée',
    atcClass: 'J01CR02',
    contraindications: ['Allergie aux bêtalactamines', 'Allergie à la pénicilline', 'Antécédent d\'ictère ou d\'atteinte hépatique sous amox/clav'],
    cautions: ['Insuffisance rénale modérée à sévère']
  },
  {
    cis: '68741250',
    name: 'IBUPROFENE VIATRIS CONSEIL 400 mg, comprimé pelliculé',
    dci: 'Ibuprofène',
    dosage: '400 mg',
    form: 'Comprimé pelliculé',
    laboratory: 'VIATRIS SANTE',
    statusAmm: 'Commercialisée',
    atcClass: 'M01AE01',
    contraindications: [
      'Grossesse à partir du 6ème mois',
      'Ulcère gastroduodénal évolutif',
      'Insuffisance cardiaque sévère',
      'Insuffisance rénale sévère',
      'Insuffisance hépatique sévère',
      'Asthme déclenché par AINS ou aspirine'
    ],
    cautions: ['Hypertension artérielle', 'Antécédent d\'hémorragie digestive', 'Sujet âgé']
  },
  {
    cis: '63124567',
    name: 'ELIQUIS 5 mg, comprimé pelliculé',
    dci: 'Apixaban',
    dosage: '5 mg',
    form: 'Comprimé pelliculé',
    laboratory: 'BRISTOL-MYERS SQUIBB / PFIZER',
    statusAmm: 'Commercialisée',
    atcClass: 'B01AF02',
    contraindications: [
      'Saignement évolutif cliniquement significatif',
      'Atteinte hépatique associée à une coagulopathie',
      'Lésion ou affection à risque significatif de saignement majeur',
      'Traitement concomitant par d\'autres anticoagulants'
    ],
    cautions: ['Insuffisance rénale sévère (clairance < 15 ml/min)', 'Interventions chirurgicales programmées']
  },
  {
    cis: '64891234',
    name: 'KARDEGIC 75 mg, poudre pour solution buvable en sachet-dose',
    dci: 'Acétylsalicylate de dl-lysine (Aspirine)',
    dosage: '75 mg',
    form: 'Poudre orale en sachet',
    laboratory: 'SANOFI WINTHROP INDUSTRIE',
    statusAmm: 'Commercialisée',
    atcClass: 'B01AC06',
    contraindications: [
      'Ulcère gastro-duodénal en évolution',
      'Maladie hémorragique constitutionnelle ou acquise',
      'Risque hémorragique',
      'Allergie aux dérivés salicylés'
    ],
    cautions: ['Asthme', 'Goutte', 'Insuffisance rénale modérée']
  },
  {
    cis: '65543210',
    name: 'RAMIPRIL TEVA 5 mg, comprimé sécable',
    dci: 'Ramipril',
    dosage: '5 mg',
    form: 'Comprimé sécable',
    laboratory: 'TEVA SANTE',
    statusAmm: 'Commercialisée',
    atcClass: 'C09AA05',
    contraindications: [
      'Antécédent d\'angio-œdème lié à un IEC',
      'Sténose bilatérale de l\'artère rénale',
      '2ème et 3ème trimestres de grossesse',
      'Association avec aliskirène chez diabétiques'
    ],
    cautions: ['Hyperkaliémie', 'Insuffisance rénale', 'Déplétion hydrosodée']
  },
  {
    cis: '66123987',
    name: 'AMLODIPINE BIOGARAN 5 mg, gélule',
    dci: 'Amlodipine',
    dosage: '5 mg',
    form: 'Gélule',
    laboratory: 'BIOGARAN',
    statusAmm: 'Commercialisée',
    atcClass: 'C08CA01',
    contraindications: [
      'Hypotension artérielle sévère',
      'Choc cardiogénique',
      'Obstruction de la voie d\'éjection du ventricule gauche'
    ],
    cautions: ['Insuffisance cardiaque congestive', 'Insuffisance hépatique']
  },
  {
    cis: '67890123',
    name: 'METFORMINE EG 1000 mg, comprimé pelliculé sécable',
    dci: 'Metformine',
    dosage: '1000 mg',
    form: 'Comprimé pelliculé sécable',
    laboratory: 'EG LABO',
    statusAmm: 'Commercialisée',
    atcClass: 'A10BA02',
    contraindications: [
      'Acidose métabolique aiguë',
      'Insuffisance rénale sévère (DFG < 30 ml/min)',
      'Déshydratation, infection sévère, choc',
      'Insuffisance cardiaque décompensée ou respiratoire'
    ],
    cautions: ['Surveillance DFG semestrielle', 'Arrêt 48h avant injection produit de contraste iodé']
  },
  {
    cis: '68901245',
    name: 'INEXIUM 20 mg, comprimé gastro-résistant',
    dci: 'Ésoméprazole',
    dosage: '20 mg',
    form: 'Comprimé gastro-résistant',
    laboratory: 'ASTRAZENECA',
    statusAmm: 'Commercialisée',
    atcClass: 'A02BC05',
    contraindications: ['Allergie aux benzimidazoles substitués', 'Association au nelfinavir'],
    cautions: ['Carence en vitamine B12 lors de traitement prolongé', 'Ostéoporose']
  },
  {
    cis: '69012356',
    name: 'TAHOR 20 mg, comprimé pelliculé',
    dci: 'Atorvastatine',
    dosage: '20 mg',
    form: 'Comprimé pelliculé',
    laboratory: 'VIATRIS UPR',
    statusAmm: 'Commercialisée',
    atcClass: 'C10AA05',
    contraindications: [
      'Affections hépatiques évolutives ou élévation inexpliquée des transaminases',
      'Grossesse et allaitement',
      'Association au glecaprévir / pibrentasvir'
    ],
    cautions: ['Douleurs musculaires inexpliquées (rhabdomyolyse)', 'Consommation excessive d\'alcool']
  },
  {
    cis: '61234908',
    name: 'TRAMADOL / PARACETAMOL TEVA 37,5 mg / 325 mg, comprimé pelliculé',
    dci: 'Tramadol / Paracétamol',
    dosage: '37,5 mg / 325 mg',
    form: 'Comprimé pelliculé',
    laboratory: 'TEVA SANTE',
    statusAmm: 'Commercialisée',
    atcClass: 'N02AJ13',
    contraindications: [
      'Intoxication aiguë par l\'alcool, hypnotiques, analgésiques centraux',
      'Insuffisance hépatique sévère',
      'Épilepsie non contrôlée par un traitement',
      'Association avec les IMAO'
    ],
    cautions: ['Dépendance aux opioïdes', 'Traumatisme crânien récent', 'Association avec ISRS (syndrome sérotoninergique)']
  },
  {
    cis: '62345890',
    name: 'VENTOLINE 100 µg / dose, suspension pour inhalation',
    dci: 'Salbutamol',
    dosage: '100 µg',
    form: 'Flacon pressurisé avec valve doseuse',
    laboratory: 'GLAXOSMITHKLINE',
    statusAmm: 'Commercialisée',
    atcClass: 'R03AC02',
    contraindications: ['Hypersensibilité au salbutamol'],
    cautions: ['Hyperthyroïdie', 'Affections cardiovasculaires sévères', 'Diabète']
  },
  {
    cis: '63456789',
    name: 'SPASFON, comprimé enrobé',
    dci: 'Phloroglucinol / Triméthylphloroglucinol',
    dosage: '80 mg / 80 mg',
    form: 'Comprimé enrobé',
    laboratory: 'TEVA SANTE',
    statusAmm: 'Commercialisée',
    atcClass: 'A03AX12',
    contraindications: ['Allergie aux principes actifs'],
    cautions: ['Grossesse et allaitement (utilisation prudente)']
  },
  {
    cis: '64567890',
    name: 'LEVOTHYROX 75 µg, comprimé sécable',
    dci: 'Lévothyroxine sodique',
    dosage: '75 µg',
    form: 'Comprimé sécable',
    laboratory: 'MERCK SANTE',
    statusAmm: 'Commercialisée',
    atcClass: 'H03AA01',
    contraindications: ['Hyperthyroïdie non traitée', 'Insuffisance surrénalienne non traitée', 'Infarctus récent aigu'],
    cautions: ['Prise à jeun le matin 30 min avant le petit-déjeuner', 'Étroite marge thérapeutique']
  },
  {
    cis: '65678901',
    name: 'CELESTENE 2 mg, comprimé dispersible',
    dci: 'Bétaméthasone',
    dosage: '2 mg',
    form: 'Comprimé dispersible',
    laboratory: 'ORGANON FRANCE',
    statusAmm: 'Commercialisée',
    atcClass: 'H02AB01',
    contraindications: ['Tout état infectieux non contrôlé', 'Certaines viroses en évolution (hépatites, zona, varicelle)', 'Psychose non contrôlée'],
    cautions: ['Diabète (risque de décompensation)', 'Hypertension artérielle', 'Ulcère gastrique']
  },
  {
    cis: '66789012',
    name: 'ZYRTECSET 10 mg, comprimé pelliculé sécable',
    dci: 'Cétirizine dichlorhydrate',
    dosage: '10 mg',
    form: 'Comprimé pelliculé sécable',
    laboratory: 'UCB PHARMA',
    statusAmm: 'Commercialisée',
    atcClass: 'R06AE07',
    contraindications: ['Insuffisance rénale en phase terminale (DFG < 15 ml/min)'],
    cautions: ['Épilepsie', 'Rétention urinaire']
  }
];

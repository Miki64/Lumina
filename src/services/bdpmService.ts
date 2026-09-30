import { Medication } from '../types/medical';
import { FRENCH_MEDICATIONS } from '../data/frenchMedications';

export interface BdpmSearchResult {
  medication: Medication;
  source: 'bdpm_full_database' | 'local_verified';
}

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export class BdpmService {
  private static cachedDatabase: Medication[] | null = null;
  private static isFetching = false;

  /**
   * Charge l'intégralité de la Base de Données Publique des Médicaments (15 883 médicaments officiels ANSM)
   */
  static async loadFullDatabase(): Promise<Medication[]> {
    if (this.cachedDatabase && this.cachedDatabase.length > 0) {
      return this.cachedDatabase;
    }

    if (this.isFetching) {
      // Attendre quelques ms si un chargement est en cours
      await new Promise((r) => setTimeout(r, 200));
      if (this.cachedDatabase) return this.cachedDatabase;
    }

    this.isFetching = true;
    try {
      const response = await fetch('/data/bdpm_database.json');
      if (response.ok) {
        const data: Medication[] = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.cachedDatabase = data;
          this.isFetching = false;
          return data;
        }
      }
    } catch (e) {
      console.warn('Impossible de charger /data/bdpm_database.json, fallback sur base locale', e);
    }

    this.isFetching = false;
    this.cachedDatabase = FRENCH_MEDICATIONS;
    return FRENCH_MEDICATIONS;
  }

  /**
   * Recherche instantanée dans toute la base BDPM (15 883 médicaments)
   * Recherche par nom de marque, dénomination, DCI (substance active), code CIS ou laboratoire.
   */
  static async searchMedications(query: string, maxResults: number = 30): Promise<Medication[]> {
    const trimmed = query.trim();
    const cleanQuery = removeAccents(trimmed);

    const database = await this.loadFullDatabase();

    if (!cleanQuery || cleanQuery.length < 2) {
      // Retourner une sélection des médicaments usuels
      return database.slice(0, 10);
    }

    const matches: { med: Medication; score: number }[] = [];

    for (const med of database) {
      const cleanName = removeAccents(med.name);
      const cleanDci = removeAccents(med.dci || '');
      const cis = med.cis || '';

      let score = 0;

      // Correspondance exacte début de nom
      if (cleanName.startsWith(cleanQuery)) {
        score += 100;
      } else if (cleanName.includes(' ' + cleanQuery) || cleanName.includes(cleanQuery)) {
        score += 50;
      }

      // Correspondance DCI
      if (cleanDci.startsWith(cleanQuery)) {
        score += 80;
      } else if (cleanDci.includes(cleanQuery)) {
        score += 40;
      }

      // Code CIS
      if (cis.startsWith(cleanQuery)) {
        score += 90;
      } else if (cis.includes(cleanQuery)) {
        score += 30;
      }

      // Bonus si commercialisée
      if (med.statusAmm === 'Commercialisée') {
        score += 10;
      }

      if (score > 0) {
        matches.push({ med, score });
      }
    }

    // Tri par pertinence décroissante
    matches.sort((a, b) => b.score - a.score);

    return matches.slice(0, maxResults).map((m) => m.med);
  }
}

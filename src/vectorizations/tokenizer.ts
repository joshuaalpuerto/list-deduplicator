import { removeAccents } from './accents'

export const STOP_WORDS = [
  // Common English Legal Suffixes
  'inc', 'incorporated', 'inc.',
  'ltd', 'limited', 'ltd.',
  'llc', 'l.l.c.',
  'llp', 'l.l.p.',
  'corp', 'corporation', 'corp.',
  'co', 'company', 'co.',
  'plc', 'p.l.c.',
  'pc', 'p.c.', // Professional Corporation
  'pte', // Private Limited (common in Singapore/Asia)
  'pty', // Proprietary (common in Australia/South Africa)

  // Common International Legal Suffixes (often seen in Latin script)
  'gmbh', // German
  'ag',   // German/Swiss
  'ug',   // German
  's.a', 'sa', // French, Spanish, Portuguese (Société Anonyme / Sociedad Anónima)
  'sarl', // French (Société à Responsabilité Limitée)
  'sas',  // French (Société par Actions Simplifiée)
  's.l', 'sl', // Spanish/Portuguese (Sociedad Limitada)
  'ltda', // Portuguese/Spanish (Limitada)
  'ab',   // Swedish/Finnish (Aktiebolag)
  'as',   // Norwegian/Danish (Aksjeselskap/Aktieselskab)
  'oy',   // Finnish (Osakeyhtiö)
  's.r.o', 'sro', // Czech/Slovak (Společnost s Ručením Omezeným)
  'sp. z o.o', 'sp z o o', 'sp zoo', // Polish (Spółka z ograniczoną odpowiedzialnością)
  'kft',  // Hungarian (Korlátolt Felelősségű Társaság)
  'bv',   // Dutch (Besloten Vennootschap)
  'nv',   // Dutch/Belgian (Naamloze Vennootschap)
  'e.u.', 'e.u', // French (Entreprise Unipersonnelle) / German (eingetragener Unternehmer)
  'k.k.', 'kk', // Japanese (Kabushiki Kaisha - often anglicized)
  'g.k.', 'gk', // Japanese (Godo Kaisha)

  // Generic Business Terms (use with caution, ensure word boundary matching)
  'studios', 'studio',
  'games', 'game',
  'software', 'soft',
  'solutions',
  'systems', 'system',
  'technologies', 'technology', 'tech',
  'interactive',
  'entertainment',
  'digital',
  'media',
  'productions', 'production',
  'group',
  'holdings',
  'enterprises', 'enterprise',
  'ventures',
  'associates',
  'partners', 'partnership',
  'labs', 'lab',
  'works', 'workshop',
  'factory',
  'design',
  'arts',
  'publishing', 'publisher',
  'online',
  'international',
  'global',
  'network',
  'services',
  'consulting',
  'industries', 'industry',
  'development', 'developments', 'dev',
]
  // Sort by length descending to remove longer phrases first (e.g., "p l c" before "p c")
  .sort((a, b) => b.length - a.length);

/**
 * Tokenize a company name by normalizing it and splitting into words.
 * 
 * @param str - The input string to tokenize
 * @returns An array of tokens
 */
export function tokenizer(str: string): string[] {
  let normalizedText = stripNonASCII(str);
  normalizedText = removeAccents(normalizedText);
  normalizedText = normalizeName(normalizedText);

  const tokens = normalizedText.split(/\s+/) as string[]; // split into words

  // remove empty tokens
  // prevent adding garbage
  return tokens.filter(Boolean);
}

/**
 * Normalize a sting by converting to lowercase, replacing HTML entities,
 * replacing punctuation with spaces, and removing common suffixes (heuristic approach of identifying same entities)
 * 
 * @param str - The input string to normalize
 * @returns The normalized string
 */
export function normalizeName(str: string): string {
  let normalized = str.toLowerCase();
  normalized = normalized.replace(/&/g, '&'); // Basic HTML entity
  // Add more entity replacements if quick
  normalized = normalized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g, ' '); // Replace punctuation with space
  normalized = normalized.replace(/\s+/g, ' ').trim(); // Normalize multiple spaces to one

  // Remove stop words/suffixes
  const stopWordsRegex = new RegExp(`\\b(${STOP_WORDS.join('|')})\\b`, 'gi');
  normalized = normalized.replace(stopWordsRegex, '');

  normalized = normalized.replace(/\s+/g, ' ').trim(); // Clean up spaces again
  return normalized;
}

/**
 * Strip non-ASCII characters from a string
 * @param input - The input string to strip non-ASCII characters from
 * @returns The input string with all non-ASCII characters removed
 */
export function stripNonASCII(input: string): string {
  return input.replace(/[^\x00-\x7F]/g, '');
}
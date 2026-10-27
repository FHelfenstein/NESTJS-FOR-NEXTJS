import { generateRandomSuffix } from './generate-random-sufix.js';
import { slugify } from './slugify.js';

export function createSlugFromText(text: string) {
  const slug = slugify(text);
  return `${slug}-${generateRandomSuffix()}`;
}

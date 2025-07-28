import { DICTIONARY_UA } from "~/constants/dictionary.ua";

function translate<G extends keyof typeof DICTIONARY_UA, K extends keyof (typeof DICTIONARY_UA)[G]>(group: G, key: K): string {
  const dictionary = DICTIONARY_UA[group] as Record<string, string>;
  return dictionary[key as string] ?? (key as string);
}
// todo - think about cache translations
export default translate;

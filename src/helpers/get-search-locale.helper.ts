import { containEnLocale } from "./contain-en-locale.helper";
import { containRuLocale } from "./contain-ru-locale.helper";

export function getSearchLocale(str: string): string {
  const en: boolean = containEnLocale(str);
  const ru: boolean = containRuLocale(str);

  if (en && ru) return "none";
  if (en) return "en";
  if (ru) return "ru";
  return "none";
}

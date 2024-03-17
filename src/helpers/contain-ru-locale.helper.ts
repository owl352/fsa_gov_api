export function containRuLocale(str: string): boolean {
  const regex: RegExp = /[А-я]/;
  return regex.test(str);
}

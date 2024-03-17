export function containEnLocale(str: string): boolean {
  const regex: RegExp = /[A-z]/;
  return regex.test(str);
}

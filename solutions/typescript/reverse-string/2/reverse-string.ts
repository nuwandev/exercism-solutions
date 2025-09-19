export function reverse(str: string): string {
  let rev: string = '';
  for (let i = 0; i < str.length; i++) {
    rev = str.charAt(i) + rev;
  }
  return rev;
}

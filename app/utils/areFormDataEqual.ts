export function areFormDataEqual(a: FormData, b: FormData | null): boolean {
  if (!b) return false;

  for (const [key, value] of a.entries()) {
    if (b.get(key) !== value) {
      return false;
    }
  }

  for (const [key, value] of b.entries()) {
    if (a.get(key) !== value) {
      return false;
    }
  }

  return true;
}

export function shortenFirstName(firstName?: string) {
  return firstName ? `${firstName.charAt(0)}.` : "";
}

const REGEX = /^[a-z0-9]+$/i;

export default function isAlphanumeric(value: number | string): boolean {
  return REGEX.test(String(value));
}

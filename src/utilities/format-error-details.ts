export default function formatErrorDetails(details: string): string {
  const [firstLetter, ...rest] = details.split('').filter(
    (symbol: string): boolean => symbol !== '"',
  ).join('');

  return `${firstLetter.toUpperCase()}${rest.join('')}!`;
}

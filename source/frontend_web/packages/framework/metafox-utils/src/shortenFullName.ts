export default function shortenFullName(name: string): string {
  if (!name) return 'NA';

  const cs = name
    .split(/\s+/g)
    .splice(0, 2)
    .map(x => String.fromCodePoint(x.codePointAt(0)).toUpperCase());

  return 1 < name.length
    ? cs.join('')
    : Array.from(cs)
        .splice(0, 2)
        .map(x => x.toUpperCase())
        .join('');
}

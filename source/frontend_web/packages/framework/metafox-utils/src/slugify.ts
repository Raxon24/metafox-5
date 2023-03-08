/**
 * @type: service
 * name: slugify
 */
export default function slugify(name: string): string {
  return name.replace(/\s+/g, '-').toLowerCase();
}


export function sanitizeCity(city: string): string {
  return city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}
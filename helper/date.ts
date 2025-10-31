export function getPHDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 0, 0, 0) + 8 * 60 * 60 * 1000);
}

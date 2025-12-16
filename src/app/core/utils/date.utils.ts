export function getFirstDayOfMonth(date: Date = new Date()): Date {
  const firstDay = new Date(date);
  firstDay.setDate(1);
  firstDay.setHours(0, 0, 0, 0);
  return firstDay;
}

export function getLastDayOfMonth(date: Date = new Date()): Date {
  const lastDay = new Date(date);
  lastDay.setMonth(lastDay.getMonth() + 1);
  lastDay.setDate(0);
  lastDay.setHours(0, 0, 0, 0);
  return lastDay;
}

export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDate(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

export function createDate(year?: number, month?: number, day?: number): Date {
  const now = new Date();
  return new Date(
    year ?? now.getFullYear(),
    month ?? now.getMonth(),
    day ?? now.getDate()
  );
}

export function addDays(date: Date, days: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days
  );
}

export function getCurrentDateString(): string {
  return toISODateString(new Date());
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

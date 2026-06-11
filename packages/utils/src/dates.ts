export const IST = 'Asia/Kolkata';

export const toIST = (ts: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: IST,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts));

export const toISTDate = (ts: string): string =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, dateStyle: 'medium' }).format(new Date(ts));

export const nowIST = (): string => new Date().toISOString();

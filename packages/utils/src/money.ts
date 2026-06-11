export const toRupees = (paise: number): string =>
  `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export const toPaise = (rupees: number): number => Math.round(rupees * 100);

export const formatCurrency = (paise: number): string => toRupees(paise);

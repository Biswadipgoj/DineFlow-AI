import { describe, it, expect } from 'vitest';
import { gstInclusive, gstExclusive, invoiceNumber } from '../gst';

describe('gstInclusive', () => {
  it('18% rate: 11800 paise total', () => {
    const result = gstInclusive(11800, 18);
    expect(result.subtotal_paise).toBe(10000);
    expect(result.cgst_paise).toBe(900);
    expect(result.sgst_paise).toBe(900);
    expect(result.total_paise).toBe(11800);
  });

  it('5% rate: 10500 paise total', () => {
    const result = gstInclusive(10500, 5);
    expect(result.subtotal_paise).toBe(10000);
    expect(result.cgst_paise).toBe(250);
    expect(result.sgst_paise).toBe(250);
    expect(result.total_paise).toBe(10500);
  });

  it('0% rate: no GST', () => {
    const result = gstInclusive(10000, 0);
    expect(result.subtotal_paise).toBe(10000);
    expect(result.cgst_paise).toBe(0);
    expect(result.sgst_paise).toBe(0);
    expect(result.total_paise).toBe(10000);
  });
});

describe('gstExclusive', () => {
  it('18% rate on 10000 net', () => {
    const result = gstExclusive(10000, 18);
    expect(result.subtotal_paise).toBe(10000);
    expect(result.total_paise).toBe(11800);
    expect(result.cgst_paise + result.sgst_paise).toBe(1800);
  });
});

describe('invoiceNumber', () => {
  it('generates correct FY format for June (after April)', () => {
    const result = invoiceNumber(42, new Date('2025-06-01'));
    expect(result).toBe('DN/2025-26/0042');
  });

  it('generates correct FY format for January (before April)', () => {
    const result = invoiceNumber(1, new Date('2026-01-15'));
    expect(result).toBe('DN/2025-26/0001');
  });

  it('pads sequence to 4 digits', () => {
    const result = invoiceNumber(7, new Date('2025-04-01'));
    expect(result).toBe('DN/2025-26/0007');
  });
});

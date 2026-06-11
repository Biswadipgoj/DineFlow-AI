export interface GSTLine {
  subtotal_paise: number;
  cgst_paise: number;
  sgst_paise: number;
  total_paise: number;
}

export function gstInclusive(item_total_paise: number, rate: number): GSTLine {
  const base = Math.round(item_total_paise * 100 / (100 + rate));
  const gst  = item_total_paise - base;
  const half = Math.round(gst / 2);
  return { subtotal_paise: base, cgst_paise: half, sgst_paise: gst - half, total_paise: item_total_paise };
}

export function gstExclusive(net_paise: number, rate: number): GSTLine {
  const gst  = Math.round(net_paise * rate / 100);
  const half = Math.round(gst / 2);
  return { subtotal_paise: net_paise, cgst_paise: half, sgst_paise: gst - half, total_paise: net_paise + gst };
}

export function invoiceNumber(seq: number, date = new Date()): string {
  const m = date.getMonth();
  const y = date.getFullYear();
  const fy = m >= 3 ? `${y}-${String(y + 1).slice(-2)}` : `${y - 1}-${String(y).slice(-2)}`;
  return `DN/${fy}/${String(seq).padStart(4, '0')}`;
}

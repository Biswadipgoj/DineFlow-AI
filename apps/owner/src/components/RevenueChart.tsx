'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@dinenovaai/ui';
import { toRupees } from '@dinenovaai/utils/money';

const data = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
  revenue: Math.floor(Math.random() * 50000) + 20000,
}));

export default function RevenueChart() {
  return (
    <Card>
      <h3 className="text-h3 text-neutral-800 mb-4">Revenue (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/100).toFixed(0)}`} />
          <Tooltip formatter={(v: number) => toRupees(v)} />
          <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

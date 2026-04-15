import React from 'react';

interface Props {
  stats: any;
}

export default function StatsCards({ stats }: Props) {
  if (!stats) return null;

  const cards = [
    { key: 'total', label: 'Total', value: stats.total },
    { key: 'nouvelles', label: 'Nouvelles', value: stats.nouvelles },
    { key: 'enCours', label: 'En cours', value: stats.enCours },
    { key: 'traite', label: 'Traitées', value: stats.traite },
    { key: 'archive', label: 'Archivées', value: stats.archive },
    { key: 'urgent', label: 'Urgentes', value: stats.urgent },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((c) => (
        <div key={c.key} className="bg-white p-4 rounded shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-sm text-slate-500">{c.label}</div>
          <div className="text-2xl font-semibold mt-1">{c.value ?? 0}</div>
        </div>
      ))}
    </div>
  );
}

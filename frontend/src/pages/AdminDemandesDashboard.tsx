import React, { useState } from 'react';
import { useDemandes } from '../hooks/useDemandes';
import StatsCards from '../components/demandes/StatsCards';
import DemandesFilters from '../components/demandes/DemandesFilters';
import DemandesTable from '../components/demandes/DemandesTable';
import DemandeDrawer from '../components/demandes/DemandeDrawer';
import demandesApi from '../api/demandes.api';

export default function AdminDemandesDashboard() {
  const { data, meta, stats, loading, filters, setFilters, reload } = useDemandes({ page: 1, perPage: 25 });
  const [selected, setSelected] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openDemande(d: any) {
    setSelected(d);
    setDrawerOpen(true);
  }

  async function handleArchive(id: string) {
    if (!confirm('Archiver cette demande ?')) return;
    await demandesApi.archiveDemande(id);
    reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer (archiver) cette demande ?')) return;
    await demandesApi.deleteDemande(id);
    reload();
  }

  async function onPageChange(page: number) {
    setFilters({ ...filters, page });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Gestion des demandes</h1>

      <StatsCards stats={stats} />

      <DemandesFilters filters={filters} setFilters={setFilters} />

      <DemandesTable
        data={data}
        meta={meta}
        loading={loading}
        onView={openDemande}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onPageChange={onPageChange}
      />

      <DemandeDrawer
        open={drawerOpen}
        demande={selected}
        onClose={() => { setDrawerOpen(false); setSelected(null); }}
        onUpdated={() => { reload(); }}
      />
    </div>
  );
}

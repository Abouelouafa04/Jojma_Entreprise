import { useCallback, useEffect, useState } from 'react';
import demandesApi, { Demande } from '../api/demandes.api';

export function useDemandes(initialFilters: Record<string, any> = { page: 1, perPage: 25 }) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [data, setData] = useState<Demande[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; perPage: number }>({ total: 0, page: 1, perPage: 25 });
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        demandesApi.getDemandes(filters),
        demandesApi.getStats(),
      ]);

      // listRes expected shape: { data: Demande[], meta: { total, page, perPage } }
      const list = listRes?.data || [];
      const metaRes = listRes?.meta || { total: 0, page: 1, perPage: 25 };
      setData(list);
      setMeta(metaRes);
      setStats(statsRes || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    meta,
    stats,
    loading,
    error,
    filters,
    setFilters,
    reload: fetchAll,
  };
}

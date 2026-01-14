import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCharactersByIds } from "../../../api/rmApi";
import { extraerIdDesdeUrl } from "../../../shared/utils/extraerIdDesdeUrl";


/**
 * A veces la API devuelve:
 *  - Un array si pides varios
 *  - Un objeto si pides uno
 * Este helper normaliza el array 
 */
function normalizarAArray(data) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Hook que recibe:
 * - residentUrls: array de URLs (ej: ["https://.../character/1", ...])
 * - excludeId: id a excluir (normalmente el personaje actual)
 *
 * Objetivo:
 * - Convertir URLs a IDs
 * - Pedir esos personajes por batch
 */
export function useResidentesPorUrl(residentUrls, excludeId) {
  // useMemo para recalcular ids solo cuando cambian las URLs o el excludeId
  const ids = useMemo(() => {
    // Convertimos cada URL a id
    const parsed = (residentUrls ?? [])
      .map(extraerIdDesdeUrl)
      .filter((n) => Number.isFinite(n));

    // Quitamos duplicados y excluimos el personaje actual
    const unique = Array.from(new Set(parsed)).filter((id) => id !== excludeId);

    // Limitamos a 20
    return unique.slice(0, 20);
  }, [residentUrls, excludeId]);

  // React Query: solo se ejecuta si hay ids
  return useQuery({
    queryKey: ["residents", { ids }],
    queryFn: async () => {
      const data = await getCharactersByIds(ids);
      return normalizarAArray(data);
    },
    enabled: ids.length > 0,
  });
}

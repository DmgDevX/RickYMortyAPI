import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCharactersByIds, searchLocationsByName } from "../../../api/rmApi";
import { extraerIdDesdeUrl } from "../../../shared/utils/extraerIdDesdeUrl";

// Normaliza la respuesta a array
function normalizeToArray(data) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

// Divide un array en bloques (chunks)
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Hook para buscar personajes por nombre de localización
 *
 * Flujo:
 * 1. Busca localizaciones por nombre
 * 2. Coge la primera coincidencia
 * 3. Obtiene TODOS sus residentes
 * 4. Pide los personajes por bloques
 */
export function usePersonajesPorLocalizacionNombre(locationName) {
  const name = (locationName ?? "").trim();
  const keyName = useMemo(() => name.toLowerCase(), [name]);

  return useQuery({
    queryKey: ["charactersByLocationName", keyName],
    enabled: Boolean(keyName),
    queryFn: async () => {
      const locations = await searchLocationsByName(keyName);

      const first = locations?.results?.[0];
      const residentsUrls = first?.residents ?? [];

      const ids = Array.from(
        new Set(
          residentsUrls
            .map(extraerIdDesdeUrl)
            .filter((n) => Number.isFinite(n))
        )
      );

      if (ids.length === 0) return [];

      // Pedimos los personajes en bloques de 20
      const chunks = chunkArray(ids, 20);

      const batches = await Promise.all(
        chunks.map(async (chunk) => {
          const data = await getCharactersByIds(chunk);
          return normalizeToArray(data);
        })
      );

      return batches.flat();
    },
  });
}

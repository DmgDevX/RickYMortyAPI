import { useQuery } from "@tanstack/react-query";
import { getLocationById } from "../../../api/rmApi";

/**
 * Hook para pedir una localización por id.
 * Se usa para obtener los residentes de un origin.
 */
export function usePersonajesPorLocalizacion(locationId) {
  return useQuery({
    queryKey: ["location", locationId],
    queryFn: () => getLocationById(locationId),
    enabled: Boolean(locationId),
  });
}

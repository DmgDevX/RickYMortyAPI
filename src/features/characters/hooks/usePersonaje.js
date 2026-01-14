import { useQuery } from "@tanstack/react-query";
import { getCharacterById } from "../../../api/rmApi";

/**
 * Hook para pedir el detalle de un personaje.
 * - Si id es null/undefined, no lanza petición.
 */
export function usePersonaje(id) {
  return useQuery({
    queryKey: ["character", id],
    queryFn: () => getCharacterById(id),
    enabled: Boolean(id),
  });
}

import { useQuery } from "@tanstack/react-query";
import { getCharacters } from "../../../api/rmApi";

/**
 * Hook para traer el listado normal de personajes (paginado)
 * Recibe page, name y species
 */
export function usePersonajes({
  page = 1,
  name = "",
  species = "",
  enabled = true,
} = {}) {
  return useQuery({
    queryKey: ["characters", { page, name, species }],
    queryFn: () => getCharacters({ page, name, species }),
    keepPreviousData: true,
    enabled,
  });
}

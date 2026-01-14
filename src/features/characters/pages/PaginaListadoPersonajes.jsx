import { useMemo, useState } from "react";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import ErrorEstado from "../../../shared/components/ErrorEstado";
import GridPersonajes from "../components/GridPersonajes";
import FiltrosPersonajes from "../components/FiltrosPersonajes";

import { usePersonajes } from "../hooks/usePersonajes";
import { usePersonajesPorLocalizacionNombre } from "../hooks/usePersonajesPorLocalizacionNombre";
import { useDebounce } from "../../../shared/utils/useDebounce";

// Un 404 en búsquedas lo tratamos como "sin resultados"
function is404(error) {
  return error?.status === 404;
}

const PAGE_SIZE_LOCALIZACION = 20;

/**
 * Página principal:
 * - Muestra filtros
 * - Muestra grid de personajes
 * - Maneja paginación
 * - Combina 2 modos:
 *   A) listado normal de /character (con paginación de la API)
 *   B) listado por localización (busca location y pinta sus residents)
 */
export default function PaginaListadoPersonajes() {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState({
    name: "",
    species: "",
    location: "",
  });

  // Cuando cambian los filtros, reseteamos la página a 1
  const handleChangeFiltros = (next) => {
    setFiltros(next);
    setPage(1);
  };

  // Debounce para no lanzar peticiones con cada tecla
  const debouncedName = useDebounce(filtros.name, 500);
  const debouncedSpecies = useDebounce(filtros.species, 500);
  const debouncedLocation = useDebounce(filtros.location, 500);

  const name = (debouncedName ?? "").trim();
  const species = (debouncedSpecies ?? "").trim();
  const location = (debouncedLocation ?? "").trim();

  const usandoLocalizacion = Boolean(location);

  // Query A: listado normal (DESACTIVADA si hay localización)
  const queryListado = usePersonajes({
    page,
    name,
    species,
    enabled: !usandoLocalizacion,
  });

  // Query B: localización -> residentes
  const queryPorLocalizacion = usePersonajesPorLocalizacionNombre(location);

  // Elegimos la query activa según si hay localización
  const queryActiva = usandoLocalizacion ? queryPorLocalizacion : queryListado;

  const { data, isError, error, refetch, isFetching } = queryActiva;

  /**
   * Normalizamos a array:
   * - En modo localización, data ya es un array de personajes
   * - En modo listado, data es { info, results }
   */
  const personajesBase = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data?.results ?? [];
  }, [data]);

  /**
   * Filtro combinado:
   * - Si hay location, los personajes vienen por localización y aplicamos name/species en cliente
   * - Si no hay location, name/species ya lo filtra la API
   */
  const personajesFiltrados = useMemo(() => {
    if (!usandoLocalizacion) return personajesBase;

    const n = name.toLowerCase();
    const s = species.toLowerCase();

    return personajesBase.filter((p) => {
      const cumpleNombre = !n || (p?.name ?? "").toLowerCase().includes(n);
      const cumpleEspecie = !s || (p?.species ?? "").toLowerCase().includes(s);
      return cumpleNombre && cumpleEspecie;
    });
  }, [usandoLocalizacion, personajesBase, name, species]);

  /**
   * Paginación:
   * - Sin localización: paginación de API
   * - Con localización: paginación en cliente (20 por página)
   */
  const totalPages = useMemo(() => {
    if (!usandoLocalizacion) return data?.info?.pages ?? 1;
    return Math.max(
      1,
      Math.ceil(personajesFiltrados.length / PAGE_SIZE_LOCALIZACION)
    );
  }, [usandoLocalizacion, data, personajesFiltrados.length]);

  const personajesPaginados = useMemo(() => {
    if (!usandoLocalizacion) return personajesFiltrados;

    const start = (page - 1) * PAGE_SIZE_LOCALIZACION;
    const end = start + PAGE_SIZE_LOCALIZACION;
    return personajesFiltrados.slice(start, end);
  }, [usandoLocalizacion, personajesFiltrados, page]);

  // Si hay error que NO sea 404, mostramos ErrorEstado
  if (isError && !is404(error)) {
    return <ErrorEstado error={error} onRetry={refetch} />;
  }

  const sinResultados =
    is404(error) || (!isFetching && personajesFiltrados.length === 0);

  return (
    <Stack spacing={2}>
      <FiltrosPersonajes filtros={filtros} onChange={handleChangeFiltros} />

      {sinResultados ? (
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" fontWeight={700}>
            {t("list.noResultsTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("list.noResultsDesc")}
          </Typography>
        </Box>
      ) : (
        <GridPersonajes personajes={personajesPaginados} />
      )}

      {!sinResultados && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            page={page}
            count={totalPages}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Stack>
  );
}

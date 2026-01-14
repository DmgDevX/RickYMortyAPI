import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useTranslation } from "react-i18next";

import { usePersonaje } from "../hooks/usePersonaje";
import { usePersonajesPorLocalizacion } from "../hooks/usePersonajesPorLocalizacion";
import { useResidentesPorUrl } from "../hooks/useResidentesPorUrl";
import { extraerIdDesdeUrl } from "../../../shared/utils/extraerIdDesdeUrl";
import { useFavoritosStore } from "../../../shared/state/favoritos";

import Cargando from "../../../shared/components/Cargando";
import ErrorEstado from "../../../shared/components/ErrorEstado";
import GridPersonajes from "../components/GridPersonajes";

// Colores de chip por estado
function chipColorByStatus(status) {
  if (status === "Alive") return "success";
  if (status === "Dead") return "error";
  return "default";
}

// Convertimos status a key traducible
function statusKey(status) {
  const s = (status ?? "").toLowerCase();
  if (s === "alive") return "alive";
  if (s === "dead") return "dead";
  return "unknown";
}

// Convertimos gender a key traducible
function genderKey(gender) {
  const g = (gender ?? "").toLowerCase();
  if (g === "male") return "male";
  if (g === "female") return "female";
  if (g === "genderless") return "genderless";
  return "unknown";
}

// RNG determinista para barajar
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Baraja el array
function randomizarPorId(array, seed) {
  const rng = mulberry32(seed);
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
* Página de detalle:
* - Carga el personaje por id
* - Saca el originId desde personaje.origin.url
* - Pide la location de ese originId
* - Pide residentes de esa location
* - Permite marcar favorito
*/
export default function PaginaDetallePersonaje() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { id } = useParams();

  const numericId = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }, [id]);

  // H1: Cargar el personaje
  const personajeQuery = usePersonaje(numericId);
  const personaje = personajeQuery.data;

  // Scamos el id de origin.url
  const originId = useMemo(() => {
    return extraerIdDesdeUrl(personaje?.origin?.url);
  }, [personaje?.origin?.url]);

  // H2: Pedir la localización (Location) del ORIGEN
  const originQuery = usePersonajesPorLocalizacion(originId);
  const residentsUrls = originQuery.data?.residents;

  // H3: Pedir los residentes por URLs
  const residentesQuery = useResidentesPorUrl(residentsUrls, personaje?.id);

  // Favoritos (store)
  const esFavorito = useFavoritosStore((s) => s.esFavorito(personaje?.id));
  const toggleFavorito = useFavoritosStore((s) => s.toggleFavorito);

  // Filtra por mismo origen y luego lo ordena aleatoriamente
  const residentesRandom = useMemo(() => {
    // Si el origen es unknown (no hay originId), no mostramos ninguno
    if (!originId) return [];

    const base = residentesQuery.data ?? [];

    // Nos quedamos SOLO con los que tienen el mismo ORIGEN
    const mismoOrigen = base.filter(
      (p) => extraerIdDesdeUrl(p?.origin?.url) === originId
    );

    // Barajamos el array 
    const seed = Number(personaje?.id) || 1;
    return randomizarPorId(mismoOrigen, seed);
  }, [residentesQuery.data, originId, personaje?.id]);

  if (personajeQuery.isLoading) return <Cargando texto={t("loading.character")} />;
  if (personajeQuery.isError) {
    return (
      <ErrorEstado error={personajeQuery.error} onRetry={personajeQuery.refetch} />
    );
  }

  const favLabel = esFavorito ? t("card.favRemove") : t("card.favAdd");

  return (
    <Stack spacing={2}>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="text"
        >
          {t("actions.back")}
        </Button>
      </Box>

      <Card>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          }}
        >
          <CardMedia
            component="img"
            image={personaje.image}
            alt={personaje.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <CardContent>
            <Stack spacing={1.5}>
              <Box>
                {/* Nombre + Favorito */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ fontSize: { xs: 26, sm: 32 } }}
                  >
                    {personaje.name}
                  </Typography>

                  <Tooltip title={favLabel}>
                    <IconButton onClick={() => toggleFavorito(personaje)} aria-label={favLabel}>
                      {esFavorito ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Chips */}
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={t(`status.${statusKey(personaje.status)}`)}
                    color={chipColorByStatus(personaje.status)}
                    size="small"
                  />
                  <Chip
                    label={t(`species.${personaje.species ?? "Unknown"}`, {
                      defaultValue: personaje.species ?? "—",
                    })}
                    size="small"
                    variant="outlined"
                  />
                  {personaje.type ? (
                    <Chip label={personaje.type} size="small" variant="outlined" />
                  ) : null}
                  <Chip
                    label={t(`gender.${genderKey(personaje.gender)}`)}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Box>

              <Divider />
              
              {/* Origen y ubicación actual */}
              <Stack spacing={1}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    {t("labels.origin")}
                  </Typography>
                  <Typography variant="body1">{personaje.origin?.name ?? "—"}</Typography>
                </Box>

                <Box>
                  <Typography variant="overline" color="text.secondary">
                    {t("labels.currentLocation")}
                  </Typography>
                  <Typography variant="body1">{personaje.location?.name ?? "—"}</Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Box>
      </Card>
      
       {/* Cards de personajes con mismo origen */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {personaje.origin?.name
              ? t("detail.otherResidentsIn", { location: personaje.origin.name })
              : t("detail.otherResidentsFallback")}
          </Typography>

          {residentesQuery.isLoading && (
            <Typography color="text.secondary">{t("loading.residents")}</Typography>
          )}

          {residentesQuery.isError && (
            <Alert severity="warning">{t("errors.residents")}</Alert>
          )}

          {!residentesQuery.isLoading &&
            !residentesQuery.isError &&
            residentesRandom.length === 0 && (
              <Typography color="text.secondary">
                {t("detail.noOtherResidents")}
              </Typography>
            )}

          {residentesRandom.length > 0 && <GridPersonajes personajes={residentesRandom} />}
        </CardContent>
      </Card>
    </Stack>
  );
}

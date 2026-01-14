import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useTranslation } from "react-i18next";

import { useFavoritosStore } from "../../../shared/state/favoritos";

// Devuelve el color del Chip según el estado del personaje
function chipColorByStatus(status) {
  if (status === "Alive") return "success";
  if (status === "Dead") return "error";
  return "default";
}

// Pasamos el texto del status a una "key" para traducirlo
function statusKey(status) {
  const s = (status ?? "").toLowerCase();
  if (s === "alive") return "alive";
  if (s === "dead") return "dead";
  return "unknown";
}

/**
 * Tarjeta para mostrar un personaje en el listado
 * Imagen
 * Nombre
 * Origen
 * Estado / Especie
 * Ubicación actual
 * Botón para añadir/quitar favorito
 */
export default function TarjetaPersonaje({ personaje }) {
  const { t } = useTranslation();

  const esFavorito = useFavoritosStore((s) => s.esFavorito(personaje.id));
  const toggleFavorito = useFavoritosStore((s) => s.toggleFavorito);

  const favLabel = esFavorito ? t("card.favRemove") : t("card.favAdd");

  return (
    <Card
      sx={{
        position: "relative",
        height: { xs: "auto", md: 360 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Botón favorito */}
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
        <Tooltip title={favLabel}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorito(personaje);
            }}
            sx={{
              bgcolor: "rgba(255,255,255,0.85)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
            }}
            aria-label={favLabel}
          >
            {esFavorito ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <CardActionArea
        component={RouterLink}
        to={`/personajes/${personaje.id}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {/* Imagen cuadrada responsive */}
        <Box sx={{ position: "relative", width: "100%", pt: "100%" }}>
          <CardMedia
            component="img"
            image={personaje.image}
            alt={personaje.name}
            loading="lazy"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, width: "100%" }}>
          <Stack spacing={1}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              noWrap
              title={personaje.name}
            >
              {personaje.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" noWrap>
              {t("labels.origin")}:{" "}
              {personaje.origin?.name === "unknown"
                ? t("status.unknown")
                : personaje.origin?.name ?? "—"}
            </Typography>

            {/* Chips informativos */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: "wrap", rowGap: 1 }}
            >
              <Chip
                size="small"
                label={t(`status.${statusKey(personaje.status)}`)}
                color={chipColorByStatus(personaje.status)}
              />
              <Chip
                size="small"
                variant="outlined"
                label={t(`species.${personaje.species ?? "Unknown"}`, {
                  defaultValue: personaje.species ?? "—",
                })}
              />
            </Stack>
            
            {/* Ubicación actual */}
            <Typography variant="body2" color="text.secondary" noWrap>
              {t("labels.location")}: {personaje.location?.name ?? "—"}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

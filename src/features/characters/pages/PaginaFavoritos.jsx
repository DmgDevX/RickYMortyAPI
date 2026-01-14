import { Box, Button, Stack, Typography } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useTranslation } from "react-i18next";

import GridPersonajes from "../components/GridPersonajes";
import { useFavoritosStore } from "../../../shared/state/favoritos";

/**
 * Página de favoritos:
 * - Lee favoritos del store (Zustand)
 *    - Si no hay -> muestra mensaje
 *    - Si hay -> muestra el grid de tarjetas
 */
export default function PaginaFavoritos() {
  const { t } = useTranslation();

  const favoritosById = useFavoritosStore((s) => s.favoritosById);
  const clearFavoritos = useFavoritosStore((s) => s.clearFavoritos);

  const favoritos = Object.values(favoritosById);

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={800}>
          {t("favorites.title", { count: favoritos.length })}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<DeleteSweepIcon />}
          onClick={clearFavoritos}
          disabled={favoritos.length === 0}
        >
          {t("actions.clear")}
        </Button>
      </Box>

      {favoritos.length === 0 ? (
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" fontWeight={700}>
            {t("favorites.emptyTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("favorites.emptyDesc")}
          </Typography>
        </Box>
      ) : (
        <GridPersonajes personajes={favoritos} />
      )}
    </Stack>
  );
}

import { Box, MenuItem, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function FiltrosPersonajes({ filtros, onChange }) {
  const { t } = useTranslation();

  // Obtener species dinámicamente desde i18n
  const speciesOptions = useMemo(() => {
    const speciesObj = t("species", { returnObjects: true });
    return Object.keys(speciesObj);
  }, [t]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 2fr" },
        gap: 2,
        mb: 3,
      }}
    >
      {/* Filtro por nombre */}
      <TextField
        label={t("filters.name")}
        value={filtros.name}
        onChange={(e) => onChange({ ...filtros, name: e.target.value })}
        size="small"
        fullWidth
      />

      {/* Filtro por especie */}
      <TextField
        select
        label={t("filters.species")}
        value={filtros.species}
        onChange={(e) => onChange({ ...filtros, species: e.target.value })}
        size="small"
        fullWidth
      >
        {/* Opción "todas" */}
        <MenuItem value="">
          {t("filters.all")}
        </MenuItem>

        {speciesOptions.map((key) => (
          <MenuItem key={key} value={key}>
            {t(`species.${key}`)}
          </MenuItem>
        ))}
      </TextField>

      {/* Filtro por localización */}
      <TextField
        label={t("filters.location")}
        value={filtros.location}
        onChange={(e) => onChange({ ...filtros, location: e.target.value })}
        size="small"
        fullWidth
      />
    </Box>
  );
}

import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Cargando({ texto }) {
  const { t } = useTranslation();
  const label = texto ?? t("loading.default");

  return (
    <Box sx={{ display: "grid", placeItems: "center", py: 6, gap: 2 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

import { Alert, AlertTitle, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ErrorEstado({ error, onRetry }) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Alert severity="error">
        <AlertTitle>{t("errors.title")}</AlertTitle>
        {error?.message ?? t("errors.generic")}
      </Alert>

      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          {t("actions.retry")}
        </Button>
      )}
    </Stack>
  );
}

import { Box } from "@mui/material";
import TarjetaPersonaje from "./TarjetaPersonaje";

export default function GridPersonajes({ personajes }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, minmax(0, 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
          xl: "repeat(5, minmax(0, 1fr))",
        },
        gap: { xs: 2, sm: 2, md: 2, lg: 2 },
        alignItems: "stretch",
      }}
    >
      {personajes.map((p) => (
        <TarjetaPersonaje
          key={p.id}
          personaje={p}
        />
      ))}
    </Box>
  );
}

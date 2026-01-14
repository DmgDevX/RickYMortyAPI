import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import PaginaListadoPersonajes from "../features/characters/pages/PaginaListadoPersonajes";
import PaginaDetallePersonaje from "../features/characters/pages/PaginaDetallePersonaje";
import PaginaFavoritos from "../features/characters/pages/PaginaFavoritos";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <PaginaListadoPersonajes /> },
      { path: "/personajes/:id", element: <PaginaDetallePersonaje /> },
      { path: "/favoritos", element: <PaginaFavoritos /> },
    ],
  },
]);

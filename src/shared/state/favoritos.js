import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Store de favoritos con Zustand
 * - Guardamos favoritos en un diccionario por id 
 * (lo guarda en localStorage para que no se pierda al refrescar)
 */
export const useFavoritosStore = create(
  persist(
    (set, get) => ({
      // Diccionario { [id]: personajeSnapshot }
      favoritosById: {},

       //Devuelve true/false si el id está en favoritos.
      esFavorito: (id) => Boolean(get().favoritosById[id]),

        /**
       * Añade o quita un personaje de favoritos
       * - Si ya existe -> lo borra
       * - Si no existe -> guarda datos básicos para listarlo
       */
      toggleFavorito: (personaje) =>
        set((state) => {
          const id = personaje.id;
          const next = { ...state.favoritosById };

          if (next[id]) delete next[id];
          else {
            // Guardamos un “snapshot” suficiente para listar
            next[id] = {
              id: personaje.id,
              name: personaje.name,
              status: personaje.status,
              species: personaje.species,
              gender: personaje.gender,
              image: personaje.image,
              origin: personaje.origin,
              location: personaje.location,
            };
          }

          return { favoritosById: next };
        }),

      // Borra todos los favoritos
      clearFavoritos: () => set({ favoritosById: {} }),
    }),
    {
      name: "rm-favoritos-v1",
      version: 1,
    }
  )
);

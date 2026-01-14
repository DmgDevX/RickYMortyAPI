const BASE_URL = "https://rickandmortyapi.com/api";

/**
 * Hace una petición a la API de Rick & Morty
 * - Recibe un "path" (ej: "/character?page=1")
 * - Devuelve el JSON ya parseado
 * - Si la respuesta viene mal (404, 500...), lanza un error con status
 */
async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);

  // Si la API responde con error, lo convertimos en un Error de JS
  // para que React Query lo detecte como "isError"
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`HTTP ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }

  // Devolvemos el JSON de la API
  return res.json();
}

/**
 * Convierte un objeto en un query string
 * Ejemplo:
 *  toQueryString({ page: 1, name: "rick", species: "" }) -> "?page=1&name=rick"
 *
 * Detalle importante:
 * - Ignora undefined/null
 * - Ignora strings vacíos
 */
function toQueryString(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const value = String(v).trim();
    if (!value) return;
    search.set(k, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

// --- Characters ---
// Trae un listado paginado de personajes
export function getCharacters({ page = 1, name = "", species = "" } = {}) {
  const qs = toQueryString({ page, name, species });
  return request(`/character${qs}`);
}

// Trae un personaje por su id
export function getCharacterById(id) {
  return request(`/character/${id}`);
}

// Trae varios personajes a la vez por ids
export function getCharactersByIds(ids) {
  if (!ids?.length) return Promise.resolve([]);
  return request(`/character/${ids.join(",")}`);
}

// --- Locations ---
//Trae una localización por id
export function getLocationById(id) {
  return request(`/location/${id}`);
}

// Busca localizaciones por nombre
export function searchLocationsByName(name) {
  const qs = toQueryString({ name });
  return request(`/location${qs}`);
}

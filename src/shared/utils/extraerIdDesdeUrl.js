/**
 * Extrae un número id desde una URL
 * Ejemplo: "https://rickandmortyapi.com/api/location/20" -> 20
 * Si la URL no existe o no acaba en número, devuelve null.
 */
export function extraerIdDesdeUrl(url) {
  if (!url) return null;

  // Separar por "/" y quitar vacíos
  const parts = url.split("/").filter(Boolean);
  
   // El último trozo es el id
  const last = parts[parts.length - 1];

  const id = Number(last);
  return Number.isFinite(id) ? id : null;
}

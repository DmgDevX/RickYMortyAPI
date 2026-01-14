import { useEffect, useState } from "react";

/**
 * Debounce sencillo:
 * - Cuando "value" cambia, esperamos "delay" ms.
 * - Si en ese tiempo vuelve a cambiar, cancelamos y empezamos de nuevo, para no hacer peticiones a la API por cada tecla
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}

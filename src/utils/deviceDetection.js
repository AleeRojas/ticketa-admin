/**
 * Detecta si el dispositivo actual es móvil basado en el ancho de la pantalla
 * @returns {boolean} true si es móvil, false si es desktop
 */
export const isMobileDevice = () => {
  // Tailwind lg breakpoint es 1024px
  return window.innerWidth < 1024;
};

/**
 * Agrega un listener para detectar cambios en el tamaño de la pantalla
 * @param {Function} callback - Función a llamar cuando cambia el tamaño
 * @returns {Function} Función para remover el listener
 */
export const addResizeListener = (callback) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};
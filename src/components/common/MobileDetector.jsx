import { useEffect, useState } from 'react';

/**
 * Custom hook que detecta si el dispositivo es móvil
 * @returns {Object} Estado que indica si es móvil y tamaño de pantalla
 */
export const useMobileDetector = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Función para actualizar el estado del tamaño de ventana
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Agregar listener para el evento resize
    window.addEventListener('resize', handleResize);
    
    // Limpiar el listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Consideramos como móvil si la pantalla es menor a 768px (md en Tailwind)
  const isMobile = windowSize.width < 768;
  // Consideramos como tableta si está entre 768px y 1024px (lg en Tailwind)
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  // Consideramos como orientación portrait si el alto es mayor que el ancho
  const isPortrait = windowSize.height > windowSize.width;

  return {
    isMobile,
    isTablet,
    isPortrait,
    windowSize
  };
};

/**
 * Componente que permite renderizar contenido diferente según el dispositivo
 */
const MobileDetector = ({ 
  mobileContent, 
  desktopContent, 
  tabletContent = null 
}) => {
  const { isMobile, isTablet } = useMobileDetector();

  if (isMobile) {
    return mobileContent;
  } else if (isTablet && tabletContent) {
    return tabletContent;
  } else {
    return desktopContent;
  }
};

export default MobileDetector;

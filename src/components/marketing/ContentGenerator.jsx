import React, { useState } from 'react';
import { 
  Image, 
  Palette, 
  Edit, 
  Download, 
  Share2, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Layout
} from 'lucide-react';

/**
 * Componente para el generador de gráficas promocionales simplificado
 * Integra plantillas de diseño editables
 */
const ContentGenerator = () => {
  // Plantillas disponibles
  const templates = [
    { 
      id: 1, 
      title: 'Plato del día', 
      description: 'Prueba nuestra deliciosa creación', 
      price: '$12.990',
      icon: '🍽️',
      bgColor: '#ffffff',
      accentColor: '#646cff'
    },
    { 
      id: 2, 
      title: 'Happy Hour', 
      description: 'De lunes a viernes, 18:00 a 20:00', 
      price: '2x1 en cócteles',
      icon: '🍹',
      bgColor: '#fdf2f8',
      accentColor: '#f43f5e'
    },
    { 
      id: 3, 
      title: 'Música en vivo', 
      description: 'Todos los viernes', 
      price: 'Entrada libre',
      icon: '🎵',
      bgColor: '#fffbeb',
      accentColor: '#fbbf24'
    },
    { 
      id: 4, 
      title: 'Especial de otoño', 
      description: 'Nuevos sabores de temporada', 
      price: 'Desde $8.990',
      icon: '🍂',
      bgColor: '#f0fdf4',
      accentColor: '#166534'
    },
    { 
      id: 5, 
      title: 'Cumpleaños', 
      description: 'Celebra con nosotros', 
      price: 'Postre gratis',
      icon: '🎂',
      bgColor: '#f0f9ff',
      accentColor: '#0c4a6e'
    }
  ];
  
  // Fondos predefinidos
  const backgrounds = [
    { color: '#ffffff', name: 'Blanco' },
    { color: '#f9fafb', name: 'Gris claro' },
    { color: '#fdf2f8', name: 'Rosa claro' },
    { color: '#fffbeb', name: 'Amarillo claro' },
    { color: '#f0fdf4', name: 'Verde claro' },
    { color: '#f0f9ff', name: 'Azul claro' }
  ];
  
  // Distribuciones disponibles
  const layouts = [
    { id: 'centered', name: 'Centrado' },
    { id: 'left', name: 'Izquierda' },
    { id: 'right', name: 'Derecha' },
    { id: 'top', name: 'Superior' }
  ];
  
  // Estados
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    title: '',
    description: '',
    price: '',
    icon: '',
    bgColor: '',
    accentColor: '',
    layout: 'centered'
  });
  
  // Obtener la plantilla seleccionada
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  
  // Inicializar edición cuando selecciona una plantilla
  const startEditing = (template) => {
    setCustomTemplate({
      title: template.title,
      description: template.description,
      price: template.price,
      icon: template.icon,
      bgColor: template.bgColor,
      accentColor: template.accentColor,
      layout: 'centered'
    });
    setIsEditing(true);
  };
  
  // Crear plantilla nueva en blanco
  const createBlankTemplate = () => {
    setCustomTemplate({
      title: 'Nueva promoción',
      description: 'Añade una descripción',
      price: 'Precio/Oferta',
      icon: '🍴',
      bgColor: '#ffffff',
      accentColor: '#646cff',
      layout: 'centered'
    });
    setIsEditing(true);
  };
  
  // Manejar cambios en la edición
  const handleChange = (field, value) => {
    setCustomTemplate({
      ...customTemplate,
      [field]: value
    });
  };
  
  // Navegación del carrusel
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };
  
  const goToNextSlide = () => {
    const newSlide = currentSlide === Math.ceil(templates.length / 3) - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
  };
  
  const goToPrevSlide = () => {
    const newSlide = currentSlide === 0 ? Math.ceil(templates.length / 3) - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
  };
  
  // Renderizar vista previa
  const renderPreview = (template) => {
    return (
      <div 
        className="aspect-square rounded-lg overflow-hidden transition-all duration-300"
        style={{ 
          backgroundColor: template.bgColor,
          color: template.accentColor
        }}
      >
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <span className="text-6xl mb-4">{template.icon}</span>
          <h3 className="text-xl font-bold" style={{ color: template.accentColor }}>
            {template.title}
          </h3>
          <p className="text-sm mt-2 opacity-80">
            {template.description}
          </p>
          <p className="text-lg font-bold mt-3">
            {template.price}
          </p>
        </div>
      </div>
    );
  };
  
  // Si está en modo edición
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Editar Gráfica Promocional
          </h3>
          <button 
            className="text-gray-600 hover:text-gray-800 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            onClick={() => setIsEditing(false)}
          >
            Volver a plantillas
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel de edición */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Personalizar plantilla</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input 
                  type="text" 
                  value={customTemplate.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input 
                  type="text" 
                  value={customTemplate.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio / Oferta
                </label>
                <input 
                  type="text" 
                  value={customTemplate.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emoji / Icono
                </label>
                <input 
                  type="text" 
                  value={customTemplate.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  maxLength={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color de fondo
                </label>
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {backgrounds.map((bg, index) => (
                    <button
                      key={index}
                      onClick={() => handleChange('bgColor', bg.color)}
                      className={`w-full aspect-square rounded-md border ${
                        customTemplate.bgColor === bg.color ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: bg.color }}
                    ></button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="color" 
                    value={customTemplate.bgColor}
                    onChange={(e) => handleChange('bgColor', e.target.value)}
                    className="h-10 w-10 border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={customTemplate.bgColor}
                    onChange={(e) => handleChange('bgColor', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color de acento
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="color" 
                    value={customTemplate.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="h-10 w-10 border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={customTemplate.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distribución
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {layouts.map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => handleChange('layout', layout.id)}
                      className={`border rounded-md p-2 flex flex-col items-center text-xs ${
                        customTemplate.layout === layout.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <Layout size={16} className="mb-1" />
                      {layout.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Vista previa */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Vista previa</h4>
            <div className="border border-gray-200 rounded-lg p-4">
              {renderPreview(customTemplate)}
              
              <div className="mt-6 flex justify-between">
                <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                  Guardar como plantilla
                </button>
                <div className="flex space-x-2">
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Copy size={16} />
                  </button>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Share2 size={16} />
                  </button>
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Modo de selección de plantilla
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Plantillas de Diseño
        </h3>
        <button 
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
          onClick={createBlankTemplate}
        >
          <Plus size={16} className="mr-1" />
          Crear nueva
        </button>
      </div>
      
      {/* Plantilla seleccionada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Plantilla seleccionada</h4>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {selectedTemplate && renderPreview(selectedTemplate)}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Detalles y opciones</h4>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-2">
                {selectedTemplate?.title}
              </h5>
              <p className="text-sm text-gray-600 mb-4">
                {selectedTemplate?.description}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex space-x-1">
                  <span 
                    className="inline-block w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedTemplate?.bgColor }}
                  ></span>
                  <span 
                    className="inline-block w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedTemplate?.accentColor }}
                  ></span>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedTemplate?.icon}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between space-x-2">
              <button
                className="flex-1 text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md px-3 py-2 text-sm flex items-center justify-center"
                onClick={() => {
                  const template = { ...selectedTemplate };
                  startEditing(template);
                }}
              >
                <Edit size={16} className="mr-1" />
                Personalizar
              </button>
              <button className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-3 py-2 text-sm flex items-center justify-center">
                <Share2 size={16} className="mr-1" />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Carrusel de plantillas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-700">Más plantillas</h4>
          <div className="flex space-x-2">
            <button 
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              onClick={goToPrevSlide}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              onClick={goToNextSlide}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedTemplateId === template.id ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <div 
                className="aspect-square flex flex-col items-center justify-center p-4 text-center"
                style={{ 
                  backgroundColor: template.bgColor,
                  color: template.accentColor
                }}
              >
                <span className="text-4xl mb-2">{template.icon}</span>
                <h3 className="text-md font-bold" style={{ color: template.accentColor }}>
                  {template.title}
                </h3>
                <p className="text-xs mt-1 opacity-80">
                  {template.description}
                </p>
                <p className="text-sm font-bold mt-2">
                  {template.price}
                </p>
              </div>
            </div>
          ))}
          <div 
            className="border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center"
            onClick={createBlankTemplate}
          >
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <Plus size={18} className="text-gray-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">Crear nuevo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
import React from 'react';
import { 
  Share2, 
  Plus, 
  Edit, 
  Trash, 
  Copy, 
  Instagram, 
  Facebook, 
  Twitter 
} from 'lucide-react';

/**
 * Componente para la pestaña de Redes Sociales
 */
const SocialContent = ({ 
  posts, 
  setPosts,
  setEditingPost,
  setShowPostModal
}) => {
  return (
    <div className="space-y-8">
      {/* Sección de publicaciones programadas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Publicaciones en Redes Sociales</h3>
          <button 
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
            onClick={() => {
              setEditingPost(null);
              setShowPostModal(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Nueva Publicación
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plataformas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programada para</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{post.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      {post.platforms.includes('instagram') && (
                        <span className="p-1 rounded bg-pink-100 text-pink-800">
                          <Instagram size={14} />
                        </span>
                      )}
                      {post.platforms.includes('facebook') && (
                        <span className="p-1 rounded bg-blue-100 text-blue-800">
                          <Facebook size={14} />
                        </span>
                      )}
                      {post.platforms.includes('twitter') && (
                        <span className="p-1 rounded bg-blue-100 text-blue-800">
                          <Twitter size={14} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(post.scheduled).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status === 'published' ? 'Publicado' : 
                       post.status === 'scheduled' ? 'Programado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setEditingPost(post);
                          setShowPostModal(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setPosts(posts.filter(p => p.id !== post.id))}
                      >
                        <Trash size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    No hay publicaciones programadas. ¡Crea tu primera publicación!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Generador de contenido */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Generador de Contenido</h3>
          <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm">
            Generar con IA
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de contenido
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Promoción de plato</option>
              <option>Evento especial</option>
              <option>Oferta de tiempo limitado</option>
              <option>Presentación de chef</option>
              <option>Publicación informativa</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Elementos a incluir
            </label>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <input type="checkbox" id="inc-prices" className="h-4 w-4 text-indigo-600 rounded" />
                <label htmlFor="inc-prices" className="ml-2 text-sm text-gray-700">Precios</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="inc-desc" className="h-4 w-4 text-indigo-600 rounded" />
                <label htmlFor="inc-desc" className="ml-2 text-sm text-gray-700">Descripción</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="inc-hashtags" className="h-4 w-4 text-indigo-600 rounded" />
                <label htmlFor="inc-hashtags" className="ml-2 text-sm text-gray-700">Hashtags</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="inc-call" className="h-4 w-4 text-indigo-600 rounded" />
                <label htmlFor="inc-call" className="ml-2 text-sm text-gray-700">Llamada a la acción</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto o evento a promocionar
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>-- Seleccionar producto --</option>
              <option>Paella de Mariscos</option>
              <option>Gin Tonic Especial</option>
              <option>Menú de Degustación</option>
              <option>Happy Hour (2x1)</option>
            </select>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa del contenido</h4>
            <p className="text-sm text-gray-500 mb-2">
              ¡Disfruta de nuestra deliciosa Paella de Mariscos este fin de semana! 🦐🦪 Una explosión de sabores del mar en cada bocado. Disponible por tiempo limitado a $15.990.
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Reserva ya en nuestra web o visítanos. #GastronomíaEspañola #Mariscos #YaMenuRestaurant
            </p>
            <div className="flex justify-end">
              <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                <Copy size={14} className="mr-1" />
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Plantillas de diseño */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Plantillas de Diseño</h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
            Ver todas las plantillas
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-square bg-indigo-50 flex items-center justify-center">
              <div className="text-center p-4">
                <span className="text-4xl">🍽️</span>
                <p className="font-medium mt-2">Plato del día</p>
                <p className="text-xs text-gray-500">$12.990</p>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm font-medium">Plato del día</span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <Edit size={16} />
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-square bg-amber-50 flex items-center justify-center">
              <div className="text-center p-4">
                <span className="text-4xl">🍹</span>
                <p className="font-medium mt-2">Happy Hour</p>
                <p className="text-xs text-gray-500">2x1 en cócteles</p>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm font-medium">Promo Happy Hour</span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <Edit size={16} />
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-square bg-blue-50 flex items-center justify-center">
              <div className="text-center p-4">
                <span className="text-4xl">🎵</span>
                <p className="font-medium mt-2">Música en vivo</p>
                <p className="text-xs text-gray-500">Viernes 20:00</p>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm font-medium">Evento especial</span>
              <button className="text-indigo-600 hover:text-indigo-800">
                <Edit size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialContent;
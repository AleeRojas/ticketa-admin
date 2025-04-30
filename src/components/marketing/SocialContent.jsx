import React from 'react';
import { 
  Share2, 
  Plus, 
  Edit, 
  Trash, 
  Copy, 
  Instagram, 
  Facebook, 
  Twitter,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import ContentGenerator from './ContentGenerator';

/**
 * Componente para la pestaña de Redes Sociales (actualizado con métricas)
 */
const SocialContent = ({ 
  posts, 
  setPosts,
  setEditingPost,
  setShowPostModal
}) => {
  return (
    <div className="space-y-8">
      {/* Resumen de estadísticas de redes sociales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Publicaciones totales</h4>
          <p className="text-2xl font-bold mt-1">{posts.length}</p>
          <div className="flex items-center text-gray-500 text-xs mt-1">
            <span>En todas las plataformas</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Engagement</h4>
          <p className="text-2xl font-bold mt-1">3.8%</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+0.7%</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Alcance</h4>
          <p className="text-2xl font-bold mt-1">1,543</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+12%</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Clics hacia menú</h4>
          <p className="text-2xl font-bold mt-1">287</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+34</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
      </div>
      
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
      <ContentGenerator />
      
      {/* Métricas de rendimiento por plataforma */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Rendimiento por Plataforma</h3>
          <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
            <option>Últimos 30 días</option>
            <option>Últimos 7 días</option>
            <option>Este mes</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Instagram */}
          <div className="border border-pink-100 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Instagram size={18} className="text-pink-600 mr-2" />
              <h4 className="text-md font-medium text-gray-800">Instagram</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Seguidores</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">1,245</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +45
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Engagement</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">4.7%</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +0.8%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Impresiones</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">3,862</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +15%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Clics al perfil</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">138</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +28
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Facebook */}
          <div className="border border-blue-100 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Facebook size={18} className="text-blue-600 mr-2" />
              <h4 className="text-md font-medium text-gray-800">Facebook</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Seguidores</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">865</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +12
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Engagement</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">2.8%</span>
                  <span className="text-xs text-red-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5 transform rotate-180" />
                    -0.3%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Impresiones</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">2,145</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +8%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Clics al perfil</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">94</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +16
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Twitter */}
          <div className="border border-blue-100 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Twitter size={18} className="text-blue-500 mr-2" />
              <h4 className="text-md font-medium text-gray-800">Twitter</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Seguidores</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">542</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +8
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Engagement</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">3.2%</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +0.5%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Impresiones</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">1,256</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +11%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Clics al perfil</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium">55</span>
                  <span className="text-xs text-green-600 ml-2 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" />
                    +9
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      {/* Calendario de publicaciones */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Calendario de Publicaciones</h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm">
            Ver calendario completo
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Mayo 2025</h4>
            <div className="flex space-x-1">
              <button className="p-1 rounded-md hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="p-1 rounded-md hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            <div className="text-center text-xs font-medium text-gray-500 py-1">Lun</div>
            <div className="text-center text-xs font-medium text-gray-500 py-1">Mar</div>
            <div className="text-center text-xs font-medium text-gray-500 py-1">Mié</div>
            <div className="text-center text-xs font-medium text-gray-500 py-1">Jue</div>
            <div className="text-center text-xs font-medium text-gray-500 py-1">Vie</div>
            <div className="text-center text-xs font-medium text-gray-500 py-1">Sáb</div>
            <div className="text-center text-xs font-medium text-gray-500 py-1">Dom</div>
            
            {/* Días de ejemplo con publicaciones programadas */}
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">1</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">2</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">3</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">4</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">5</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">6</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">7</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">8</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">9</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1 bg-indigo-50 border-indigo-200">
              <span className="text-xs">10</span>
              <div className="h-1 w-1 bg-indigo-500 rounded-full mt-1"></div>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">11</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">12</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">13</span>
            </div>
            <div className="aspect-square border border-gray-200 rounded-md flex flex-col items-center justify-center p-1">
              <span className="text-xs text-gray-400">14</span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-indigo-500 rounded-full mr-1"></div>
              <span>Publicación programada</span>
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
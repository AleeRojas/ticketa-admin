import React, { useState } from 'react';
import { Plus, Ticket, Trophy, Edit, Trash, Clock, Check, Users, ChevronRight } from 'lucide-react';

/**
 * Componente para la pestaña de Promos (Cupones y Concursos)
 */
const PromoContent = () => {
  // Estados para los cupones y concursos
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'VERANO25',
      discount: '25%',
      active: true,
      redemptions: 48,
      maxRedemptions: 100,
      expiresAt: '2025-08-31',
      conditions: 'Válido para pedidos superiores a $20.000'
    },
    {
      id: 2,
      code: 'PRIMAVERA15',
      discount: '15%',
      active: false,
      redemptions: 0,
      maxRedemptions: 50,
      expiresAt: '2025-09-30',
      conditions: 'No acumulable con otras promociones'
    }
  ]);
  
  const [contests, setContests] = useState([
    {
      id: 1,
      title: 'Gana una cena para dos',
      description: 'Comparte tu experiencia en Instagram con #CenaMemorable',
      active: true,
      participants: 34,
      startsAt: '2025-05-01',
      endsAt: '2025-05-31',
      prize: 'Cena de degustación para 2 personas'
    }
  ]);
  
  // Estado para pestañas internas
  const [activeInnerTab, setActiveInnerTab] = useState('coupons');
  
  return (
    <div className="space-y-8">
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Cupones activos</h4>
          <p className="text-2xl font-bold mt-1">{coupons.filter(c => c.active).length}</p>
          <div className="flex items-center text-gray-500 text-xs mt-1">
            <span>Total: {coupons.length} cupones</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Cupones canjeados</h4>
          <p className="text-2xl font-bold mt-1">{coupons.reduce((acc, c) => acc + c.redemptions, 0)}</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+8.3%</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Concursos activos</h4>
          <p className="text-2xl font-bold mt-1">{contests.filter(c => c.active).length}</p>
          <div className="flex items-center text-gray-500 text-xs mt-1">
            <span>Total: {contests.length} concursos</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500">Participantes</h4>
          <p className="text-2xl font-bold mt-1">{contests.reduce((acc, c) => acc + c.participants, 0)}</p>
          <div className="flex items-center text-green-600 text-xs mt-1">
            <span>+12.5%</span>
            <span className="text-gray-500 ml-1">vs anterior</span>
          </div>
        </div>
      </div>
      
      {/* Pestañas para Cupones y Concursos */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b px-6">
          <button
            onClick={() => setActiveInnerTab('coupons')}
            className={`flex items-center py-3 text-sm font-medium ${
              activeInnerTab === 'coupons' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Ticket size={16} className="mr-2" />
            Cupones
          </button>
          <button
            onClick={() => setActiveInnerTab('contests')}
            className={`flex items-center py-3 ml-6 text-sm font-medium ${
              activeInnerTab === 'contests' 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy size={16} className="mr-2" />
            Concursos
          </button>
        </div>
        
        {/* Contenido de la pestaña seleccionada */}
        <div className="p-6">
          {activeInnerTab === 'coupons' ? (
            /* Gestión de Cupones */
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Cupones de Descuento</h3>
                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center">
                  <Plus size={16} className="mr-1" />
                  Nuevo Cupón
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canjes</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caduca</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {coupons.map(coupon => (
                      <tr key={coupon.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{coupon.code}</td>
                        <td className="px-4 py-3 text-sm">{coupon.discount}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {coupon.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {coupon.redemptions}/{coupon.maxRedemptions}
                          <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${(coupon.redemptions / coupon.maxRedemptions) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{coupon.expiresAt}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Estadísticas de rendimiento de cupones */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rendimiento de Cupones</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">Conversión por cupón</h5>
                    <div className="space-y-4">
                      {coupons.map(coupon => (
                        <div key={coupon.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{coupon.code}</span>
                            <span className="font-medium">{Math.round((coupon.redemptions / coupon.maxRedemptions) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-indigo-500 h-1.5 rounded-full" 
                              style={{ width: `${(coupon.redemptions / coupon.maxRedemptions) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">Impacto en ventas</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Valor total de canjes</p>
                          <p className="text-xs text-gray-500">Descuentos aplicados</p>
                        </div>
                        <p className="text-xl font-bold">$124.500</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Ventas generadas</p>
                          <p className="text-xs text-gray-500">Con cupones aplicados</p>
                        </div>
                        <p className="text-xl font-bold">$456.780</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">ROI promedio</p>
                          <p className="text-xs text-gray-500">Retorno de inversión</p>
                        </div>
                        <p className="text-xl font-bold text-green-600">3.67x</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Gestión de Concursos */
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Concursos y Sorteos</h3>
                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center">
                  <Plus size={16} className="mr-1" />
                  Nuevo Concurso
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premio</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contests.map(contest => (
                      <tr key={contest.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{contest.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            contest.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {contest.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{contest.participants}</td>
                        <td className="px-4 py-3 text-sm">
                          {contest.startsAt} - {contest.endsAt}
                        </td>
                        <td className="px-4 py-3 text-sm">{contest.prize}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Users size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Participantes y seguimiento de resultados */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Seguimiento de Resultados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">Participantes recientes</h5>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                          A
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Ana García</p>
                          <p className="text-xs text-gray-500">Hace 2 horas</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Instagram</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                          P
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Pablo Martínez</p>
                          <p className="text-xs text-gray-500">Hace 5 horas</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Instagram</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                          L
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Laura Sánchez</p>
                          <p className="text-xs text-gray-500">Hace 8 horas</p>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Facebook</span>
                      </div>
                      
                      <button className="w-full text-center text-sm text-indigo-600 mt-2 flex items-center justify-center">
                        Ver todos los participantes
                        <ChevronRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">Estadísticas del concurso</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <p className="text-sm">Tiempo restante</p>
                        </div>
                        <p className="text-sm font-medium">12 días</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users size={16} className="text-gray-500 mr-2" />
                          <p className="text-sm">Participantes por día</p>
                        </div>
                        <p className="text-sm font-medium">8.5</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Check size={16} className="text-gray-500 mr-2" />
                          <p className="text-sm">Tasa de finalización</p>
                        </div>
                        <p className="text-sm font-medium">92%</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Trophy size={16} className="text-gray-500 mr-2" />
                          <p className="text-sm">Ganador seleccionado</p>
                        </div>
                        <p className="text-sm font-medium">No</p>
                      </div>
                      
                      <button className="w-full text-center bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm mt-2">
                        Seleccionar ganador aleatorio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Ideas y plantillas promocionales */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ideas Promocionales</h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm">
            Ver todas
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
            <h4 className="font-medium text-gray-800 mb-2">2x1 en Cócteles</h4>
            <p className="text-sm text-gray-600 mb-3">
              Ofrece 2x1 en cócteles durante horas específicas para aumentar el tráfico en momentos de baja afluencia.
            </p>
            <button className="text-sm text-indigo-600">Usar esta idea</button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
            <h4 className="font-medium text-gray-800 mb-2">Cumpleaños Gratis</h4>
            <p className="text-sm text-gray-600 mb-3">
              Invita a un postre a los clientes en su cumpleaños para fomentar celebraciones en tu local.
            </p>
            <button className="text-sm text-indigo-600">Usar esta idea</button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
            <h4 className="font-medium text-gray-800 mb-2">Concurso de Fotos</h4>
            <p className="text-sm text-gray-600 mb-3">
              Premia a quienes compartan las mejores fotos de tus platos con hashtags específicos.
            </p>
            <button className="text-sm text-indigo-600">Usar esta idea</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoContent;
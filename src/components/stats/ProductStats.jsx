import React from 'react';
import { Package, ArrowUpDown, ArrowDown, ArrowUp, TrendingUp, Percent } from 'lucide-react';

/**
 * Componente para mostrar estadísticas de productos
 */
const ProductStats = ({ orders, products, dateRange }) => {
  // Crear un mapa de productos para búsqueda rápida
  const productsMap = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  // Calcular ventas por producto
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        const product = productsMap[item.productId] || { name: item.name };
        productSales[item.productId] = {
          id: item.productId,
          name: product.name,
          category: product.category || 'sin categoría',
          quantity: 0,
          revenue: 0,
          cost: 0,
          profit: 0
        };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
      
      // Calcular coste y beneficio si hay disponible
      if (productsMap[item.productId] && productsMap[item.productId].cost) {
        const cost = productsMap[item.productId].cost * item.quantity;
        productSales[item.productId].cost += cost;
        productSales[item.productId].profit += (item.price * item.quantity) - cost;
      }
    });
  });
  
  // Convertir a array y ordenar por ingresos
  const productSalesArray = Object.values(productSales);
  const topProducts = [...productSalesArray].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  const topQuantityProducts = [...productSalesArray].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
  
  // Calcular estadísticas por categoría
  const categoryStats = {};
  productSalesArray.forEach(product => {
    const category = product.category;
    if (!categoryStats[category]) {
      categoryStats[category] = {
        name: category,
        revenue: 0,
        quantity: 0,
        products: 0
      };
    }
    categoryStats[category].revenue += product.revenue;
    categoryStats[category].quantity += product.quantity;
    categoryStats[category].products += 1;
  });
  
  // Convertir a array y ordenar por ingresos
  const categoryStatsArray = Object.values(categoryStats);
  const sortedCategories = [...categoryStatsArray].sort((a, b) => b.revenue - a.revenue);
  
  // Calcular totales
  const totalRevenue = productSalesArray.reduce((sum, product) => sum + product.revenue, 0);
  const totalQuantity = productSalesArray.reduce((sum, product) => sum + product.quantity, 0);
  const totalProfit = productSalesArray.reduce((sum, product) => sum + (product.profit || 0), 0);
  const averageMargin = totalRevenue > 0 && totalProfit ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Calcular rotación de stock (simulado)
  const stockTurnover = totalQuantity / Math.max(1, products.length);
  
  return (
    <div>
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Productos Vendidos</p>
              <p className="text-3xl font-bold">{totalQuantity}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Package size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {dateRange === 'today' ? 'Hoy' : 
             dateRange === 'yesterday' ? 'Ayer' : 
             dateRange === 'week' ? 'Esta semana' : 
             dateRange === 'month' ? 'Este mes' : 'Todo el tiempo'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ventas por Producto</p>
              <p className="text-3xl font-bold">{totalRevenue} </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm flex items-center text-sm text-gray-500">
            <span className="text-green-500 flex items-center mr-1">
              <ArrowUp size={14} />
            </span>
            {productSalesArray.length} productos diferentes
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Margen Promedio</p>
              <p className="text-3xl font-bold">{averageMargin.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <Percent size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {totalProfit}  beneficio
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rotación de Stock</p>
              <p className="text-3xl font-bold">{stockTurnover.toFixed(1)}x</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ArrowUpDown size={24} />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Promedio de rotación
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top productos por ingresos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top 10 Productos por Ingresos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">{index + 1}.</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-center">{product.quantity}</td>
                    <td className="py-2 text-sm text-right font-medium">{product.revenue} </td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No hay datos de ventas en el período seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Top productos por cantidad */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top 10 Productos por Cantidad</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% del Total</th>
                </tr>
              </thead>
              <tbody>
                {topQuantityProducts.map((product, index) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">{index + 1}.</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-center">{product.quantity}</td>
                    <td className="py-2 text-sm text-right">
                      {totalQuantity > 0 ? ((product.quantity / totalQuantity) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
                {topQuantityProducts.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">
                      No hay datos de ventas en el período seleccionado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Ventas por Categoría */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Ventas por Categoría</h3>
        
        {sortedCategories.map((category, index) => {
          const percentage = totalRevenue > 0 ? (category.revenue / totalRevenue) * 100 : 0;
          return (
            <div key={category.name} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="font-medium">{category.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({category.products} productos, {category.quantity} vendidos)
                  </span>
                </div>
                <span className="text-gray-900 font-medium">{category.revenue} </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${
                    index === 0 ? 'bg-indigo-500' : 
                    index === 1 ? 'bg-blue-500' : 
                    index === 2 ? 'bg-green-500' :
                    'bg-amber-500'
                  } h-2 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">
                {percentage.toFixed(1)}%
              </p>
            </div>
          );
        })}
        
        {sortedCategories.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            No hay datos de ventas por categoría en el período seleccionado
          </div>
        )}
      </div>
      
      {/* Productos con margen más alto y más bajo (si hay datos de coste) */}
      {totalProfit > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Productos con Mayor Margen</h3>
            <div className="space-y-4">
              {productSalesArray
                .filter(p => p.profit > 0)
                .sort((a, b) => (b.profit / b.revenue) - (a.profit / a.revenue))
                .slice(0, 5)
                .map((product, index) => {
                  const margin = product.revenue > 0 ? (product.profit / product.revenue) * 100 : 0;
                  return (
                    <div key={product.id} className="flex items-center">
                      <div className="mr-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${margin}%` }}></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{margin.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">{product.profit} </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Productos con Menor Margen</h3>
            <div className="space-y-4">
              {productSalesArray
                .filter(p => p.revenue > 0)
                .sort((a, b) => (a.profit / a.revenue) - (b.profit / b.revenue))
                .slice(0, 5)
                .map((product, index) => {
                  const margin = product.revenue > 0 ? (product.profit / product.revenue) * 100 : 0;
                  return (
                    <div key={product.id} className="flex items-center">
                      <div className="mr-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${Math.max(5, margin)}%` }}></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">{margin.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">{product.profit} </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      
      {/* Análisis de inventario no vendido (simulado) */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">Estado de Inventario</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Productos Activos</h4>
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              {productSalesArray.length} con ventas en el período
            </p>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Productos sin Ventas</h4>
            <p className="text-2xl font-bold">{products.length - productSalesArray.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              {((products.length - productSalesArray.length) / Math.max(1, products.length) * 100).toFixed(1)}% del catálogo
            </p>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Valoración del Stock</h4>
            <p className="text-2xl font-bold">
              {products.reduce((sum, p) => sum + (p.cost || 0), 0)} 
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Valor estimado del inventario
            </p>
          </div>
        </div>
        
        {/* Productos que no han tenido ventas en el período */}
        {products.length - productSalesArray.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Productos sin ventas en el período</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(p => !productSalesArray.some(sold => sold.id === p.id))
                    .slice(0, 10)
                    .map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 text-sm">
                          <span className="font-medium">{product.name}</span>
                        </td>
                        <td className="py-2 text-sm text-center">{product.category}</td>
                        <td className="py-2 text-sm text-right font-medium">{product.price} </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 text-right mt-2">
              Mostrando 10 primeros productos sin ventas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductStats;
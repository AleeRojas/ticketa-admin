import React, { useState, useEffect } from 'react';
import { X, Save, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const BulkEditModal = ({ onClose, selectedProducts = [], products, categories, onUpdateProducts }) => {
  const { handleSaveProduct } = useAppContext();
  const [editFields, setEditFields] = useState({
    price: { enabled: false, value: '', operation: 'set', percent: 10 },
    cost: { enabled: false, value: '', operation: 'set', percent: 10 },
    category: { enabled: false, value: '' },
    available: { enabled: false, value: true },
    featured: { enabled: false, value: false },
    stock: { enabled: false, value: 0, operation: 'set' }
  });
  
  const [summary, setSummary] = useState({
    products: [],
    changes: {
      price: { min: 0, max: 0, avg: 0, values: [] },
      cost: { min: 0, max: 0, avg: 0, values: [] },
      stock: { min: 0, max: 0, avg: 0, values: [] }
    }
  });
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (selectedProducts.length === 0) return;
    
    const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
    const newSummary = {
      products: selectedProductsData,
      changes: {
        price: { min: 0, max: 0, avg: 0, values: [] },
        cost: { min: 0, max: 0, avg: 0, values: [] },
        stock: { min: 0, max: 0, avg: 0, values: [] }
      }
    };
    
    if (editFields.price.enabled) {
      const newPrices = selectedProductsData.map(product => {
        let newPrice = product.price || 0;
        
        if (editFields.price.operation === 'set') {
          newPrice = parseFloat(editFields.price.value) || 0;
        } else if (editFields.price.operation === 'increase') {
          if (editFields.price.value.endsWith('%')) {
            const percent = parseFloat(editFields.price.value) / 100;
            newPrice += newPrice * percent;
          } else {
            newPrice += parseFloat(editFields.price.value) || 0;
          }
        } else if (editFields.price.operation === 'decrease') {
          if (editFields.price.value.endsWith('%')) {
            const percent = parseFloat(editFields.price.value) / 100;
            newPrice -= newPrice * percent;
          } else {
            newPrice -= parseFloat(editFields.price.value) || 0;
          }
        }
        
        return Math.max(0, newPrice);
      });
      
      if (newPrices.length > 0) {
        newSummary.changes.price.min = Math.min(...newPrices);
        newSummary.changes.price.max = Math.max(...newPrices);
        newSummary.changes.price.avg = newPrices.reduce((a, b) => a + b, 0) / newPrices.length;
        newSummary.changes.price.values = newPrices;
      }
    }
    
    if (editFields.cost.enabled) {
      const newCosts = selectedProductsData.map(product => {
        let newCost = product.cost || 0;
        
        if (editFields.cost.operation === 'set') {
          newCost = parseFloat(editFields.cost.value) || 0;
        } else if (editFields.cost.operation === 'increase') {
          if (editFields.cost.value.endsWith('%')) {
            const percent = parseFloat(editFields.cost.value) / 100;
            newCost += newCost * percent;
          } else {
            newCost += parseFloat(editFields.cost.value) || 0;
          }
        } else if (editFields.cost.operation === 'decrease') {
          if (editFields.cost.value.endsWith('%')) {
            const percent = parseFloat(editFields.cost.value) / 100;
            newCost -= newCost * percent;
          } else {
            newCost -= parseFloat(editFields.cost.value) || 0;
          }
        }
        
        return Math.max(0, newCost);
      });
      
      if (newCosts.length > 0) {
        newSummary.changes.cost.min = Math.min(...newCosts);
        newSummary.changes.cost.max = Math.max(...newCosts);
        newSummary.changes.cost.avg = newCosts.reduce((a, b) => a + b, 0) / newCosts.length;
        newSummary.changes.cost.values = newCosts;
      }
    }
    
    if (editFields.stock.enabled) {
      const newStocks = selectedProductsData.map(product => {
        let newStock = product.stock || 0;
        
        if (editFields.stock.operation === 'set') {
          newStock = parseInt(editFields.stock.value) || 0;
        } else if (editFields.stock.operation === 'increase') {
          if (editFields.stock.value.endsWith('%')) {
            const percent = parseFloat(editFields.stock.value) / 100;
            newStock += Math.round(newStock * percent);
          } else {
            newStock += parseInt(editFields.stock.value) || 0;
          }
        } else if (editFields.stock.operation === 'decrease') {
          if (editFields.stock.value.endsWith('%')) {
            const percent = parseFloat(editFields.stock.value) / 100;
            newStock -= Math.round(newStock * percent);
          } else {
            newStock -= parseInt(editFields.stock.value) || 0;
          }
        }
        
        return Math.max(0, newStock);
      });
      
      if (newStocks.length > 0) {
        newSummary.changes.stock.min = Math.min(...newStocks);
        newSummary.changes.stock.max = Math.max(...newStocks);
        newSummary.changes.stock.avg = newStocks.reduce((a, b) => a + b, 0) / newStocks.length;
        newSummary.changes.stock.values = newStocks;
      }
    }
    
    setSummary(newSummary);
  }, [selectedProducts, products, editFields]);
  
  const handleEnableField = (field) => {
    setEditFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        enabled: !prev[field].enabled
      }
    }));
  };
  
  const handleFieldChange = (field, key, value) => {
    setEditFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value
      }
    }));
  };
  
  const applyChanges = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
      const totalProducts = selectedProductsData.length;
      
      for (let i = 0; i < selectedProductsData.length; i++) {
        const product = selectedProductsData[i];
        const updates = {};
        
        if (editFields.price.enabled) {
          updates.price = summary.changes.price.values[i] || product.price;
        }
        
        if (editFields.cost.enabled) {
          updates.cost = summary.changes.cost.values[i] || product.cost;
        }
        
        if (editFields.category.enabled) {
          updates.category = editFields.category.value;
        }
        
        if (editFields.available.enabled) {
          updates.available = editFields.available.value;
        }
        
        if (editFields.featured.enabled) {
          updates.featured = editFields.featured.value;
        }
        
        if (editFields.stock.enabled) {
          updates.stock = summary.changes.stock.values[i] || product.stock;
        }
        
        await handleSaveProduct({
          ...product,
          ...updates
        });
        
        setProgress(Math.round(((i + 1) / totalProducts) * 100));
        
        if (totalProducts > 20) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
      
      if (onUpdateProducts) onUpdateProducts();
      onClose();
    } catch (error) {
      console.error('Error al aplicar cambios:', error);
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edición masiva ({selectedProducts.length})</h3>
          <button onClick={onClose} disabled={isProcessing}><X size={20} /></button>
        </div>
        
        {isProcessing ? (
          <div className="text-center py-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${progress}%`}}></div>
            </div>
            <p className="text-sm text-gray-500">{progress}% completado</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {/* Precio */}
              <div className="border rounded p-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editFields.price.enabled}
                    onChange={() => handleEnableField('price')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Actualizar precios</span>
                </div>
                
                {editFields.price.enabled && (
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <select
                      value={editFields.price.operation}
                      onChange={(e) => handleFieldChange('price', 'operation', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="set">Establecer precio</option>
                      <option value="increase">Aumentar</option>
                      <option value="decrease">Reducir</option>
                    </select>
                    
                    <div className="relative">
                      <input
                        type="text"
                        value={editFields.price.value}
                        onChange={(e) => handleFieldChange('price', 'value', e.target.value)}
                        placeholder={editFields.price.operation === 'set' ? "10.99" : "10 o 10%"}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Coste */}
              <div className="border rounded p-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editFields.cost.enabled}
                    onChange={() => handleEnableField('cost')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Actualizar costes</span>
                </div>
                
                {editFields.cost.enabled && (
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <select
                      value={editFields.cost.operation}
                      onChange={(e) => handleFieldChange('cost', 'operation', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="set">Establecer coste</option>
                      <option value="increase">Aumentar</option>
                      <option value="decrease">Reducir</option>
                    </select>
                    
                    <div className="relative">
                      <input
                        type="text"
                        value={editFields.cost.value}
                        onChange={(e) => handleFieldChange('cost', 'value', e.target.value)}
                        placeholder={editFields.cost.operation === 'set' ? "5.99" : "10 o 10%"}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Stock */}
              <div className="border rounded p-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editFields.stock.enabled}
                    onChange={() => handleEnableField('stock')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Actualizar stock</span>
                </div>
                
                {editFields.stock.enabled && (
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <select
                      value={editFields.stock.operation}
                      onChange={(e) => handleFieldChange('stock', 'operation', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="set">Establecer stock</option>
                      <option value="increase">Aumentar</option>
                      <option value="decrease">Reducir</option>
                    </select>
                    
                    <input
                      type="text"
                      value={editFields.stock.value}
                      onChange={(e) => handleFieldChange('stock', 'value', e.target.value)}
                      placeholder={editFields.stock.operation === 'set' ? "100" : "10 o 10%"}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                )}
              </div>
              
              {/* Categoría */}
              <div className="border rounded p-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editFields.category.enabled}
                    onChange={() => handleEnableField('category')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Cambiar categoría</span>
                </div>
                
                {editFields.category.enabled && (
                  <div className="ml-6">
                    <select
                      value={editFields.category.value}
                      onChange={(e) => handleFieldChange('category', 'value', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Seleccionar...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {/* Disponibilidad */}
              <div className="border rounded p-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editFields.available.enabled}
                    onChange={() => handleEnableField('available')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Disponibilidad</span>
                </div>
                
                {editFields.available.enabled && (
                  <div className="ml-6 flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="available"
                        checked={editFields.available.value === true}
                        onChange={() => handleFieldChange('available', 'value', true)}
                        className="mr-2"
                      />
                      <span className="text-sm">Disponible</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="available"
                        checked={editFields.available.value === false}
                        onChange={() => handleFieldChange('available', 'value', false)}
                        className="mr-2"
                      />
                      <span className="text-sm">No disponible</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Destacado */}
              <div className="border rounded p-2">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={editFields.featured.enabled}
                    onChange={() => handleEnableField('featured')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Destacado</span>
                </div>
                
                {editFields.featured.enabled && (
                  <div className="ml-6 flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="featured"
                        checked={editFields.featured.value === true}
                        onChange={() => handleFieldChange('featured', 'value', true)}
                        className="mr-2"
                      />
                      <span className="text-sm">Sí</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="featured"
                        checked={editFields.featured.value === false}
                        onChange={() => handleFieldChange('featured', 'value', false)}
                        className="mr-2"
                      />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={onClose}
                className="border px-3 py-1 text-sm rounded"
              >
                Cancelar
              </button>
              
              <button
                onClick={applyChanges}
                className={`px-3 py-1 text-sm text-white rounded ${
                  !showConfirmation ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}
                disabled={
                  !editFields.price.enabled && 
                  !editFields.cost.enabled && 
                  !editFields.category.enabled && 
                  !editFields.available.enabled && 
                  !editFields.featured.enabled &&
                  !editFields.stock.enabled
                }
              >
                {showConfirmation ? 'Confirmar' : 'Aplicar'}
              </button>
            </div>
            
            {showConfirmation && (
              <div className="mt-3 bg-amber-50 border border-amber-300 rounded p-2 text-sm">
                <p>¿Confirmar modificación de {selectedProducts.length} productos?</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BulkEditModal;
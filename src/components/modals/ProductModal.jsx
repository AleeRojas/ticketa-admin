import React, { useState, useEffect } from 'react';
import { X, Save, Trash, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

/**
 * Modal para crear y editar productos
 */
const ProductModal = ({ onClose, product, categories }) => {
  const { handleSaveProduct, handleDeleteProduct } = useAppContext();
  
  // Estado inicial del formulario
  const initialState = product ? { ...product } : {
    name: '',
    description: '',
    price: 0,
    cost: 0,
    category: categories[0]?.id || '',
    available: true,
    emoji: '🍽️',
    ingredients: [],
    allergens: []
  };
  
  // Estado del formulario
  const [formData, setFormData] = useState(initialState);
  
  // Estado para ingredientes y alérgenos temporales
  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergen, setNewAllergen] = useState('');
  
  // Lista de emojis para productos
  const productEmojis = ['🍽️', '🍔', '🍕', '🍝', '🍣', '🍦', '🍗', '🥗', '🥪', '🍰', '🍺', '☕', '🍷', '🥤'];
  
  // Resetear el formulario cuando cambia el producto
  useEffect(() => {
    if (product) {
      // Asegurarse de que ingredients y allergens sean arrays
      const formattedProduct = {
        ...product,
        ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
        allergens: Array.isArray(product.allergens) ? product.allergens : []
      };
      setFormData(formattedProduct);
    } else {
      setFormData(initialState);
    }
  }, [product]);
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Para inputs numéricos, convertir a número
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Añadir un nuevo ingrediente
  const addIngredient = () => {
    if (newIngredient.trim() !== '') {
      // Asegurarse de que ingredients sea un array
      const currentIngredients = Array.isArray(formData.ingredients) ? formData.ingredients : [];
      
      setFormData({
        ...formData,
        ingredients: [...currentIngredients, newIngredient.trim()]
      });
      setNewIngredient('');
    }
  };
  
  // Eliminar un ingrediente
  const removeIngredient = (index) => {
    // Asegurarse de que ingredients sea un array
    if (!Array.isArray(formData.ingredients)) return;
    
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: updatedIngredients
    });
  };
  
  // Añadir un nuevo alérgeno
  const addAllergen = () => {
    if (newAllergen.trim() !== '') {
      // Asegurarse de que allergens sea un array
      const currentAllergens = Array.isArray(formData.allergens) ? formData.allergens : [];
      
      setFormData({
        ...formData,
        allergens: [...currentAllergens, newAllergen.trim()]
      });
      setNewAllergen('');
    }
  };
  
  // Eliminar un alérgeno
  const removeAllergen = (index) => {
    // Asegurarse de que allergens sea un array
    if (!Array.isArray(formData.allergens)) return;
    
    const updatedAllergens = [...formData.allergens];
    updatedAllergens.splice(index, 1);
    setFormData({
      ...formData,
      allergens: updatedAllergens
    });
  };
  
  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Asegurarse de que ingredients y allergens sean arrays
    const finalData = {
      ...formData,
      ingredients: Array.isArray(formData.ingredients) ? formData.ingredients : [],
      allergens: Array.isArray(formData.allergens) ? formData.allergens : []
    };
    
    handleSaveProduct(finalData);
    onClose();
  };
  
  // Manejar la eliminación del producto
  const handleDelete = () => {
    if (product && confirm('¿Está seguro de que desea eliminar este producto?')) {
      handleDeleteProduct(product.id);
      onClose();
    }
  };
  
  // Calcular margen y porcentaje
  const margin = formData.price - formData.cost;
  const marginPercentage = formData.price > 0 ? (margin / formData.price) * 100 : 0;

  // Asegurarse de que ingredients y allergens sean arrays
  const safeIngredients = Array.isArray(formData.ingredients) ? formData.ingredients : [];
  const safeAllergens = Array.isArray(formData.allergens) ? formData.allergens : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio ()
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coste ()
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost || 0}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                id="available"
                checked={formData.available !== false}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="available" className="ml-2 block text-sm font-medium text-gray-700">
                Disponible para venta
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emoji
              </label>
              <div className="flex flex-wrap gap-2">
                {productEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, emoji })}
                    className={`h-8 w-8 flex items-center justify-center text-xl rounded-md ${
                      formData.emoji === emoji 
                        ? 'bg-indigo-100 border-2 border-indigo-500' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sección de margen */}
          {formData.price > 0 && formData.cost > 0 && (
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Información de margen</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Margen</p>
                  <p className="text-sm font-medium">{margin} </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Porcentaje</p>
                  <p className={`text-sm font-medium ${marginPercentage >= 30 ? 'text-emerald-600' : marginPercentage >= 15 ? 'text-amber-600' : 'text-red-600'}`}>
                    {marginPercentage.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        marginPercentage >= 30 ? 'bg-emerald-500' : 
                        marginPercentage >= 15 ? 'bg-amber-500' : 
                        'bg-red-500'
                      }`} 
                      style={{width: `${Math.min(marginPercentage, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Sección de ingredientes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredientes
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Añadir ingrediente..."
              />
              <button
                type="button"
                onClick={addIngredient}
                className="bg-indigo-600 text-white rounded-r-md px-3 py-2 text-sm font-medium hover:bg-indigo-700"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {safeIngredients.map((ingredient, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm"
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {safeIngredients.length === 0 && (
                <p className="text-sm text-gray-500">No hay ingredientes</p>
              )}
            </div>
          </div>
          
          {/* Sección de alérgenos */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alérgenos
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Añadir alérgeno..."
              />
              <button
                type="button"
                onClick={addAllergen}
                className="bg-indigo-600 text-white rounded-r-md px-3 py-2 text-sm font-medium hover:bg-indigo-700"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {safeAllergens.map((allergen, index) => (
                <div 
                  key={index} 
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center text-sm"
                >
                  {allergen}
                  <button
                    type="button"
                    onClick={() => removeAllergen(index)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {safeAllergens.length === 0 && (
                <p className="text-sm text-gray-500">No hay alérgenos</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            {product && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Eliminar Producto
              </button>
            )}
            
            <div className="flex space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 flex items-center"
              >
                <Save size={16} className="mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
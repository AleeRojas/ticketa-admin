import { useState } from 'react';
import { initialTables } from '../data/initialTables';

/**
 * Hook para la gestión de mesas
 * @param {Array} initialTablesData - Datos iniciales de mesas (opcional, por defecto initialTables)
 * @returns {Object} - Métodos y estados para gestionar mesas
 */
const useTableManagement = (initialTablesData = initialTables) => {
  const [tables, setTables] = useState(initialTablesData);
  const [editingTable, setEditingTable] = useState(null);
  
  /**
   * Crear una nueva mesa
   * @param {Object} tableData - Datos de la mesa a crear
   * @returns {Object} - La mesa creada con su ID asignado
   */
  const createTable = (tableData) => {
    const newId = Math.max(...tables.map(t => t.id), 0) + 1;
    const newTable = { ...tableData, id: newId };
    
    setTables(prev => [...prev, newTable]);
    return newTable;
  };
  
  /**
   * Actualizar una mesa existente
   * @param {number} tableId - ID de la mesa a actualizar
   * @param {Object} tableData - Nuevos datos para la mesa
   * @returns {Object|null} - La mesa actualizada o null si no se encontró
   */
  const updateTable = (tableId, tableData) => {
    let updatedTable = null;
    
    setTables(prev => {
      const newTables = prev.map(table => {
        if (table.id === tableId) {
          updatedTable = { ...table, ...tableData };
          return updatedTable;
        }
        return table;
      });
      
      return newTables;
    });
    
    return updatedTable;
  };
  
  /**
   * Eliminar una mesa existente
   * @param {number} tableId - ID de la mesa a eliminar
   * @returns {boolean} - true si se eliminó correctamente, false si no se encontró
   */
  const deleteTable = (tableId) => {
    let found = false;
    
    setTables(prev => {
      found = prev.some(table => table.id === tableId);
      return prev.filter(table => table.id !== tableId);
    });
    
    return found;
  };
  
  /**
   * Cambiar el estado de una mesa
   * @param {number} tableId - ID de la mesa
   * @param {string} newStatus - Nuevo estado ('libre', 'ocupada', 'pagando', 'reservada')
   * @returns {Object|null} - La mesa actualizada o null si no se encontró
   */
  const changeTableStatus = (tableId, newStatus) => {
    // Calcular el nuevo tiempo basado en el estado
    const newTime = newStatus === 'libre' 
      ? '00:00' 
      : (newStatus === 'reservada' 
          ? '00:00' 
          : `00:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`);
    
    return updateTable(tableId, { status: newStatus, time: newTime });
  };
  
  /**
   * Mover una mesa a otro salón
   * @param {number} tableId - ID de la mesa a mover
   * @param {string} newSalonId - ID del nuevo salón
   * @returns {Object|null} - La mesa actualizada o null si no se encontró
   */
  const moveTableToSalon = (tableId, newSalonId) => {
    return updateTable(tableId, { salon: newSalonId });
  };
  
  /**
   * Obtener todas las mesas de un salón específico
   * @param {string} salonId - ID del salón
   * @returns {Array} - Array de mesas filtradas por salón
   */
  const getTablesBySalon = (salonId) => {
    return tables.filter(table => table.salon === salonId);
  };
  
  /**
   * Obtener una mesa por su ID
   * @param {number} tableId - ID de la mesa
   * @returns {Object|undefined} - La mesa encontrada o undefined
   */
  const getTableById = (tableId) => {
    return tables.find(table => table.id === tableId);
  };
  
  /**
   * Actualizar la posición de una mesa en la vista de salón
   * @param {number} tableId - ID de la mesa
   * @param {number} x - Posición X (0-100)
   * @param {number} y - Posición Y (0-100)
   * @returns {Object|null} - La mesa actualizada o null si no se encontró
   */
  const updateTablePosition = (tableId, x, y) => {
    return updateTable(tableId, { x, y });
  };
  
  return {
    tables,
    setTables,
    editingTable,
    setEditingTable,
    createTable,
    updateTable,
    deleteTable,
    changeTableStatus,
    moveTableToSalon,
    getTablesBySalon,
    getTableById,
    updateTablePosition
  };
};

export default useTableManagement;

import React, { useState, useEffect } from 'react';
import api from '../api';

export default function CreditosList({ onVolver }) {
  const [creditos, setCreditos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos'); // todos, pendiente, pagado
  const [cargando, setCargando] = useState(false);

  // Cargar créditos
  useEffect(() => {
    cargarCreditos();
  }, []);

  const cargarCreditos = async () => {
    setCargando(true);
    try {
      const res = await api.get('/creditos');
      setCreditos(res.data);
    } catch (err) {
      console.error("Error al cargar créditos", err);
    } finally {
      setCargando(false);
    }
  };

  // Marcar como pagado
  const marcarComoPagado = async (id) => {
    try {
      await api.put(`/creditos/${id}`, { estado: 'Realizado' });
      setCreditos(creditos.map(c => c._id === id ? { ...c, estado: 'Realizado' } : c));
      alert("✅ ¡Pago registrado con éxito!");
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error al registrar el pago");
    }
  };

  // Filtrar créditos
  const creditosFiltrados = creditos.filter(cr => {
    const coincideNombre = cr.clienteID?.nombre.toLowerCase().includes(filtro.toLowerCase());
    const coincideEstado = estadoFiltro === 'todos' || cr.estado === (estadoFiltro === 'pendiente' ? 'Pendiente' : 'Realizado');
    return coincideNombre && coincideEstado;
  });

  // Cálculos
  const totalPrestado = creditos
    .filter(cr => cr.estado === 'Pendiente')
    .reduce((sum, cr) => sum + cr.monto_prestado, 0);

  const creditosPendientes = creditosFiltrados.filter(cr => cr.estado === 'Pendiente');

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-CO');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button onClick={onVolver} className="mb-4 text-blue-600 font-bold flex items-center">
        ← Regresar al Menú
      </button>

      <h2 className="text-2xl font-black text-gray-800 mb-6">Control de Cobros</h2>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded-lg">
          <p className="text-orange-800 text-xs font-bold uppercase">Total Prestado (Pendiente)</p>
          <p className="text-3xl font-black text-orange-900">${totalPrestado.toLocaleString('es-CO', {minimumFractionDigits: 0})}</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-800 text-xs font-bold uppercase">Créditos Pendientes</p>
          <p className="text-3xl font-black text-green-900">{creditosPendientes.length}</p>
        </div>
      </div>

      {/* Buscador */}
      <input 
        type="text" 
        placeholder="Buscar por nombre del cliente..." 
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {/* Filtros por estado */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setEstadoFiltro('todos')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            estadoFiltro === 'todos' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos ({creditos.length})
        </button>
        <button
          onClick={() => setEstadoFiltro('pendiente')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            estadoFiltro === 'pendiente' 
              ? 'bg-orange-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ⏳ Pendientes ({creditos.filter(c => c.estado === 'Pendiente').length})
        </button>
        <button
          onClick={() => setEstadoFiltro('pagado')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
            estadoFiltro === 'pagado' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✅ Pagados ({creditos.filter(c => c.estado === 'Realizado').length})
        </button>
      </div>

      {/* Lista de créditos */}
      {cargando ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : creditosFiltrados.length > 0 ? (
        <div className="space-y-3">
          {creditosFiltrados.map(credito => (
            <div 
              key={credito._id} 
              className={`p-4 rounded-2xl shadow-md ${
                credito.estado === 'Pendiente' 
                  ? 'bg-white border-l-4 border-orange-500' 
                  : 'bg-green-50 border-l-4 border-green-500'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-black text-lg text-gray-900">{credito.clienteID?.nombre || 'Cliente Desconocido'}</p>
                  <p className="text-sm text-gray-600">CC: {credito.clienteID?.cedula}</p>
                </div>
                
                {/* Indicador de estado */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-2xl ${
                  credito.estado === 'Pendiente' 
                    ? 'bg-orange-500' 
                    : 'bg-green-500'
                }`}>
                  {credito.estado === 'Pendiente' ? '⏳' : '✅'}
                </div>
              </div>

              {/* Información económica */}
              <div className="grid grid-cols-2 gap-3 mb-3 bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Prestado</p>
                  <p className="text-lg font-black text-blue-900">${credito.monto_prestado.toLocaleString('es-CO', {minimumFractionDigits: 0})}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">A Cobrar (+30%)</p>
                  <p className="text-lg font-black text-green-900">${credito.monto_por_pagar.toLocaleString('es-CO', {minimumFractionDigits: 0})}</p>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Fecha Préstamo</p>
                  <p className="text-gray-800 font-bold">{formatDate(credito.fecha_origen)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Vencimiento</p>
                  <p className="text-gray-800 font-bold">{credito.fecha_vencimiento ? formatDate(credito.fecha_vencimiento) : '—'}</p>
                </div>
              </div>

              {/* Estado */}
              <p className={`text-xs font-bold uppercase mb-3 ${
                credito.estado === 'Pendiente' 
                  ? 'text-orange-700' 
                  : 'text-green-700'
              }`}>
                Estado: {credito.estado === 'Pendiente' ? 'PENDIENTE DE PAGO' : 'PAGADO'}
                {credito.fecha_pago && credito.estado === 'Realizado' && (
                  <span className="block">Pagado: {formatDate(credito.fecha_pago)}</span>
                )}
              </p>

              {/* Botón acción */}
              {credito.estado === 'Pendiente' && (
                <button 
                  onClick={() => marcarComoPagado(credito._id)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition active:scale-95"
                >
                  REGISTRAR PAGO
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl text-center">
          <p className="text-gray-500 font-bold">No hay créditos para mostrar</p>
          {filtro && <p className="text-gray-400 text-sm">Intenta con otro término de búsqueda</p>}
        </div>
      )}
    </div>
  );
}
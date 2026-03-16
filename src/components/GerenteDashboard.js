import React, { useEffect, useState } from 'react';
import api from '../api';

export default function GerenteDashboard({ gerenteId }) {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const res = await api.get(`/gerentes/${gerenteId}/estadisticas`);
        console.log('✅ Estadísticas cargadas:', res.data);
        setEstadisticas(res.data.estadisticas);
      } catch (err) {
        console.error('❌ Error al cargar estadísticas:', err);
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setCargando(false);
      }
    };

    if (gerenteId) {
      cargarEstadisticas();
    }
  }, [gerenteId]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">⏳</p>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded">
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-gray-800 mb-8">📊 PANEL DE CONTROL</h1>

        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Oficinas */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Oficinas</p>
                <p className="text-4xl font-black text-blue-600">{estadisticas?.totalOficinas || 0}</p>
              </div>
              <span className="text-5xl">🏢</span>
            </div>
          </div>

          {/* Cobradores */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Cobradores</p>
                <p className="text-4xl font-black text-purple-600">{estadisticas?.totalCobradores || 0}</p>
              </div>
              <span className="text-5xl">👥</span>
            </div>
          </div>

          {/* Clientes */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Clientes</p>
                <p className="text-4xl font-black text-green-600">{estadisticas?.totalClientes || 0}</p>
              </div>
              <span className="text-5xl">👨‍👩‍👧</span>
            </div>
          </div>

          {/* Dinero Prestado */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-orange-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Dinero Prestado</p>
                <p className="text-3xl font-black text-orange-600">
                  ${(estadisticas?.totalDineroPrestado || 0).toLocaleString()}
                </p>
              </div>
              <span className="text-5xl">💰</span>
            </div>
          </div>

          {/* Dinero por Cobrar */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-red-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Por Cobrar (+ 30%)</p>
                <p className="text-3xl font-black text-red-600">
                  ${(estadisticas?.totalDineroActual || 0).toLocaleString()}
                </p>
              </div>
              <span className="text-5xl">📈</span>
            </div>
          </div>

          {/* Créditos Pendientes */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-yellow-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold text-sm">Pendientes vs Pagados</p>
                <p className="text-2xl font-black text-yellow-600">
                  {estadisticas?.creditosPendientes || 0} / {estadisticas?.creditosRealizados || 0}
                </p>
              </div>
              <span className="text-5xl">⏳</span>
            </div>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 RESUMEN</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-600">🏢 Oficinas activas: <strong>{estadisticas?.totalOficinas}</strong></p>
              <p className="text-gray-600">👥 Personal de cobranza: <strong>{estadisticas?.totalCobradores}</strong></p>
              <p className="text-gray-600">👨‍👩‍👧 Clientes registrados: <strong>{estadisticas?.totalClientes}</strong></p>
            </div>
            <div>
              <p className="text-gray-600">💰 Capital invertido: <strong>${(estadisticas?.totalDineroPrestado || 0).toLocaleString()}</strong></p>
              <p className="text-gray-600">📊 Ganancias esperadas: <strong>${((estadisticas?.totalDineroActual || 0) - (estadisticas?.totalDineroPrestado || 0)).toLocaleString()}</strong></p>
              <p className="text-gray-600">✅ Eficiencia de cobranza: <strong>{estadisticas?.creditosRealizados ? Math.round((estadisticas.creditosRealizados / (estadisticas.creditosPendientes + estadisticas.creditosRealizados)) * 100) : 0}%</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

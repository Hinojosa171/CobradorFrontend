import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCobradores: 0,
    totalClientes: 0,
    totalCreditos: 0,
    creditosPendientes: 0,
    creditosRealizados: 0,
    totalPrestado: 0,
    totalPorPagar: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const [cobradores, clientes, creditos] = await Promise.all([
        api.get('/cobradores'),
        api.get('/clientes'),
        api.get('/creditos'),
      ]);

      const creditosPendientes = creditos.data.filter(c => c.estado === 'Pendiente').length;
      const creditosRealizados = creditos.data.filter(c => c.estado === 'Realizado').length;

      const totalPrestado = creditos.data.reduce((sum, c) => sum + (c.monto_prestado || 0), 0);
      const totalPorPagar = creditos.data.reduce((sum, c) => sum + (c.monto_por_pagar || 0), 0);

      setStats({
        totalCobradores: cobradores.data.length,
        totalClientes: clientes.data.length,
        totalCreditos: creditos.data.length,
        creditosPendientes,
        creditosRealizados,
        totalPrestado,
        totalPorPagar,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Cobradores" 
          value={stats.totalCobradores} 
          icon={<Users size={32} />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Clientes" 
          value={stats.totalClientes} 
          icon={<Users size={32} />}
          color="bg-green-500"
        />
        <StatCard 
          title="Total Créditos" 
          value={stats.totalCreditos} 
          icon={<TrendingUp size={32} />}
          color="bg-orange-500"
        />
        <StatCard 
          title="Dinero en Sistema" 
          value={`$${stats.totalPorPagar.toLocaleString('es-CO')}`} 
          icon={<DollarSign size={32} />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-orange-500" />
            Estado de Créditos
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Pendientes:</span>
              <span className="text-orange-500 font-bold text-lg">{stats.creditosPendientes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Realizados:</span>
              <span className="text-green-500 font-bold text-lg">{stats.creditosRealizados}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={24} className="text-purple-500" />
            Resumen Financiero
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Prestado:</span>
              <span className="text-blue-600 font-bold">
                ${stats.totalPrestado.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total por Pagar (con interés):</span>
              <span className="text-purple-600 font-bold">
                ${stats.totalPorPagar.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Interés Cobrado:</span>
                <span className="text-green-600 font-bold">
                  ${(stats.totalPorPagar - stats.totalPrestado).toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

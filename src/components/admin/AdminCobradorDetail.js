import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, DollarSign } from 'lucide-react';
import api from '../../api';

function AdminCobradorDetail({ cobradorId, onBack }) {
  const [cobrador, setCobrador] = useState(null);
  const [creditos, setCreditos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const resCobrador = await api.get(`/cobradores`);
        const datos = resCobrador.data.find(c => c._id === cobradorId);
        setCobrador(datos);
        
        const resCreditos = await api.get(`/creditos`);
        const creditosDeCobrador = resCreditos.data.filter(c => c.cobradorID === cobradorId);
        setCreditos(creditosDeCobrador);

        const resClientes = await api.get(`/clientes`);
        const clientesDeCobrador = resClientes.data.filter(c => c.cobradorID === cobradorId);
        setClientes(clientesDeCobrador);
      } catch (err) {
        setError('Error al cargar datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [cobradorId]);

  if (loading) {
    return <div className="text-center py-12">Cargando detalles del cobrador...</div>;
  }

  if (!cobrador) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft size={20} />
          Volver
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Cobrador no encontrado'}
        </div>
      </div>
    );
  }

  const creditosPendientes = creditos.filter(c => c.estado === 'Pendiente');
  const creditosRealizados = creditos.filter(c => c.estado === 'Realizado');
  const totalPrestado = creditos.reduce((sum, c) => sum + (c.monto_prestado || 0), 0);
  const totalPorPagar = creditos.reduce((sum, c) => sum + (c.monto_por_pagar || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={20} />
        Volver a Cobradores
      </button>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{cobrador.nombre}</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <p className="font-semibold text-gray-500 text-sm">Cédula</p>
              <p>{cobrador.cedula}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 text-sm">Usuario</p>
              <p>{cobrador.usuario}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 text-sm">Celular</p>
              <p>{cobrador.celular}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 text-sm">Dirección</p>
              <p>{cobrador.direccion}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 text-sm">Registrado</p>
              <p>{new Date(cobrador.fecha_creacion).toLocaleDateString('es-CO')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
          <StatBox 
            title="Clientes" 
            value={clientes.length} 
            icon={<Users size={28} />}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatBox 
            title="Créditos Activos" 
            value={creditosPendientes.length} 
            icon={<FileText size={28} />}
            bgColor="bg-orange-100"
            textColor="text-orange-600"
          />
          <StatBox 
            title="Total Prestado" 
            value={`$${totalPrestado.toLocaleString('es-CO')}`} 
            icon={<DollarSign size={28} />}
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <StatBox 
            title="Por Cobrar" 
            value={`$${totalPorPagar.toLocaleString('es-CO')}`} 
            icon={<DollarSign size={28} />}
            bgColor="bg-purple-100"
            textColor="text-purple-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users size={24} />
              Clientes ({clientes.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            {clientes.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">Sin clientes registrados</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Nombre</th>
                    <th className="text-left p-4 font-semibold text-sm">Cédula</th>
                    <th className="text-left p-4 font-semibold text-sm">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente._id} className="border-b hover:bg-gray-50 text-sm">
                      <td className="p-4">{cliente.nombre}</td>
                      <td className="p-4">{cliente.cedula}</td>
                      <td className="p-4">{cliente.telefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText size={24} />
              Créditos ({creditos.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            {creditos.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">Sin créditos registrados</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Monto</th>
                    <th className="text-left p-4 font-semibold text-sm">Estado</th>
                    <th className="text-left p-4 font-semibold text-sm">Vencimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {creditos.map(credito => {
                    return (
                      <tr key={credito._id} className="border-b hover:bg-gray-50 text-sm">
                        <td className="p-4">${credito.monto_prestado.toLocaleString('es-CO')}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-white font-medium ${credito.estado === 'Pendiente' ? 'bg-orange-500' : 'bg-green-500'}`}>
                            {credito.estado}
                          </span>
                        </td>
                        <td className="p-4">
                          {new Date(credito.fecha_vencimiento).toLocaleDateString('es-CO')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${bgColor} ${textColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default AdminCobradorDetail;

import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ClienteList({ cobradorId, onVolver }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalCredito, setShowModalCredito] = useState(false);
  const [clienteSel, setClienteSel] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Formulario para nuevo cliente
  const [formCliente, setFormCliente] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  // Formulario para nuevo crédito
  const [formCredito, setFormCredito] = useState({
    monto_prestado: 0,
    fecha_vencimiento: ''
  });

  // Cargar clientes
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError('Error al cargar clientes');
    }
  };

  // Crear cliente
  const handleCrearCliente = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      if (!formCliente.nombre || !formCliente.cedula) {
        setError('Nombre y cédula son requeridos');
        setCargando(false);
        return;
      }

      const res = await api.post('/clientes', {
        ...formCliente,
        cobradorID: cobradorId
      });

      setClientes([...clientes, res.data]);
      setFormCliente({
        nombre: '',
        cedula: '',
        telefono: '',
        email: '',
        direccion: ''
      });
      setShowModalCliente(false);
      alert('✅ Cliente creado exitosamente');
    } catch (err) {
      console.error("Error al crear cliente:", err);
      setError(err.response?.data?.error || 'Error al crear cliente');
    } finally {
      setCargando(false);
    }
  };

  // Crear crédito
  const handleCrearCredito = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      if (formCredito.monto_prestado <= 0) {
        setError('El monto debe ser mayor a 0');
        setCargando(false);
        return;
      }

      const res = await api.post('/creditos', {
        monto_prestado: Number.parseFloat(formCredito.monto_prestado),
        fecha_vencimiento: formCredito.fecha_vencimiento,
        clienteID: clienteSel._id,
        cobradorID: cobradorId
      });

      console.log("✅ Crédito creado:", res.data);
      setFormCredito({
        monto_prestado: 0,
        fecha_vencimiento: ''
      });
      setShowModalCredito(false);
      setClienteSel(null);
      alert('✅ Crédito creado exitosamente');
    } catch (err) {
      console.error("Error al crear crédito:", err);
      setError(err.response?.data?.error || 'Error al crear crédito');
    } finally {
      setCargando(false);
    }
  };

  const montoAPagar = formCredito.monto_prestado * 1.3;

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.cedula?.includes(busqueda)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button onClick={onVolver} className="mb-4 text-blue-600 font-bold flex items-center">
        ← Volver
      </button>

      <h2 className="text-2xl font-black text-gray-800 mb-4">Gestión de Clientes</h2>

      {/* Botón crear cliente */}
      <button
        onClick={() => setShowModalCliente(true)}
        className="w-full p-4 bg-green-600 text-white font-bold rounded-2xl mb-6 hover:bg-green-700 transition"
      >
        ➕ CREAR NUEVO CLIENTE
      </button>

      {/* Buscador */}
      <input 
        type="text" 
        placeholder="Buscar por nombre o cédula..." 
        className="w-full p-3 rounded-xl border border-gray-300 mb-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Lista de clientes */}
      <div className="space-y-3">
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.map(cliente => (
            <div key={cliente._id} className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-800">{cliente.nombre}</p>
                  <p className="text-sm text-gray-600">CC: {cliente.cedula}</p>
                  {cliente.telefono && <p className="text-sm text-gray-600">📱 {cliente.telefono}</p>}
                  {cliente.email && <p className="text-sm text-gray-600">📧 {cliente.email}</p>}
                  {cliente.direccion && <p className="text-sm text-gray-600">📍 {cliente.direccion}</p>}
                </div>
                <button 
                  onClick={() => {
                    setClienteSel(cliente);
                    setShowModalCredito(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap ml-2"
                >
                  💰 Crédito
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-2xl text-center">
            <p className="text-gray-500 font-bold">No hay clientes registrados</p>
            <p className="text-gray-400 text-sm">Crea tu primer cliente haciendo clic en el botón de arriba</p>
          </div>
        )}
      </div>

      {/* MODAL: Crear Cliente */}
      {showModalCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-blue-900 mb-4">Nuevo Cliente</h2>

            <form onSubmit={handleCrearCliente} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nombre completo"
                  value={formCliente.nombre}
                  onChange={(e) => setFormCliente({...formCliente, nombre: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Cédula</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Número de CC"
                  value={formCliente.cedula}
                  onChange={(e) => setFormCliente({...formCliente, cedula: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Teléfono</label>
                <input 
                  type="tel" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="3001234567"
                  value={formCliente.telefono}
                  onChange={(e) => setFormCliente({...formCliente, telefono: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="correo@ejemplo.com"
                  value={formCliente.email}
                  onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Dirección</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Calle y número"
                  value={formCliente.direccion}
                  onChange={(e) => setFormCliente({...formCliente, direccion: e.target.value})}
                />
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                  <p className="text-red-600 text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModalCliente(false)}
                  className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={cargando}
                  className="flex-1 p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {cargando ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Crear Crédito */}
      {showModalCredito && clienteSel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-green-900 mb-2">Crédito para {clienteSel.nombre}</h2>
            <p className="text-gray-600 text-sm mb-4">CC: {clienteSel.cedula}</p>

            <form onSubmit={handleCrearCredito} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Monto Préstamo</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-lg font-bold"
                  placeholder="0"
                  value={formCredito.monto_prestado}
                  onChange={(e) => setFormCredito({...formCredito, monto_prestado: e.target.value})}
                  required
                />
              </div>

              {/* Cálculo automático del 30% */}
              {formCredito.monto_prestado > 0 && (
                <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200">
                  <p className="text-green-800 text-xs font-bold uppercase mb-1">Monto a Pagar (30% interés)</p>
                  <p className="text-3xl font-black text-green-900">${Number.parseFloat(montoAPagar).toLocaleString('es-CO', {minimumFractionDigits: 0})}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Fecha de Vencimiento</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  value={formCredito.fecha_vencimiento}
                  onChange={(e) => setFormCredito({...formCredito, fecha_vencimiento: e.target.value})}
                />
              </div>

              {error && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                  <p className="text-red-600 text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowModalCredito(false);
                    setClienteSel(null);
                  }}
                  className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={cargando}
                  className="flex-1 p-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-400"
                >
                  {cargando ? 'Creando...' : 'Crear Crédito'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
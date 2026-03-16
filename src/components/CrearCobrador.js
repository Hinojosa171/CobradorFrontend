import React, { useState, useEffect } from 'react';
import api from '../api';

export default function CrearCobrador({ gerenteId }) {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [oficinaSeleccionada, setOficinaSeleccionada] = useState('');
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [oficinas, setOficinas] = useState([]);
  const [cobradores, setCobradores] = useState([]);

  // Cargar oficinas y cobradores
  useEffect(() => {
    const cargar = async () => {
      try {
        const resOficinas = await api.get(`/gerentes/${gerenteId}/oficinas`);
        setOficinas(resOficinas.data);
        
        // Cargar todos los cobradores
        const resCobradores = await api.get('/cobradores');
        setCobradores(resCobradores.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    
    if (gerenteId) {
      cargar();
    }
  }, [gerenteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    
    if (!oficinaSeleccionada) {
      setError('❌ Debes seleccionar una oficina');
      return;
    }
    
    setCargando(true);

    try {
      const res = await api.post('/oficinas/cobradores/crear', {
        nombre: nombre.trim(),
        cedula: cedula.trim(),
        celular: celular.trim(),
        direccion: direccion.trim(),
        usuario: usuario.trim(),
        password: password.trim(),
        oficiaID: oficinaSeleccionada
      });

      console.log('✅ Cobrador creado:', res.data);
      setMensaje(`✅ Cobrador "${nombre}" creado exitosamente`);
      
      // Recargar datos
      const resCobradores = await api.get('/cobradores');
      setCobradores(resCobradores.data);
      
      // Limpiar formulario
      setNombre('');
      setCedula('');
      setCelular('');
      setDireccion('');
      setUsuario('');
      setPassword('');
      setOficinaSeleccionada('');
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('❌ Error:', err);
      if (err.response?.data?.error?.includes('existe')) {
        setError('❌ Usuario ya existe');
      } else {
        setError('❌ Error al crear cobrador');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-gray-800 mb-8">👥 CREAR COBRADOR</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORMULARIO */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                  <p className="font-bold">{error}</p>
                </div>
              )}

              {mensaje && (
                <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                  <p className="font-bold">{mensaje}</p>
                </div>
              )}

              {/* Seleccionar Oficina */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Seleccionar Oficina *</label>
                <select
                  value={oficinaSeleccionada}
                  onChange={(e) => setOficinaSeleccionada(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                  disabled={cargando}
                  required
                >
                  <option value="">-- Elige una oficina --</option>
                  {oficinas && oficinas.map(oficina => (
                    <option key={oficina._id} value={oficina._id}>
                      {oficina.nombre} ({oficina.barrios?.length || 0} barrios)
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre y Cédula */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Carlos González"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={cargando}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Cédula *</label>
                  <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    placeholder="Ej: 87654321"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={cargando}
                    required
                  />
                </div>
              </div>

              {/* Celular y Dirección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Celular</label>
                  <input
                    type="tel"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="+57 300 555 2222"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={cargando}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Dirección</label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej: Carrera 50 #30-40"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={cargando}
                  />
                </div>
              </div>

              {/* Usuario y Contraseña */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Usuario *</label>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ej: carlos_cobrador"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={cargando}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Contraseña *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña segura"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={cargando}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {cargando ? '⏳ Creando...' : '✅ CREAR COBRADOR'}
              </button>
            </form>
          </div>

          {/* LISTA DE COBRADORES */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-bold text-lg mb-4 text-gray-800">👥 Cobradores ({cobradores?.length || 0})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto text-sm">
              {cobradores && cobradores.length > 0 ? (
                cobradores.map(cobrador => (
                  <div key={cobrador._id} className="p-2 bg-purple-50 border-l-2 border-purple-500 rounded">
                    <p className="font-bold text-purple-800 text-xs">{cobrador.nombre}</p>
                    <p className="text-gray-600 text-xs">@{cobrador.usuario}</p>
                    <p className="text-gray-500 text-xs">{cobrador.cedula}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No hay cobradores</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

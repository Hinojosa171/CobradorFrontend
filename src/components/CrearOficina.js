import React, { useState, useEffect } from 'react';
import api from '../api';

export default function CrearOficina({ gerenteId }) {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [barriosSeleccionados, setBarriosSeleccionados] = useState([]);
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [barrios, setBarrios] = useState([]);
  const [oficinas, setOficinas] = useState([]);

  // Cargar barrios y oficinas existentes
  useEffect(() => {
    const cargar = async () => {
      try {
        const [resBarrios, resOficinas] = await Promise.all([
          api.get('/barrios'),
          api.get(`/gerentes/${gerenteId}/oficinas`)
        ]);
        setBarrios(resBarrios.data);
        setOficinas(resOficinas.data);
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
    setCargando(true);

    try {
      const res = await api.post('/gerentes/oficinas/crear', {
        nombre: nombre.trim(),
        cedula: cedula.trim(),
        celular: celular.trim(),
        direccion: direccion.trim(),
        usuario: usuario.trim(),
        password: password.trim(),
        gerenteID: gerenteId,
        barrios: barriosSeleccionados
      });

      console.log('✅ Oficina creada:', res.data);
      setMensaje(`✅ Oficina "${nombre}" creada exitosamente`);
      
      // Recargar lista
      const resOficinas = await api.get(`/gerentes/${gerenteId}/oficinas`);
      setOficinas(resOficinas.data);
      
      // Limpiar formulario
      setNombre('');
      setCedula('');
      setCelular('');
      setDireccion('');
      setUsuario('');
      setPassword('');
      setBarriosSeleccionados([]);
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('❌ Error:', err);
      if (err.response?.data?.error?.includes('existe')) {
        setError('❌ Usuario o cédula ya existe');
      } else {
        setError('❌ Error al crear oficina');
      }
    } finally {
      setCargando(false);
    }
  };

  const toggleBarrio = (barrio_id) => {
    if (barriosSeleccionados.includes(barrio_id)) {
      setBarriosSeleccionados(barriosSeleccionados.filter(id => id !== barrio_id));
    } else {
      setBarriosSeleccionados([...barriosSeleccionados, barrio_id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-gray-800 mb-8">🏢 CREAR OFICINA</h1>

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

              {/* Nombre y Cédula */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Oficina Centro"
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
                    placeholder="Ej: 123456789"
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
                    placeholder="+57 300 555 1234"
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
                    placeholder="Ej: Calle Principal 100"
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
                    placeholder="Ej: oficina_centro"
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

              {/* Barrios */}
              <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-3">Asignar Barrios</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-300 max-h-56 overflow-y-auto">
                  {barrios && barrios.length > 0 ? (
                    barrios.map(barrio => {
                      const asignadoA = oficinas.filter(o => o.barrios?.includes(barrio._id));
                      return (
                        <div key={barrio._id} className="p-3 bg-white border rounded-lg">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={barriosSeleccionados.includes(barrio._id)}
                              onChange={() => toggleBarrio(barrio._id)}
                              className="w-5 h-5"
                              disabled={cargando}
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-800">{barrio.nombre}</span>
                              {asignadoA.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  ✓ Asignado a: {asignadoA.map(o => o.nombre).join(', ')}
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No hay barrios disponibles</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {cargando ? '⏳ Creando...' : '✅ CREAR OFICINA'}
              </button>
            </form>
          </div>

          {/* LISTA DE OFICINAS */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-bold text-lg mb-4 text-gray-800">🏢 Mis Oficinas</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {oficinas && oficinas.length > 0 ? (
                oficinas.map(oficina => (
                  <div key={oficina._id} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="font-bold text-blue-800">{oficina.nombre}</p>
                    <p className="text-xs text-gray-600">Usuario: {oficina.usuario}</p>
                    <p className="text-xs text-gray-600">{oficina.barrios?.length || 0} barrio(s)</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No hay oficinas aún</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

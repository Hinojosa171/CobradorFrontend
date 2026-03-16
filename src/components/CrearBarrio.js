import React, { useState, useEffect } from 'react';
import api from '../api';

export default function CrearBarrio() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [barrios, setBarrios] = useState([]);

  // Cargar barrios existentes
  useEffect(() => {
    const cargarBarrios = async () => {
      try {
        const res = await api.get('/barrios');
        setBarrios(res.data);
      } catch (err) {
        console.error('Error al cargar barrios:', err);
      }
    };
    cargarBarrios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);

    try {
      const res = await api.post('/barrios', {
        nombre: nombre.trim(),
        descripcion: descripcion.trim()
      });

      console.log('✅ Barrio creado:', res.data);
      setMensaje(`✅ Barrio "${nombre}" creado exitosamente`);
      
      // Recargar lista
      const resBarrios = await api.get('/barrios');
      setBarrios(resBarrios.data);
      
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('❌ Error:', err);
      if (err.response?.data?.error?.includes('existe')) {
        setError('❌ Este barrio ya existe');
      } else {
        setError('❌ Error al crear barrio');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-black text-gray-800 mb-8">📍 CREAR BARRIO</h1>

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

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  Nombre del Barrio *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Siloé, Terrón Colorado, Potrero Grande..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                  disabled={cargando}
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Zona ubicada en el sur de la ciudad..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                  disabled={cargando}
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {cargando ? '⏳ Creando...' : '✅ CREAR BARRIO'}
              </button>
            </form>
          </div>

          {/* LISTA DE BARRIOS */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="font-bold text-lg mb-4 text-gray-800">📋 Barrios Existentes</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {barrios && barrios.length > 0 ? (
                barrios.map(barrio => (
                  <div key={barrio._id} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="font-bold text-blue-800">{barrio.nombre}</p>
                    <p className="text-sm text-gray-600">{barrio.descripcion}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No hay barrios aún</p>
              )}
            </div>
          </div>
        </div>

        {/* BARRIOS SUGERIDOS */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-3">💡 Barrios Sugeridos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm text-yellow-700">
            <span>• Siloé</span>
            <span>• Terrón Colorado</span>
            <span>• Potrero Grande</span>
            <span>• El Retiro</span>
            <span>• Sucre</span>
            <span>• Poblado II</span>
            <span>• Los Alcázares</span>
            <span>• Otros...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

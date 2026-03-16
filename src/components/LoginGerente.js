import React, { useState } from 'react';
import api from '../api';

export default function LoginGerente({ onLoginSuccess, onVolver }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // Llamar al endpoint de login del gerente
      const res = await api.post('/gerentes/login', {
        usuario: user.trim(),
        password: pass.trim()
      });

      console.log('✅ Login gerente exitoso:', res.data);
      
      // Guardar datos del gerente
      const datosGerente = {
        _id: res.data.gerente._id,
        nombre: res.data.gerente.nombre,
        usuario: res.data.gerente.usuario,
        rol: 'gerente'
      };

      onLoginSuccess(datosGerente);
    } catch (err) {
      console.error('❌ Error en login:', err);
      if (err.response?.status === 401) {
        setError('❌ Usuario o contraseña incorrectos');
      } else {
        setError('❌ Error al conectar con el servidor');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white mb-2">👑 GERENTE</h1>
        <p className="text-green-100 font-semibold">Acceso Administrador Superior</p>
      </div>

      <form 
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Usuario</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder=" Ingresa tu usuario"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
            disabled={cargando}
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Contraseña</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Ingresa tu contraseña"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
            disabled={cargando}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
        >
          {cargando ? '⏳ Ingresando...' : '🚀 INGRESAR'}
        </button>

        <button
          type="button"
          onClick={onVolver}
          className="w-full mt-4 text-gray-500 font-bold text-sm hover:text-gray-700 underline"
        >
          ← VOLVER AL SELECTOR
        </button>
      </form>

      <p className="mt-8 text-green-100 text-xs text-center max-w-xs">
        Acceso exclusivo para administradores del sistema de cobranza
      </p>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess, onIrARegistro, rol = 'cobrador' }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarListado, setMostrarListado] = useState(false);
  const navigate = useNavigate();

  const esOficina = rol === 'oficina';
  const colorPrimario = esOficina ? 'purple' : 'blue';
  const endpoint = esOficina ? '/oficinas' : '/cobradores';
  const labelAcceso = esOficina ? 'Oficina' : 'Cobrador';

  // Cargar usuarios al renderizar
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await api.get(endpoint);
        setUsuarios(res.data);
        console.log(`✅ ${labelAcceso}s cargados:`, res.data);
      } catch (err) {
        console.error(`❌ Error al cargar ${labelAcceso}s:`, err);
        setError('No se pudo conectar con el servidor');
      }
    };
    cargarUsuarios();
  }, [endpoint, labelAcceso]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      console.log("🔍 Buscando usuario:", user);
      console.log(`📋 ${labelAcceso}s disponibles:`, usuarios.map(c => ({ usuario: c.usuario, nombre: c.nombre })));

      // Búsqueda flexible (insensible a mayúsculas/minúsculas)
      const usuarioValido = usuarios.find(c => 
        c.usuario.toLowerCase().trim() === user.toLowerCase().trim() && 
        c.password.toString() === pass.toString()
      );

      if (usuarioValido) {
        // Verificar si el cobrador está desactivado (solo para cobradores)
        if (rol === 'cobrador' && usuarioValido.activo === false) {
          console.log("❌ Cobrador desactivado");
          setError('❌ Esta cuenta ha sido desactivada. Contacta con la oficina.');
          return;
        }

        console.log("✅ Login exitoso:", usuarioValido.nombre);
        onLoginSuccess(usuarioValido);
      } else {
        console.log("❌ Credenciales incorrectas");
        setError('Usuario o contraseña incorrectos. Usuarios disponibles: ' + usuarios.map(c => c.usuario).join(', '));
      }
    } catch (err) {
      console.error("Error detallado:", err);
      setError('Error al procesar el login');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
      <div className={`bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border-t-8 ${esOficina ? 'border-purple-600' : 'border-blue-600'}`}>
        <h1 className={`text-3xl font-black text-center mb-2 italic ${esOficina ? 'text-purple-900' : 'text-blue-900'}`}>LOGIN</h1>
        <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-widest font-bold">Acceso {labelAcceso}</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Usuario</label>
            <input 
              type="text" 
              className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 outline-none transition ${esOficina ? 'focus:ring-purple-500' : 'focus:ring-blue-500'}`}
              placeholder="Tu usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Contraseña</label>
            <input 
              type="password" 
              className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 outline-none transition ${esOficina ? 'focus:ring-purple-500' : 'focus:ring-blue-500'}`}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <p className="text-red-600 text-xs text-center font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={cargando}
            className={`w-full ${cargando ? 'bg-gray-400' : esOficina ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black py-4 rounded-2xl shadow-lg transition transform active:scale-95`}
          >
            {cargando ? 'CONECTANDO...' : 'ENTRAR'}
          </button>
        </form>

        {/* Botón para mostrar usuarios disponibles */}
        <button 
          onClick={() => setMostrarListado(!mostrarListado)}
          className={`w-full mt-4 text-xs font-bold underline ${esOficina ? 'text-purple-500 hover:text-purple-700' : 'text-blue-500 hover:text-blue-700'}`}
        >
          {mostrarListado ? '↑ Ocultar usuarios' : `↓ Ver ${labelAcceso}s disponibles`}
        </button>

        {mostrarListado && (
          <div className={`mt-4 p-3 rounded-xl border ${esOficina ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-xs font-bold mb-2 ${esOficina ? 'text-purple-900' : 'text-blue-900'}`}>{labelAcceso}s disponibles:</p>
            {usuarios.length > 0 ? (
              <div className="space-y-1">
                {usuarios.map((c) => (
                  <div key={c._id} className={`text-xs bg-white p-2 rounded border ${esOficina ? 'text-purple-800 border-purple-100' : 'text-blue-800 border-blue-100'}`}>
                    <span className="font-bold">👤 {c.usuario}</span> - {c.nombre}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-600 font-bold">No hay usuarios cargados</p>
            )}
          </div>
        )}

        {/* Botón para ir al registro */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 text-xs mb-3">¿No tienes cuenta?</p>
          <button 
            type="button"
            onClick={onIrARegistro}
            className={`w-full text-white font-bold py-3 rounded-2xl shadow-lg transition transform active:scale-95 ${esOficina ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            CREAR NUEVA CUENTA
          </button>
        </div>
        
        <p className="text-center text-gray-300 text-[10px] mt-6 uppercase font-bold">Localhost Mode: Port 3000</p>
      </div>
    </div>
  );
}
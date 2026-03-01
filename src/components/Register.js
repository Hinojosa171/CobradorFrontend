import React, { useState } from 'react';
import api from '../api';

export default function Register({ onRegisterSuccess, onVolver, rol = 'cobrador' }) {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    celular: '',
    direccion: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    codigo: ''  // Para oficina
  });

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      // Validaciones comunes
      if (!formData.nombre.trim()) {
        setError('El nombre es requerido');
        setCargando(false);
        return;
      }

      if (!formData.cedula.trim()) {
        setError('La cédula es requerida');
        setCargando(false);
        return;
      }

      if (!formData.usuario.trim()) {
        setError('El usuario es requerido');
        setCargando(false);
        return;
      }

      if (formData.password.length < 4) {
        setError('La contraseña debe tener al menos 4 caracteres');
        setCargando(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setCargando(false);
        return;
      }

      // Validación adicional para oficina
      if (rol === 'oficina' && !formData.codigo.trim()) {
        setError('El código de acceso es requerido');
        setCargando(false);
        return;
      }

      // Preparar datos según el rol
      const datosRegistro = rol === 'oficina'
        ? {
            nombre: formData.nombre,
            cedula: formData.cedula,
            celular: formData.celular,
            direccion: formData.direccion,
            usuario: formData.usuario,
            password: formData.password,
            codigo: formData.codigo
          }
        : {
            nombre: formData.nombre,
            cedula: formData.cedula,
            celular: formData.celular,
            direccion: formData.direccion,
            usuario: formData.usuario,
            password: formData.password
          };

      // Enviar a la ruta correcta según el rol
      const endpoint = rol === 'oficina' ? '/oficinas' : '/cobradores';
      const res = await api.post(endpoint, datosRegistro);
      
      console.log("✅ Usuario registrado:", res.data);
      const tipoUsuario = rol === 'oficina' ? 'Oficina' : 'Cobrador';
      setExito(`✅ ¡${tipoUsuario} registrado exitosamente! Ahora puedes iniciar sesión.`);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        cedula: '',
        celular: '',
        direccion: '',
        usuario: '',
        password: '',
        confirmPassword: '',
        codigo: ''
      });

      // Volver al login después de 2 segundos
      setTimeout(() => {
        onVolver();
      }, 2000);

    } catch (err) {
      console.error("❌ Error al registrar:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(`Error al registrar ${rol === 'oficina' ? 'la oficina' : 'el cobrador'}. Intenta de nuevo.`);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
      <div className={`bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-t-8 ${rol === 'oficina' ? 'border-purple-600' : 'border-green-600'}`}>
        <h1 className={`text-3xl font-black text-center mb-2 italic ${rol === 'oficina' ? 'text-purple-900' : 'text-green-900'}`}>REGISTRO</h1>
        <p className="text-center text-gray-400 mb-6 text-sm uppercase tracking-widest font-bold">
          {rol === 'oficina' ? 'Nueva Oficina' : 'Nuevo Cobrador'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Nombre</label>
            <input 
              type="text" 
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition ${rol === 'oficina' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
              placeholder="Nombre completo"
              required
            />
          </div>

          {/* Cédula */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Cédula</label>
            <input 
              type="text" 
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition ${rol === 'oficina' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
              placeholder="Ej: 1234567890"
              required
            />
          </div>

          {/* Celular */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Celular</label>
            <input 
              type="tel" 
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition ${rol === 'oficina' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
              placeholder="Ej: 3001234567"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Dirección</label>
            <input 
              type="text" 
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition ${rol === 'oficina' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
              placeholder="Calle y número"
            />
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Usuario</label>
            <input 
              type="text" 
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition ${rol === 'oficina' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
              placeholder="Nombre de usuario"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition ${rol === 'oficina' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition ${rol === 'oficina' ? 'focus:ring-purple-500' : 'focus:ring-green-500'}`}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Código de Acceso (Solo para Oficina) */}
          {rol === 'oficina' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-tighter">🔐 Código de Acceso</label>
              <input 
                type="password" 
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="Ingresa el código secreto"
                required
              />
              <p className="text-purple-600 text-xs mt-1 font-semibold">Código necesario para registro de oficina</p>
            </div>
          )}

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <p className="text-red-600 text-xs text-center font-bold">{error}</p>
            </div>
          )}

          {/* Mensaje de Éxito */}
          {exito && (
            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
              <p className="text-green-600 text-xs text-center font-bold">{exito}</p>
            </div>
          )}

          {/* Botones */}
          <div className="space-y-3 pt-4">
            <button 
              type="submit" 
              disabled={cargando}
              className={`w-full ${cargando ? 'bg-gray-400' : rol === 'oficina' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'} text-white font-black py-3 rounded-xl shadow-lg transition transform active:scale-95`}
            >
              {cargando ? 'REGISTRANDO...' : 'REGISTRAR'}
            </button>

            <button 
              type="button" 
              onClick={onVolver}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition"
            >
              VOLVER AL LOGIN
            </button>
          </div>
        </form>

        <p className="text-center text-gray-300 text-[10px] mt-6 uppercase font-bold">
          {rol === 'oficina' ? 'Crear nueva cuenta de oficina' : 'Crear nueva cuenta de cobrador'}
        </p>
      </div>
    </div>
  );
}

import React from 'react';

function RoleSelector({ onSelectRole }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-2">TU COBRADOR</h1>
        <p className="text-blue-100 font-semibold">Sistema de Gestión de Préstamos</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <button
          onClick={() => onSelectRole('oficina')}
          className="w-full p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center hover:shadow-xl transition transform hover:scale-105 active:scale-95"
        >
          <span className="text-6xl mb-4">🏢</span>
          <span className="font-black text-gray-800 text-2xl">OFICINA</span>
          <span className="text-gray-500 text-sm mt-2 font-semibold">Panel de Administrador</span>
        </button>

        <button
          onClick={() => onSelectRole('cobrador')}
          className="w-full p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center hover:shadow-xl transition transform hover:scale-105 active:scale-95"
        >
          <span className="text-6xl mb-4">👤</span>
          <span className="font-black text-gray-800 text-2xl">COBRADOR</span>
          <span className="text-gray-500 text-sm mt-2 font-semibold">App Móvil del Cobrador</span>
        </button>
      </div>

      <p className="mt-12 text-blue-100 text-xs text-center max-w-xs">
        Selecciona tu tipo de acceso para iniciar sesión
      </p>
    </div>
  );
}

export default RoleSelector;

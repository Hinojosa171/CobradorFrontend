import React, { useState } from 'react';

export default function GerenteNavbar({ currentPage, onNavigate, onLogout, userName }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'barrios', label: '📍 Barrios', icon: '📍' },
    { id: 'oficinas', label: '🏢 Oficinas', icon: '🏢' },
    { id: 'cobradores', label: '👥 Cobradores', icon: '👥' },
    { id: 'estadisticas', label: '📈 Estadísticas', icon: '📈' },
  ];

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <h1 className="text-xl font-black">GERENTE</h1>
            <p className="text-xs text-green-200">{userName}</p>
          </div>
        </div>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex gap-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                currentPage === item.id
                  ? 'bg-white text-green-700 shadow-lg'
                  : 'text-white hover:bg-green-600'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* MENÚ MÓVIL */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-2xl"
          >
            ☰
          </button>
          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMenuAbierto(false);
                  }}
                  className={`w-full text-left px-4 py-2 font-bold ${
                    currentPage === item.id ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold text-sm transition"
        >
          🚪 SALIR
        </button>
      </div>
    </nav>
  );
}

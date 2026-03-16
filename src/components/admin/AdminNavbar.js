import React from 'react';
import { BarChart3, Users, FileText, Home, LogOut } from 'lucide-react';

function AdminNavbar({ currentPage, onNavigate, onLogout, userName }) {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 size={28} />
              Tu Cobrador - Admin
            </h1>
            {userName && <p className="text-blue-100 text-sm mt-1">Bienvenido, {userName}</p>}
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
          >
            <LogOut size={18} />
            SALIR
          </button>
        </div>
        
        <div className="flex gap-6 flex-wrap">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition ${
              currentPage === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Home size={20} />
            Dashboard
          </button>
          
          <button 
            onClick={() => onNavigate('cobradores')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition ${
              currentPage === 'cobradores' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Users size={20} />
            Cobradores
          </button>
          
          <button 
            onClick={() => onNavigate('clientes')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition ${
              currentPage === 'clientes' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Users size={20} />
            Clientes
          </button>
          
          <button 
            onClick={() => onNavigate('creditos')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition ${
              currentPage === 'creditos' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <FileText size={20} />
            Créditos
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;

import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import Login from './components/Login';
import Register from './components/Register';
import ClienteList from './components/ClienteList';
import CreditosList from './components/CreditosList';
import AdminNavbar from './components/admin/AdminNavbar';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCobradorList from './components/admin/AdminCobradorList';
import AdminCobradorDetail from './components/admin/AdminCobradorDetail';
import AdminClienteList from './components/admin/AdminClienteList';
import AdminCreditoList from './components/admin/AdminCreditoList';

function App() {
  const [rol, setRol] = useState(null); // 'oficina' o 'cobrador'
  const [sesion, setSesion] = useState(null); // Aquí guardamos al usuario que entró
  const [vista, setVista] = useState('login'); // 'login', 'register', 'menu', 'clientes', 'creditos', etc.
  const [adminCurrentPage, setAdminCurrentPage] = useState('dashboard'); // Para el rol oficina
  const [selectedCobradorId, setSelectedCobradorId] = useState(null); // Para ver detalle de cobrador

  // SELECTOR DE ROL
  if (!rol) {
    return <RoleSelector onSelectRole={setRol} />;
  }

  // ==================== ROL COBRADOR (VERSIÓN MÓVIL) ====================
  if (rol === 'cobrador') {
    // Si no hay sesión, mostramos la pantalla de Login/Register
    if (!sesion) {
      return (
        <>
          {vista === 'login' && (
            <Login 
              onLoginSuccess={(datos) => {
                setSesion(datos);
                setVista('menu');
              }}
              onIrARegistro={() => setVista('register')}
            />
          )}
          {vista === 'register' && (
            <Register 
              onRegisterSuccess={(datos) => {
                setSesion(datos);
                setVista('menu');
              }}
              onVolver={() => setVista('login')}
              rol="cobrador"
            />
          )}
        </>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100">
        {/* MENÚ PRINCIPAL DEL COBRADOR */}
        {vista === 'menu' && (
          <div className="flex flex-col items-center justify-center h-screen gap-6 p-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-black text-blue-900 italic">HOLA, {sesion.nombre.toUpperCase()}</h1>
              <p className="text-gray-500 text-sm font-bold tracking-tighter">¿Qué gestionaremos hoy?</p>
            </div>
            
            <button 
              onClick={() => setVista('clientes')} 
              className="w-full max-w-xs p-8 bg-white rounded-3xl shadow-xl flex flex-col items-center border-b-8 border-blue-500 active:scale-95 transition"
            >
              <span className="text-5xl mb-2">👥</span>
              <span className="font-bold text-gray-700 text-xl">CLIENTES</span>
            </button>

            <button 
              onClick={() => setVista('creditos')} 
              className="w-full max-w-xs p-8 bg-white rounded-3xl shadow-xl flex flex-col items-center border-b-8 border-green-500 active:scale-95 transition"
            >
              <span className="text-5xl mb-2">💰</span>
              <span className="font-bold text-gray-700 text-xl">CRÉDITOS</span>
            </button>

            <button onClick={() => { setSesion(null); setRol(null); }} className="mt-8 text-gray-400 font-bold text-xs underline">CAMBIAR USUARIO / ROL</button>
          </div>
        )}

        {/* CLIENTES Y CRÉDITOS */}
        {vista === 'clientes' && <ClienteList cobradorId={sesion._id} onVolver={() => setVista('menu')} />}
        {vista === 'creditos' && <CreditosList onVolver={() => setVista('menu')} />}
      </div>
    );
  }

  // ==================== ROL OFICINA (VERSIÓN DESKTOP) ====================
  if (rol === 'oficina') {
    // Si no hay sesión, mostramos la pantalla de Login/Register
    if (!sesion) {
      return (
        <>
          {vista === 'login' && (
            <Login 
              onLoginSuccess={(datos) => {
                setSesion(datos);
                setVista('menu');
              }}
              onIrARegistro={() => setVista('register')}
              rol="oficina"
            />
          )}
          {vista === 'register' && (
            <Register 
              onRegisterSuccess={(datos) => {
                setSesion(datos);
                setVista('menu');
              }}
              onVolver={() => setVista('login')}
              rol="oficina"
            />
          )}
        </>
      );
    }

    // Si hay sesión, mostramos el dashboard
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar 
          currentPage={adminCurrentPage} 
          onNavigate={setAdminCurrentPage}
          onLogout={() => { setSesion(null); setRol(null); }}
          userName={sesion.nombre}
        />
        
        {adminCurrentPage === 'dashboard' && <AdminDashboard />}
        
        {adminCurrentPage === 'cobradores' && !selectedCobradorId && (
          <AdminCobradorList onSelectCobrador={setSelectedCobradorId} />
        )}
        
        {selectedCobradorId && (
          <AdminCobradorDetail 
            cobradorId={selectedCobradorId}
            onBack={() => setSelectedCobradorId(null)}
          />
        )}
        
        {adminCurrentPage === 'clientes' && <AdminClienteList />}
        
        {adminCurrentPage === 'creditos' && <AdminCreditoList />}
      </div>
    );
  }
}

export default App;
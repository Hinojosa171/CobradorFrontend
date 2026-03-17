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
import LoginGerente from './components/LoginGerente';
import GerenteNavbar from './components/GerenteNavbar';
import GerenteDashboard from './components/GerenteDashboard';
import CrearBarrio from './components/CrearBarrio';
import CrearOficina from './components/CrearOficina';
import CrearCobrador from './components/CrearCobrador';

function App() {
  const [rol, setRol] = useState(null); // 'gerente', 'oficina' o 'cobrador'
  const [sesion, setSesion] = useState(null); // Aquí guardamos al usuario que entró
  const [vista, setVista] = useState('login'); // 'login', 'register', 'menu', 'clientes', etc.
  const [adminCurrentPage, setAdminCurrentPage] = useState('dashboard'); // Para el rol oficina
  const [selectedCobradorId, setSelectedCobradorId] = useState(null); // Para ver detalle de cobrador
  const [gerenteCurrentPage, setGerenteCurrentPage] = useState('dashboard'); // Para el rol gerente

  // SELECTOR DE ROL
  if (!rol) {
    return <RoleSelector onSelectRole={setRol} />;
  }

  // ==================== ROL GERENTE (NIVEL SUPERIOR) ====================
  if (rol === 'gerente') {
    // Si no hay sesión, mostramos la pantalla de Login del Gerente
    if (!sesion) {
      return (
        <LoginGerente 
          onLoginSuccess={(datos) => {
            setSesion(datos);
            setVista('menu');
          }}
          onVolver={() => setRol(null)}
        />
      );
    }

    // Si hay sesión, mostramos el panel del gerente
    return (
      <div className="min-h-screen bg-gray-100">
        <GerenteNavbar 
          currentPage={gerenteCurrentPage} 
          onNavigate={setGerenteCurrentPage}
          onLogout={() => { setSesion(null); setRol(null); }}
          userName={sesion.nombre}
        />
        
        {gerenteCurrentPage === 'dashboard' && (
          <GerenteDashboard gerenteId={sesion._id} />
        )}
        
        {gerenteCurrentPage === 'barrios' && (
          <CrearBarrio />
        )}
        
        {gerenteCurrentPage === 'oficinas' && (
          <CrearOficina gerenteId={sesion._id} />
        )}
        
        {gerenteCurrentPage === 'cobradores' && (
          <CrearCobrador gerenteId={sesion._id} />
        )}
        
        {gerenteCurrentPage === 'estadisticas' && (
          <GerenteDashboard gerenteId={sesion._id} />
        )}
      </div>
    );
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
        {vista === 'clientes' && <ClienteList cobrador={sesion} onVolver={() => setVista('menu')} />}
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
        
        {adminCurrentPage === 'dashboard' && <AdminDashboard onicinaId={sesion._id} />}
        
        {adminCurrentPage === 'cobradores' && !selectedCobradorId && (
          <AdminCobradorList onicinaId={sesion._id} onSelectCobrador={setSelectedCobradorId} />
        )}
        
        {selectedCobradorId && (
          <AdminCobradorDetail 
            cobradorId={selectedCobradorId}
            onBack={() => setSelectedCobradorId(null)}
          />
        )}
        
        {adminCurrentPage === 'clientes' && <AdminClienteList onicinaId={sesion._id} />}
        
        {adminCurrentPage === 'creditos' && <AdminCreditoList onicinaId={sesion._id} />}
      </div>
    );
  }
}

export default App;
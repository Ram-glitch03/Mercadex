import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PackageSearch, LogOut } from 'lucide-react';
import AdminMetrics from './AdminMetrics';
import InventoryManagement from './InventoryManagement';

export default function Dashboard() {
    const { role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (role !== 'admin') {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--text-primary)' }}>Acceso Denegado</h2>
                <button onClick={() => navigate('/login')} className="btn-primary" style={{ marginTop: '1rem' }}>Ir a Login</button>
            </div>
        );
    }

    return (
        <div className="app-container dashboard-layout" style={{ flexDirection: 'row', overflowX: 'hidden' }}>
            {/* Sidebar */}
            <aside className="glass-panel dashboard-sidebar" style={{ width: '240px', margin: '0.75rem', display: 'flex', flexDirection: 'column', background: 'white' }}>
                <div style={{ padding: '1.5rem' }}>
                    <h2 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>Mercadex Admin</h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem', flex: 1 }}>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', color: location.pathname === '/dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)', textDecoration: 'none', borderRadius: '8px', background: location.pathname === '/dashboard' ? 'rgba(230,57,39,0.06)' : 'transparent', fontWeight: location.pathname === '/dashboard' ? '600' : '400', fontSize: '0.9rem' }}>
                        <LayoutDashboard size={18} />
                        Métricas
                    </Link>
                    <Link to="/dashboard/inventory" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', color: location.pathname.includes('/inventory') ? 'var(--accent-primary)' : 'var(--text-secondary)', textDecoration: 'none', borderRadius: '8px', background: location.pathname.includes('/inventory') ? 'rgba(230,57,39,0.06)' : 'transparent', fontWeight: location.pathname.includes('/inventory') ? '600' : '400', fontSize: '0.9rem' }}>
                        <PackageSearch size={18} />
                        Inventario SAE
                    </Link>
                </nav>

                <div style={{ padding: '1.25rem' }}>
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-error)', width: '100%', fontSize: '0.9rem' }}>
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<AdminMetrics />} />
                    <Route path="/inventory" element={<InventoryManagement />} />
                </Routes>
            </main>
        </div>
    );
}

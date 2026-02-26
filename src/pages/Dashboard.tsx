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
                <h2>Access Denied</h2>
                <button onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="app-container dashboard-layout" style={{ flexDirection: 'row' }}>
            {/* Sidebar */}
            <aside className="glass-panel dashboard-sidebar" style={{ width: '280px', margin: '1rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem' }}>
                    <h2 className="text-gradient">SAE Metrics</h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem', flex: 1 }}>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', color: location.pathname === '/dashboard' ? 'white' : 'var(--text-secondary)', textDecoration: 'none', borderRadius: '8px', background: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                        <LayoutDashboard size={20} />
                        Metricas Generales
                    </Link>
                    <Link to="/dashboard/inventory" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', color: location.pathname.includes('/inventory') ? 'white' : 'var(--text-secondary)', textDecoration: 'none', borderRadius: '8px', background: location.pathname.includes('/inventory') ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                        <PackageSearch size={20} />
                        Inventario SAE
                    </Link>
                </nav>

                <div style={{ padding: '2rem' }}>
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-error)', width: '100%' }}>
                        <LogOut size={20} />
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

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, History, LogOut, Package } from 'lucide-react';
import Catalog from './Catalog';
import ProductDetail from './ProductDetail';

export default function WholesalePortal() {
    const { role, logout, saeClientId } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="app-container" style={{ flexDirection: 'column' }}>
            {/* Navbar */}
            <nav className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', margin: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <h2 className="text-gradient" style={{ margin: 0 }}>SAE Mayoreo</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/shop" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Package size={18} /> Catálogo
                        </Link>
                        <Link to="/shop/orders" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <History size={18} /> Mis Pedidos
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {role === 'client' ? (
                        <>
                            <span style={{ color: 'var(--text-secondary)' }}>Cliente: {saeClientId}</span>
                            <button style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', gap: '0.5rem' }}>
                                <ShoppingBag size={18} /> Carrito (0)
                            </button>
                            <button onClick={logout} style={{ color: 'var(--text-secondary)' }} title="Cerrar Sesión">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px' }}>
                            Iniciar Sesión Mayorista
                        </button>
                    )}
                </div>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Catalog />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/orders" element={<div><h2>Historial de Pedidos</h2><p>Here we will list past orders.</p></div>} />
                </Routes>
            </main>
        </div>
    );
}

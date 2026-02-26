import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, History, LogOut, Package } from 'lucide-react';
import Catalog from './Catalog';
import ProductDetail from './ProductDetail';

export default function WholesalePortal() {
    const { role, logout, saeClientId } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="app-container" style={{ flexDirection: 'column', overflowX: 'hidden' }}>
            {/* Navbar */}
            <nav className="glass-panel catalog-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.5rem', margin: '0.75rem', borderRadius: '12px', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.25rem' }}>
                        <Package size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Mercadex
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/shop" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500', fontSize: '0.9rem' }}>
                            <Package size={16} /> Catálogo
                        </Link>
                        <Link to="/shop/orders" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                            <History size={16} /> Mis Pedidos
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {role === 'client' ? (
                        <>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cliente: {saeClientId}</span>
                            <button style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.85rem' }}>
                                <ShoppingBag size={16} /> Carrito (0)
                            </button>
                            <button onClick={logout} style={{ color: 'var(--text-secondary)' }} title="Cerrar Sesión">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                            Iniciar Sesión
                        </button>
                    )}
                </div>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Catalog />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/orders" element={<div><h2>Historial de Pedidos</h2><p style={{ color: 'var(--text-secondary)' }}>Aquí se listarán los pedidos anteriores.</p></div>} />
                </Routes>
            </main>
        </div>
    );
}

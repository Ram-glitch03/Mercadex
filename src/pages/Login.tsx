import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, ShoppingBag, ArrowRight, ShieldCheck, Database, Zap } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role: 'admin' | 'client') => {
        login(role);
        if (role === 'admin') navigate('/dashboard');
        else navigate('/shop');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', overflowX: 'hidden' }}>
            {/* Hero Banner */}
            <div style={{ background: 'var(--bg-secondary)', padding: '3rem 2rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '20px', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={14} color="var(--accent-success)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>ERP Nativo Activo • Mercadex Portal</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.1', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    Portal de Mayoreo <span style={{ color: 'var(--accent-primary)' }}>Mercadex</span>
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                    Stock sincronizado en la nube en tiempo real.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <Database size={18} color="var(--accent-primary)" /> <span style={{ fontSize: '0.85rem' }}>PostgreSQL Supabase</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <Zap size={18} color="var(--accent-warning)" /> <span style={{ fontSize: '0.85rem' }}>n8n Automation</span>
                    </div>
                </div>
            </div>

            {/* Login Options */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '100%', maxWidth: '450px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Bienvenido</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>Selecciona tu método de acceso al portal.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            className="glass-panel interactive"
                            onClick={() => handleLogin('admin')}
                            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', border: '1px solid rgba(230,57,39,0.15)', background: 'white', width: '100%' }}
                        >
                            <div style={{ background: 'rgba(230,57,39,0.08)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-primary)', border: '1px solid rgba(230,57,39,0.15)' }}>
                                <Activity size={22} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.15rem', color: 'var(--text-primary)' }}>Personal Interno</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Métricas financieras e inventario.</p>
                            </div>
                            <ArrowRight size={18} color="var(--text-secondary)" />
                        </button>

                        <button
                            className="glass-panel interactive"
                            onClick={() => handleLogin('client')}
                            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', border: '1px solid rgba(230,57,39,0.1)', background: 'white', width: '100%' }}
                        >
                            <div style={{ background: 'rgba(230,57,39,0.05)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-primary)', border: '1px solid rgba(230,57,39,0.1)' }}>
                                <ShoppingBag size={22} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.15rem', color: 'var(--text-primary)' }}>Cliente Mayorista</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Cotizar pedidos y ver pedidos anteriores.</p>
                            </div>
                            <ArrowRight size={18} color="var(--text-secondary)" />
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>&copy; 2026 Mercadex. Todos los derechos reservados.</span>
                </div>
            </div>
        </div>
    );
}

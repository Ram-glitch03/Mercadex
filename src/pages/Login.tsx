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
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            {/* Visual Side */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '5rem', background: 'linear-gradient(200deg, #0a0f1c 0%, #030712 100%)' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

                <div style={{ position: 'relative', zIndex: 10, maxWidth: '650px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '20px', marginBottom: '2.5rem', backdropFilter: 'blur(8px)' }}>
                        <ShieldCheck size={16} color="var(--accent-success)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500', letterSpacing: '0.5px' }}>SAE Sync Activo &bull; Mercadex Portal</span>
                    </div>

                    <h1 style={{ fontSize: '4.5rem', lineHeight: '1.05', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                        <span className="text-gradient">Portal de Mayoreo</span><br />
                        En Tiempo Real.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '540px' }}>
                        Explora las líneas de importación exclusivas: Ropa Target, Amazon Pallets, Juguetes y Electrónicos. Stock sincronizado al minuto desde ASPEL SAE.
                    </p>

                    {/* Dashboard Abstract visualization */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '220px', opacity: 0.9, position: 'relative', overflow: 'hidden' }}>
                        {[40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                            <div key={i} style={{ flex: 1, background: i === 7 ? 'linear-gradient(to top, var(--accent-primary), rgba(59, 130, 246, 0.4))' : 'rgba(255,255,255,0.08)', height: `${h}%`, borderRadius: '4px', position: 'relative', overflow: 'hidden', transition: 'height 1s ease', animation: `grow ${1 + i * 0.1}s ease-out` }}>
                                {i === 7 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)' }} />}
                            </div>
                        ))}
                        <style>{`
                @keyframes grow { from { height: 0%; } }
             `}</style>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                            <Database size={20} color="var(--accent-primary)" /> <span style={{ fontSize: '0.9rem' }}>PostgreSQL Supabase</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                            <Zap size={20} color="var(--accent-warning)" /> <span style={{ fontSize: '0.9rem' }}>n8n Automation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Side */}
            <div style={{ width: '480px', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ marginBottom: '3.5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Bienvenido</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Selecciona tu método de acceso al portal.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <button
                        className="glass-panel interactive"
                        onClick={() => handleLogin('admin')}
                        style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'left', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))', padding: '1rem', borderRadius: '12px', color: 'var(--accent-primary)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                            <Activity size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Personal Interno</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Métricas financieras e inventario.</p>
                        </div>
                        <ArrowRight size={20} color="var(--text-secondary)" />
                    </button>

                    <button
                        className="glass-panel interactive"
                        onClick={() => handleLogin('client')}
                        style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'left', border: '1px solid rgba(139, 92, 246, 0.2)' }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))', padding: '1rem', borderRadius: '12px', color: 'var(--accent-secondary)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                            <ShoppingBag size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Cliente Mayorista Activo</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Iniciar sesión para cotizar pedidos y pedidos anteriores.</p>
                        </div>
                        <ArrowRight size={20} color="var(--text-secondary)" />
                    </button>
                </div>

                <div style={{ position: 'absolute', bottom: '2rem', left: '0', right: '0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>&copy; 2026 Inteligencia. Todos los derechos reservados.</span>
                </div>
            </div>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Activity, ArrowRight, ShieldCheck, Package, Truck, BarChart3, Database, Zap } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
            {/* Ambient Background */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-30%', right: '-15%', width: '900px', height: '900px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '40%', left: '50%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%', transform: 'translateX(-50%)' }} />
            </div>

            {/* Top Nav */}
            <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Package size={28} color="var(--accent-primary)" />
                    <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                        <span className="text-gradient">Mercadex</span>
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 8px var(--accent-success)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: '500' }}>SAE Online</span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        Acceso Interno
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 3rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '24px', marginBottom: '2rem', backdropFilter: 'blur(8px)' }}>
                    <ShieldCheck size={16} color="var(--accent-success)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Inventario sincronizado en tiempo real desde ASPEL SAE</span>
                </div>

                <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: '1.05', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', maxWidth: '900px' }}>
                    <span className="text-gradient">Portal de Mayoreo</span><br />
                    Mercadex
                </h1>

                <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '650px' }}>
                    Explora las líneas de importación exclusivas: Ropa Target, Amazon Pallets, Juguetes y Electrónicos. Precios escalonados por volumen con stock actualizado al minuto.
                </p>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/shop')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: 'linear-gradient(135deg, var(--accent-primary), rgba(59,130,246,0.8))',
                            color: 'white', padding: '1.25rem 2.5rem', borderRadius: '12px',
                            fontSize: '1.15rem', fontWeight: '700', border: 'none', cursor: 'pointer',
                            boxShadow: '0 8px 32px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                            transition: 'all 0.3s', letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
                    >
                        <ShoppingBag size={22} /> Ver Catálogo Mayoreo
                        <ArrowRight size={20} />
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: 'rgba(255,255,255,0.03)',
                            color: 'white', padding: '1.25rem 2.5rem', borderRadius: '12px',
                            fontSize: '1.15rem', fontWeight: '600', cursor: 'pointer',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.3s', letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <Activity size={20} /> Panel Administrativo
                    </button>
                </div>

                {/* Feature Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: '900px', width: '100%' }}>
                    {[
                        { icon: <Truck size={24} />, title: 'Envío Directo', desc: 'Desde nuestras bodegas a tu negocio', color: 'var(--accent-primary)' },
                        { icon: <BarChart3 size={24} />, title: 'Precios por Volumen', desc: 'Descuentos automáticos por cantidad', color: 'var(--accent-success)' },
                        { icon: <Database size={24} />, title: 'Stock en Tiempo Real', desc: 'Sincronizado con ASPEL SAE', color: 'var(--accent-secondary)' },
                        { icon: <Zap size={24} />, title: 'Cotización Rápida', desc: 'Agrega al carrito y solicita tu pedido', color: 'var(--accent-warning)' },
                    ].map((feat, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', transition: 'transform 0.2s, border-color 0.2s', cursor: 'default' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                        >
                            <div style={{ color: feat.color, marginBottom: '0.75rem', opacity: 0.9 }}>{feat.icon}</div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{feat.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>&copy; 2026 Mercadex &bull; Portal de Mayoreo &bull; Powered by Inteligencia</span>
            </footer>
        </div>
    );
}

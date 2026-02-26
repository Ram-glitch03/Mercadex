import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Activity, ArrowRight, ShieldCheck, Package, Truck, BarChart3, Database, Zap } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
            {/* Ambient Background */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(230,57,39,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-30%', right: '-15%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(244,244,244,0.5) 0%, transparent 70%)', borderRadius: '50%' }} />
            </div>

            {/* Top Nav */}
            <nav className="landing-nav" style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Package size={28} color="var(--accent-primary)" />
                    <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-primary)' }}>
                        Mercadex
                    </h1>
                </div>
                <div className="landing-nav-buttons" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)', borderRadius: '20px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 6px var(--accent-success)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: '500' }}>SAE Online</span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-highlight)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        Acceso Interno
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="landing-hero" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '24px', marginBottom: '2rem' }}>
                    <ShieldCheck size={16} color="var(--accent-success)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '0.3px' }}>Inventario sincronizado en tiempo real desde ASPEL SAE</span>
                </div>

                <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', lineHeight: '1.1', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', maxWidth: '800px' }}>
                    Portal de Mayoreo<br />
                    <span style={{ color: 'var(--accent-primary)' }}>Mercadex</span>
                </h1>

                <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '600px' }}>
                    Explora las líneas de importación exclusivas: Ropa Target, Amazon Pallets, Juguetes y Electrónicos. Precios escalonados por volumen con stock actualizado al minuto.
                </p>

                {/* CTA Buttons */}
                <div className="hero-cta" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '500px' }}>
                    <button
                        onClick={() => navigate('/shop')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: 'var(--accent-primary)',
                            color: 'white', padding: '1rem 2rem', borderRadius: '10px',
                            fontSize: '1.05rem', fontWeight: '700', border: 'none', cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(230,57,39,0.3)',
                            transition: 'all 0.3s', letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(230,57,39,0.4)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(230,57,39,0.3)'; }}
                    >
                        <ShoppingBag size={20} /> Ver Catálogo Mayoreo
                        <ArrowRight size={18} />
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)', padding: '1rem 2rem', borderRadius: '10px',
                            fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.3s', letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = 'var(--border-highlight)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <Activity size={18} /> Panel Administrativo
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="landing-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '850px', width: '100%' }}>
                    {[
                        { icon: <Truck size={22} />, title: 'Envío Directo', desc: 'Desde nuestras bodegas a tu negocio', color: 'var(--accent-primary)' },
                        { icon: <BarChart3 size={22} />, title: 'Precios por Volumen', desc: 'Descuentos automáticos por cantidad', color: 'var(--accent-success)' },
                        { icon: <Database size={22} />, title: 'Stock en Tiempo Real', desc: 'Sincronizado con ASPEL SAE', color: 'var(--accent-warning)' },
                        { icon: <Zap size={22} />, title: 'Cotización Rápida', desc: 'Agrega al carrito y solicita pedido', color: 'var(--accent-primary)' },
                    ].map((feat, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left', transition: 'transform 0.2s', cursor: 'default' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ color: feat.color, marginBottom: '0.6rem', opacity: 0.9 }}>{feat.icon}</div>
                            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>{feat.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>&copy; 2026 Mercadex &bull; Portal de Mayoreo &bull; Powered by Inteligencia</span>
            </footer>
        </div>
    );
}

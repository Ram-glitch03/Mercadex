import { useState, useEffect } from 'react';
import { Search, Filter, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import type { ProductWithTiers } from '../types/database';

export default function Catalog() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductWithTiers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Sincronizando inventario...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    // Map API data to the format expected by the UI
    const displayProducts = products.map(p => ({
        ...p,
        tiers: p.tiers.map(t => ({ q: t.label, p: t.price })),
    }));

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div className="glass-panel catalog-hero" style={{ padding: '3rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '400px', height: '400px', background: 'var(--accent-primary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%' }} />
                <h1 className="text-gradient catalog-hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Surtido y Mayoreo Directo (Mercadex)</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Inventario en tiempo real de lotes de Ropa, Maquillaje, Electrónicos y Paquetes de Amazon directamente de nuestras bodegas, con precios escalonados por volumen.
                </p>
                <div className="catalog-hero-search" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', width: '400px', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'} onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                        <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
                        <input type="text" placeholder="Buscar por SKU..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)' }} />
                    </div>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Filter size={18} /> Filtros
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Tarifas de Volumen (Real-Time)</h2>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mostrando {displayProducts.length} productos</span>
            </div>

            {/* Grid */}
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                {displayProducts.map((p) => (
                    <div
                        key={p.id}
                        className="glass-panel interactive"
                        onClick={() => navigate(`/shop/product/${p.id}`, { state: { product: p } })}
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', overflow: 'hidden', flexShrink: 0 }}>
                                    {p.image ? (
                                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box opacity={0.3} size={32} color="var(--text-secondary)" /></div>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>{p.category}</span>
                                    <h3 style={{ margin: '0.25rem 0', fontSize: '1.15rem', lineHeight: '1.2' }}>{p.name}</h3>
                                </div>
                            </div>
                            {p.tag && (
                                <span style={{ background: p.tag === 'No Acumulable' ? 'var(--accent-warning)' : 'var(--accent-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0, marginLeft: '0.5rem' }}>
                                    {p.tag}
                                </span>
                            )}
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.description}</p>

                        {/* Escala de precios */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', marginTop: '0.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {p.tiers.map((t, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)', textTransform: 'uppercase' }}>Nivel {i + 1}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--accent-success)' }}>{t.q}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '0.75rem 0.5rem' }}>
                                {p.tiers.map((t, i) => (
                                    <div key={i} style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', color: i === p.tiers.length - 1 ? 'var(--accent-primary)' : 'white' }}>
                                        ${t.p}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', marginTop: 'auto' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SKU: {p.id}</span>
                            <span style={{ color: p.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)', boxShadow: `0 0 8px ${p.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)'}` }} />
                                {p.stock} dsps.
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

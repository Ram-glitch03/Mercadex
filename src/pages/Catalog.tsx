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
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Sincronizando inventario...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    const displayProducts = products.map(p => ({
        ...p,
        tiers: p.tiers.map(t => ({ q: t.label, p: t.price })),
    }));

    return (
        <div style={{ paddingBottom: '2rem', overflowX: 'hidden' }}>
            {/* Hero Section */}
            <div className="glass-panel catalog-hero" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                <h1 className="catalog-hero-title" style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                    Surtido y Mayoreo <span style={{ color: 'var(--accent-primary)' }}>Mercadex</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '550px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    Inventario en tiempo real de lotes de Ropa, Maquillaje, Electrónicos y Paquetes de Amazon con precios escalonados por volumen.
                </p>
                <div className="catalog-hero-search" style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem', flexShrink: 0 }} />
                        <input type="text" placeholder="Buscar por SKU..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontFamily: 'var(--font-sans)' }} />
                    </div>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                        <Filter size={16} /> Filtros
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Tarifas de Volumen</h2>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Mostrando {displayProducts.length} productos</span>
            </div>

            {/* Grid */}
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                {displayProducts.map((p) => (
                    <div
                        key={p.id}
                        className="glass-panel interactive"
                        onClick={() => navigate(`/shop/product/${p.id}`, { state: { product: p } })}
                        style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', background: 'white' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', overflow: 'hidden', flexShrink: 0 }}>
                                    {p.image ? (
                                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box opacity={0.3} size={28} color="var(--text-secondary)" /></div>
                                    )}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{p.category}</span>
                                    <h3 style={{ margin: '0.15rem 0', fontSize: '1rem', lineHeight: '1.2', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h3>
                                </div>
                            </div>
                            {p.tag && (
                                <span style={{ background: p.tag === 'No Acumulable' ? 'var(--accent-warning)' : 'var(--accent-primary)', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', padding: '0.2rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0, marginLeft: '0.4rem' }}>
                                    {p.tag}
                                </span>
                            )}
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{p.description}</p>

                        {/* Price tiers */}
                        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', marginTop: '0.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.tiers.length}, 1fr)`, background: 'rgba(230,57,39,0.06)', padding: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                                {p.tiers.map((t, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase' }}>Nivel {i + 1}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--accent-primary)' }}>{t.q}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.tiers.length}, 1fr)`, padding: '0.5rem 0.4rem' }}>
                                {p.tiers.map((t, i) => (
                                    <div key={i} style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: i === p.tiers.length - 1 ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                                        ${t.p}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.25rem', marginTop: 'auto' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SKU: {p.id}</span>
                            <span style={{ color: p.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)' }} />
                                {p.stock} dsps.
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

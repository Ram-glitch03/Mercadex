import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Info, Check, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // Fallback data in case we navigate directly without state (for development)
    const product = location.state?.product || {
        id: id || 'MERC-001', name: 'Alo Leggins',
        description: 'Tallas S, M y L. Colores: Negro, Café, Navy, Gris, Durazno',
        stock: 150, category: 'ALO ROPA', tag: 'Top Ventas',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
        tiers: [
            { q: '1-4 pzs', p: 1050, threshold: 1 },
            { q: '+5 pzs', p: 920, threshold: 5 },
            { q: '+20 pzs', p: 810, threshold: 20 },
            { q: '+30 pzs', p: 765, threshold: 30 }
        ]
    };

    // Ensure tiers have numeric thresholds for calculation
    const parsedTiers = product.tiers.map((t: any, i: number) => {
        // Basic heuristic to extract number, fallback to index based assumption if not provided
        const match = t.q.match(/\d+/);
        const fallbackThreshold = i === 0 ? 1 : i === 1 ? 5 : i === 2 ? 20 : 50;
        return { ...t, threshold: t.threshold || (match ? parseInt(match[0]) : fallbackThreshold) };
    });

    // Dynamic pricing logic based on quantity
    const currentPrice = useMemo(() => {
        let price = parsedTiers[0].p;
        for (const tier of parsedTiers) {
            if (quantity >= tier.threshold) {
                price = tier.p;
            }
        }
        return price;
    }, [quantity, parsedTiers]);

    const activeTierIndex = useMemo(() => {
        let index = 0;
        parsedTiers.forEach((tier: any, i: number) => {
            if (quantity >= tier.threshold) index = i;
        });
        return index;
    }, [quantity, parsedTiers]);

    const handleAddToCart = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div style={{ paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/shop')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
                <ArrowLeft size={20} /> Volver al Catálogo
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: '3rem', alignItems: 'start' }}>

                {/* Left Column: Image & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(59,130,246,0.1), transparent 70%)' }}></div>
                        {product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} />
                        ) : (
                            <div style={{ textAlign: 'center', opacity: 0.5 }}>
                                <ShieldCheck size={80} style={{ margin: '0 auto 1rem auto', color: 'var(--accent-primary)' }} strokeWidth={1} />
                                <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Imagen Verificada</p>
                                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Mercadex Original &copy;</p>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Descripción Completa</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            {product.description}. Producto garantizado bajo estándares de importación. Todos los lotes se revisan en tiempo real en nuestras bodegas (SAE Sync).
                        </p>
                    </div>
                </div>

                {/* Right Column: Pricing & Purchase */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Title & Status */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>{product.category}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>SKU: {product.id}</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <span style={{ color: product.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)', boxShadow: `0 0 10px ${product.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)'}` }} />
                                {product.stock} unidades disponibles
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <Truck size={18} /> Envío Inmediato
                            </span>
                        </div>
                    </div>

                    {/* Tiered Pricing Table */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Info size={18} color="var(--accent-primary)" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Estructura de Precios por Volumen</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${parsedTiers.length}, 1fr)`, gap: '0.5rem' }}>
                            {parsedTiers.map((t: any, i: number) => {
                                const isActive = activeTierIndex === i;
                                return (
                                    <div key={i} style={{
                                        padding: '1rem 0.5rem',
                                        textAlign: 'center',
                                        borderRadius: '8px',
                                        background: isActive ? 'linear-gradient(to bottom, rgba(59, 130, 246, 0.2), transparent)' : 'rgba(0,0,0,0.2)',
                                        border: `1px solid ${isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
                                        transition: 'all 0.3s'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isActive ? 'white' : 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Nivel {i + 1}</div>
                                        <div style={{ fontSize: '0.8rem', color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)', marginBottom: '0.75rem' }}>{t.q}</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: isActive ? 'white' : 'var(--text-secondary)' }}>${t.p}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Purchase Options */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Precio Aplicable (Unidad)</span>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-primary)', lineHeight: '1' }}>${currentPrice}</span>
                                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>MXN</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Cantidad a Solicitar</span>
                                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem' }}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '36px', height: '36px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>-</button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        style={{ width: '60px', textAlign: 'center', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', outline: 'none' }}
                                    />
                                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: '36px', height: '36px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>+</button>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Subtotal Estimado:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>${(currentPrice * quantity).toLocaleString()} MXN</span>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleAddToCart}
                                style={{ flex: 2, padding: '1rem', background: added ? 'var(--accent-success)' : 'var(--accent-primary)', border: 'none', color: 'white', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: added ? '0 4px 15px rgba(16, 185, 129, 0.4)' : '0 4px 15px rgba(59, 130, 246, 0.4)' }}
                            >
                                {added ? <><Check size={20} /> Agregado al Cotizador</> : <><ShoppingCart size={20} /> Agregar al Pedido</>}
                            </button>
                            <button style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                Guardar Favorito
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

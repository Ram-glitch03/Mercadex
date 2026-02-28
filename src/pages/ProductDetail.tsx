import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Info, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1); // Fallback for no-variant products
    const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});
    const [added, setAdded] = useState(false);

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
        ],
        variants: [
            { id: 'v1', label: 'Talla S - Negro' },
            { id: 'v2', label: 'Talla M - Negro' },
            { id: 'v3', label: 'Talla L - Negro' }
        ]
    };

    const hasVariants = product.variants && product.variants.length > 0;

    const totalQuantity = useMemo(() => {
        if (!hasVariants) return quantity;
        return Object.values(variantQuantities).reduce((acc, curr) => acc + curr, 0);
    }, [quantity, variantQuantities, hasVariants]);

    const groupedVariants = useMemo(() => {
        if (!hasVariants) return null;

        const groups: Record<string, any[]> = {};
        let isGroupable = true;

        product.variants.forEach((v: any) => {
            const parts = v.label.split(' - ');
            if (parts.length === 2 && parts[0] && parts[1]) {
                const groupName = parts[0].trim();
                const optionName = parts[1].trim();
                if (!groups[groupName]) groups[groupName] = [];
                groups[groupName].push({ ...v, optionLabel: optionName });
            } else {
                isGroupable = false;
            }
        });

        return isGroupable ? groups : null;
    }, [product.variants, hasVariants]);

    const getGroupColor = (name: string) => {
        const map: Record<string, string> = {
            'Black': '#1A1A1A',
            'Espresso': '#4E342E',
            'Gray': '#9E9E9E',
            'Mushroom': '#A1887F',
            'Navy': '#1A237E',
            'Pink wild': '#E91E63',
            'Sweet pink': '#F48FB1'
        };
        return map[name] || '#E0E0E0';
    };

    const parsedTiers = product.tiers.map((t: any, i: number) => {
        const match = t.q.match(/\d+/);
        const fallbackThreshold = i === 0 ? 1 : i === 1 ? 5 : i === 2 ? 20 : 50;
        return { ...t, threshold: t.threshold || (match ? parseInt(match[0]) : fallbackThreshold) };
    });

    const currentPrice = useMemo(() => {
        let price = parsedTiers[0].p;
        for (const tier of parsedTiers) {
            if (totalQuantity >= tier.threshold) {
                price = tier.p;
            }
        }
        return price;
    }, [totalQuantity, parsedTiers]);

    const activeTierIndex = useMemo(() => {
        let index = 0;
        parsedTiers.forEach((tier: any, i: number) => {
            if (totalQuantity >= tier.threshold) index = i;
        });
        return index;
    }, [totalQuantity, parsedTiers]);

    const handleUpdateVariantQuantity = (variantId: string, newQt: number) => {
        setVariantQuantities(prev => ({
            ...prev,
            [variantId]: Math.max(0, newQt)
        }));
    };

    const handleAddToCart = () => {
        if (hasVariants) {
            if (totalQuantity === 0) {
                alert('Por favor selecciona la cantidad de las variantes que deseas.');
                return;
            }
            // Add each selected variant as a separate cart item
            product.variants.forEach((v: any) => {
                const qt = variantQuantities[v.id] || 0;
                if (qt > 0) {
                    addToCart({
                        id: `${product.id}-${v.id}`,
                        productId: product.id,
                        productName: product.name,
                        image: product.image,
                        quantity: qt,
                        unitPrice: currentPrice, // All get the exact same volume price
                        categoryId: product.category,
                        variantLabel: v.label
                    });
                }
            });
        } else {
            addToCart({
                id: product.id,
                productId: product.id,
                productName: product.name,
                image: product.image,
                quantity: quantity,
                unitPrice: currentPrice,
                categoryId: product.category
            });
        }

        setAdded(true);
        setVariantQuantities({}); // reset after adding
        if (!hasVariants) setQuantity(1);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div style={{ paddingBottom: '2rem', maxWidth: '1100px', margin: '0 auto', overflowX: 'hidden' }}>
            <button
                onClick={() => navigate('/shop')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
                <ArrowLeft size={18} /> Volver al Catálogo
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Top: Image + Title */}
                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                        {product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ textAlign: 'center', opacity: 0.5 }}>
                                <ShieldCheck size={60} style={{ margin: '0 auto 0.75rem auto', color: 'var(--accent-primary)' }} strokeWidth={1} />
                                <p style={{ letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mercadex Original</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 'bold' }}>{product.category}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>SKU: {product.id}</span>
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{product.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {product.description}. Producto garantizado bajo estándares de importación.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ color: product.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-secondary)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: product.stock > 20 ? 'var(--accent-success)' : 'var(--accent-warning)' }} />
                                {product.stock} disponibles
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <Truck size={16} /> Envío Inmediato
                            </span>
                        </div>
                    </div>
                </div>

                {hasVariants && groupedVariants ? (
                    <div className="glass-panel" style={{ background: 'white', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Elige tus colores y tallas</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Haz clic en un color para desplegar y seleccionar los tamaños.</p>
                        </div>
                        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {Object.entries(groupedVariants).map(([groupName, options]) => {
                                const groupTotal = options.reduce((sum: number, opt: any) => sum + (variantQuantities[opt.id] || 0), 0);

                                return (
                                    <details key={groupName} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                        <summary style={{ padding: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: getGroupColor(groupName), border: '1px solid rgba(0,0,0,0.1)' }} />
                                                <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{groupName}</span>
                                            </div>
                                            {groupTotal > 0 && <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>{groupTotal} pzs</span>}
                                        </summary>
                                        <div style={{ padding: '0.5rem 1rem 1rem 1rem', background: 'white', borderTop: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                                                {options.map((opt: any) => {
                                                    const q = variantQuantities[opt.id] || 0;
                                                    return (
                                                        <div key={opt.id} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                                                            <div style={{ padding: '0.4rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                                                                Talla {opt.optionLabel}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', background: 'white' }}>
                                                                <button onClick={() => handleUpdateVariantQuantity(opt.id, q - 1)} style={{ padding: '0.4rem 0.6rem', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                                                                <input type="number" readOnly value={q} style={{ flex: 1, width: '100%', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.9rem' }} />
                                                                <button onClick={() => handleUpdateVariantQuantity(opt.id, q + 1)} style={{ padding: '0.4rem 0.6rem', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </details>
                                );
                            })}
                        </div>
                    </div>
                ) : hasVariants ? (
                    <div className="glass-panel" style={{ background: 'white', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Elige tus variantes</h3>
                        </div>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'var(--accent-primary)', color: 'white' }}>
                                        <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600 }}>TIPO / SABOR</th>
                                        <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, width: '180px', textAlign: 'center' }}>SELECCIONA TUS PIEZAS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.variants.map((v: any, idx: number) => {
                                        const q = variantQuantities[v.id] || 0;
                                        return (
                                            <tr key={v.id} style={{ borderBottom: idx === product.variants.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1rem 1.25rem' }}>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{v.label}</div>
                                                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600 }}>DISPONIBLE</div>
                                                </td>
                                                <td style={{ padding: '1rem 1.25rem', verticalAlign: 'middle' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', width: '100%' }}>
                                                        <button onClick={() => handleUpdateVariantQuantity(v.id, q - 1)} style={{ padding: '0.5rem 0.75rem', background: 'white', borderRight: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 'bold' }}>-</button>
                                                        <input type="number" readOnly value={q} style={{ flex: 1, width: '40px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 'bold' }} />
                                                        <button onClick={() => handleUpdateVariantQuantity(v.id, q + 1)} style={{ padding: '0.5rem 0.75rem', background: 'white', borderLeft: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 'bold' }}>+</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}

                {/* Tier Pricing */}
                <div className="glass-panel" style={{ padding: '1.25rem', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                        <Info size={16} color="var(--accent-primary)" />
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Precios por Volumen</h3>
                    </div>
                    <div className="tier-pricing-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${parsedTiers.length}, 1fr)`, gap: '0.5rem' }}>
                        {parsedTiers.map((t: any, i: number) => {
                            const isActive = activeTierIndex === i;
                            return (
                                <div key={i} style={{
                                    padding: '0.75rem 0.4rem', textAlign: 'center', borderRadius: '8px',
                                    background: isActive ? 'rgba(230,57,39,0.06)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                    transition: 'all 0.3s'
                                }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.15rem' }}>Nivel {i + 1}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t.q}</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)' }}>${t.p}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Purchase */}
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'white', border: '1px solid rgba(230,57,39,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Precio Aplicable (Unidad)</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', lineHeight: '1' }}>${currentPrice}</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>MXN</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Cantidad Total</span>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 1rem' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalQuantity}</span>
                                {!hasVariants && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '28px', height: '28px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '4px' }}>-</button>
                                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: '28px', height: '28px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '4px' }}>+</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Subtotal Estimado:</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>${(currentPrice * totalQuantity).toLocaleString()} MXN</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleAddToCart}
                            style={{ flex: 2, minWidth: '200px', padding: '0.85rem', background: added ? 'var(--accent-success)' : 'var(--accent-primary)', border: 'none', color: 'white', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: added ? '0 4px 12px rgba(22,163,74,0.3)' : '0 4px 12px rgba(230,57,39,0.3)' }}
                        >
                            {added ? <><Check size={18} /> Agregado</> : <><ShoppingCart size={18} /> Agregar al Pedido</>}
                        </button>
                        <button style={{ flex: 1, minWidth: '120px', padding: '0.85rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

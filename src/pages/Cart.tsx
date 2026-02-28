import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-primary)' }}>
                Tu Carrito <span style={{ color: 'var(--accent-primary)' }}>({cartCount})</span>
            </h1>

            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                    <ShoppingCart size={60} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Tu carrito está vacío</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Explora nuestro catálogo para añadir productos con precio preferencial por volumen.</p>
                    <button
                        onClick={() => navigate('/shop')}
                        style={{ padding: '0.75rem 2rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Ir al Catálogo
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 2fr) 1fr', gap: '2rem', alignItems: 'start' }}>

                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cart.map(item => (
                            <div key={item.id} className="glass-panel" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', background: 'white', alignItems: 'center' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '8px', background: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0 }}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                                            <ShieldCheck size={40} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{item.productName}</h3>
                                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-error)', cursor: 'pointer', opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    {item.variantLabel && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>{item.variantLabel}</p>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.1rem' }}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '28px', height: '28px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', cursor: 'pointer' }}>-</button>
                                            <input type="number" value={item.quantity} readOnly style={{ width: '40px', textAlign: 'center', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 'bold' }} />
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '28px', height: '28px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>${item.unitPrice} c/u</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>${(item.unitPrice * item.quantity).toLocaleString()} MXN</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="glass-panel" style={{ padding: '2rem', background: 'white', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1.5rem', color: 'var(--text-primary)' }}>Resumen</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', color: 'var(--text-secondary)' }}>
                            <span>Subtotal ({cartCount} prod)</span>
                            <span>${cartTotal.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', color: 'var(--text-secondary)' }}>
                            <span>Impuestos Estimados</span>
                            <span>Calculados en checkout</span>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'baseline' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Total Estimado</span>
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-primary)' }}>${cartTotal.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>MXN</span></span>
                        </div>

                        <button
                            onClick={() => navigate('/shop/checkout')}
                            style={{ width: '100%', padding: '1rem', background: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.3s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'black'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--text-primary)'}
                        >
                            Proceder al Pago Segura <ArrowRight size={18} />
                        </button>

                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <ShieldCheck size={16} /> Compra protegida.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
// Note: We need to import ShoppingCart in case it's empty
import { ShoppingCart } from 'lucide-react';

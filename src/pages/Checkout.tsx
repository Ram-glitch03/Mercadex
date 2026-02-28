import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, CreditCard, Lock, Loader2 } from 'lucide-react';

export default function Checkout() {
    const { cartTotal, cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState<'details' | 'redirecting' | 'redsys' | 'success'>('details');

    // Tax calculation
    const tax = cartTotal * 0.16;
    const finalTotal = cartTotal + tax;

    useEffect(() => {
        if (step === 'redirecting') {
            const timer = setTimeout(() => setStep('redsys'), 2000);
            return () => clearTimeout(timer);
        }
        if (step === 'redsys') {
            // Simulate Redsys processing
            const timer = setTimeout(() => {
                setStep('success');
                clearCart();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step, clearCart]);

    if (cart.length === 0 && step !== 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <h2>No hay productos en el carrito para procesar.</h2>
                <button onClick={() => navigate('/shop')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Volver</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '600px' }}>
            {step === 'details' && (
                <>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-primary)' }}>Pago Seguro B2B</h1>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 400px' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem', background: 'white', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Datos de Facturación</h3>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <input type="text" placeholder="Razón Social / Nombre" defaultValue="Empresa Demo S.A. de C.V." style={inputStyle} />
                                    <input type="text" placeholder="RFC" defaultValue="EME120304XYZ" style={inputStyle} />
                                    <input type="email" placeholder="Correo Electrónico (Para envío de CFDI)" defaultValue="compras@empresademo.com" style={inputStyle} />
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ flex: '1 1 300px', padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                            <h3 style={{ margin: '0 0 1rem', color: 'var(--text-primary)' }}>Resumen de Compra</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><span>IVA (16%)</span><span>${tax.toLocaleString()}</span></div>
                            <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '1rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 800 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--accent-primary)' }}>${finalTotal.toLocaleString()} MXN</span>
                            </div>

                            <button
                                onClick={() => setStep('redirecting')}
                                style={{ width: '100%', padding: '1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Lock size={18} /> Pagar con Redsys
                            </button>
                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Pago procesado de manera segura.
                            </div>
                        </div>
                    </div>
                </>
            )}

            {step === 'redirecting' && (
                <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                    <Loader2 size={60} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }} />
                    <h2>Conectando con la pasarela bancaria...</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Por favor, no cierres esta ventana.</p>
                </div>
            )}

            {step === 'redsys' && (
                <div style={{ maxWidth: '400px', margin: '4rem auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                    <div style={{ background: '#2D3142', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <CreditCard size={24} /> Redsys TPV
                        </h2>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Virtual Gateway</span>
                    </div>
                    <div style={{ padding: '2rem', background: 'white', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)' }}>Procesando pago por <strong>${finalTotal.toLocaleString()} MXN</strong> a favor de MERCADEX.</p>
                        <Loader2 size={40} color="#2D3142" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '1.5rem' }}>Conexión cifrada de extremo a extremo</p>
                    </div>
                </div>
            )}

            {step === 'success' && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <CheckCircle size={80} color="var(--accent-success)" style={{ margin: '0 auto 1.5rem' }} />
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>¡Pago Exitoso!</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        Tu pedido ha sido procesado correctamente. Hemos enviado un correo con tu recibo, y la <strong>Factura Electrónica (CFDI 4.0)</strong> se generará y enviará en los próximos minutos.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate('/shop/orders')} style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                            Ver mis pedidos
                        </button>
                        <button onClick={() => navigate('/shop')} style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                            Volver a comprar
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    outline: 'none',
    fontSize: '0.95rem'
};

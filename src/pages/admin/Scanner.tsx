import { useState, useEffect, useRef } from 'react';
import { ScanLine, CheckCircle2, XCircle, Package, Search, Trash2, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/api';
import type { ProductWithTiers } from '../../types/database';

interface ScannedItem {
    id: string;
    sku: string;
    timestamp: Date;
    status: 'success' | 'error' | 'pending';
    productName?: string;
    currentStock?: number;
}

export default function Scanner() {
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
    const [products, setProducts] = useState<ProductWithTiers[]>([]);
    const [manualSku, setManualSku] = useState('');
    const [isListening, setIsListening] = useState(true);

    // Scanner buffer
    const buffer = useRef('');
    const lastKeyTime = useRef(Date.now());

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    useEffect(() => {
        if (!isListening) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input field
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const currentTime = Date.now();
            const timeDiff = currentTime - lastKeyTime.current;

            // Barcode scanners act as keyboards but type extremely fast (usually < 30ms per char)
            // If the delay is too long, we assume it's human typing and reset the buffer
            if (timeDiff > 50) {
                buffer.current = '';
            }

            if (e.key === 'Enter') {
                if (buffer.current.length > 0) {
                    processScan(buffer.current);
                    buffer.current = '';
                }
            } else if (e.key.length === 1) { // Ignore shift, ctrl, etc.
                buffer.current += e.key;
            }

            lastKeyTime.current = currentTime;
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isListening, products]); // Re-bind when products update to have latest catalog

    const processScan = (sku: string) => {
        const cleanSku = sku.trim().toUpperCase();
        if (!cleanSku) return;

        const foundProduct = products.find(p => p.id.toUpperCase() === cleanSku);

        const newItem: ScannedItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            sku: cleanSku,
            timestamp: new Date(),
            status: foundProduct ? 'success' : 'error',
            productName: foundProduct?.name,
            currentStock: foundProduct?.stock
        };

        setScannedItems(prev => [newItem, ...prev]);
        setManualSku('');
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        processScan(manualSku);
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ScanLine size={28} color="var(--accent-primary)" />
                        Escáner Bluetooth / Almacén
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.5 }}>
                        Conecta tu lector de código de barras por Bluetooth. El sistema está <strong>{isListening ? 'escuchando activamente' : 'pausado'}</strong>. Simplemente escanea un código y se registrará aquí.
                    </p>
                </div>

                <button
                    onClick={() => setIsListening(!isListening)}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: `1px solid ${isListening ? 'var(--accent-success)' : 'var(--border-color)'}`, background: isListening ? 'rgba(22,163,74,0.1)' : 'white', color: isListening ? 'var(--accent-success)' : 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isListening ? 'var(--accent-success)' : 'var(--text-secondary)', boxShadow: isListening ? '0 0 8px var(--accent-success)' : 'none', animation: isListening ? 'pulse 2s infinite' : 'none' }} />
                    {isListening ? 'Recepción Activa' : 'Recepción Pausada'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(350px, 2fr)', gap: '1.5rem', alignItems: 'start' }}>

                {/* Control Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={18} /> Ingreso Manual
                        </h3>
                        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={manualSku}
                                onChange={(e) => setManualSku(e.target.value)}
                                placeholder="Ej. MERC-001"
                                className="input-field"
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0 1rem' }} disabled={!manualSku.trim()}>
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Resumen de Sesión</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Lecturas exitosas</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-success)' }}>{scannedItems.filter(i => i.status === 'success').length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Mermas / Errores</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-error)' }}>{scannedItems.filter(i => i.status === 'error').length}</span>
                        </div>

                        <button
                            onClick={() => setScannedItems([])}
                            style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            disabled={scannedItems.length === 0}
                        >
                            <Trash2 size={16} /> Limpiar Historial
                        </button>
                    </div>
                </div>

                {/* Scan Log Table */}
                <div className="glass-panel" style={{ background: 'white', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Historial de Lecturas</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                            {scannedItems.length} registros
                        </span>
                    </div>

                    {scannedItems.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <ScanLine size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                            <p>Esperando la primera lectura de código de barras...</p>
                        </div>
                    ) : (
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'white', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CÓDIGO (SKU)</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PRODUCTO</th>
                                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>HORA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scannedItems.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', background: item.status === 'error' ? 'rgba(230,57,39,0.03)' : 'white' }}>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {item.status === 'success' ? <CheckCircle2 size={16} color="var(--accent-success)" /> : <XCircle size={16} color="var(--accent-error)" />}
                                                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{item.sku}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                {item.status === 'success' ? (
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.productName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                                                            <Package size={12} /> Stock actual: {item.currentStock}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--accent-error)', fontSize: '0.85rem' }}>Producto no encontrado en SAE</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                                {item.timestamp.toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes pulse { 
                    0% { transform: scale(1); opacity: 1; } 
                    50% { transform: scale(1.5); opacity: 0.5; } 
                    100% { transform: scale(1); opacity: 1; } 
                }
            `}</style>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Edit, MoreVertical, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { getProducts } from '../services/api';
import type { ProductWithTiers } from '../types/database';

export default function InventoryManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [products, setProducts] = useState<ProductWithTiers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const handleManualSync = () => {
        setIsSyncing(true);
        getProducts().then((data) => {
            setProducts(data);
            setIsSyncing(false);
        });
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Cargando inventario SAE...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '2rem', overflowX: 'hidden' }}>
            <div className="catalog-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>Gestión de Inventario (SAE)</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Stock físico sincronizado desde ASPEL SAE.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleManualSync}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.6rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                    >
                        <RefreshCw size={16} className={isSyncing ? 'spin-animation' : ''} />
                        {isSyncing ? 'Sinc...' : 'Sincronizar'}
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        <Plus size={16} /> Nuevo
                    </button>
                </div>
            </div>

            <div className="glass-panel catalog-nav" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', background: 'white' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                    <Search size={16} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Buscar por SKU o nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.85rem' }}
                    />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    <Filter size={16} /> Filtrar
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden', background: 'white' }}>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SKU</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Producto</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categoría</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Precio</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Stock</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sinc.</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Acc.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.id}</td>
                                    <td style={{ padding: '0.85rem 1rem', fontWeight: '500', color: 'var(--text-primary)', fontSize: '0.85rem' }}>{item.name}</td>
                                    <td style={{ padding: '0.85rem 1rem' }}>
                                        <span style={{ background: 'rgba(230,57,39,0.06)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: '500' }}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.85rem' }}>${item.tiers[0]?.price || 0}</td>
                                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                            {item.stock <= item.min_stock && item.stock > 0 && <span style={{ color: 'var(--accent-warning)', fontSize: '0.7rem' }}>Bajo</span>}
                                            {item.stock === 0 && <span style={{ color: 'var(--accent-error)', fontSize: '0.7rem' }}>Agotado</span>}
                                            <span style={{ color: item.stock > item.min_stock ? 'var(--accent-success)' : item.stock > 0 ? 'var(--accent-warning)' : 'var(--accent-error)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                {item.stock}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            {item.status === 'active' ? <CheckCircle2 size={14} color="var(--accent-success)" /> : item.status === 'warning' ? <RefreshCw size={14} color="var(--accent-warning)" /> : <XCircle size={14} color="var(--accent-error)" />}
                                            {item.last_sync}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
                                            <button style={{ background: 'rgba(230,57,39,0.06)', border: 'none', color: 'var(--accent-primary)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }} title="Editar">
                                                <Edit size={14} />
                                            </button>
                                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }} title="Más">
                                                <MoreVertical size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

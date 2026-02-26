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
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Cargando inventario SAE...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div className="catalog-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Gestión de Inventario (SAE)</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Administra y verifica el stock físico sincronizado desde ASPEL SAE.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleManualSync}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <RefreshCw size={18} className={isSyncing ? 'spin-animation' : ''} />
                        {isSyncing ? 'Sincronizando...' : 'Forzar Sincronización'}
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="glass-panel catalog-nav" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
                    <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Buscar por SKU, Nombre o Categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }}
                    />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                    <Filter size={18} /> Filtrar
                </button>
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SKU</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Producto</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categoría</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Precio Nv1</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Stock (SAE)</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Última Sinc.</th>
                                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{item.id}</td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{item.name}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>${item.tiers[0]?.price || 0}</td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            {item.stock <= item.min_stock && item.stock > 0 && <span style={{ color: 'var(--accent-warning)', fontSize: '0.75rem' }}>Bajo</span>}
                                            {item.stock === 0 && <span style={{ color: 'var(--accent-error)', fontSize: '0.75rem' }}>Agotado</span>}
                                            <span style={{ color: item.stock > item.min_stock ? 'var(--accent-success)' : item.stock > 0 ? 'var(--accent-warning)' : 'var(--accent-error)', fontWeight: 'bold' }}>
                                                {item.stock}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {item.status === 'active' ? <CheckCircle2 size={14} color="var(--accent-success)" /> : item.status === 'warning' ? <RefreshCw size={14} color="var(--accent-warning)" /> : <XCircle size={14} color="var(--accent-error)" />}
                                            {item.last_sync}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }} title="Editar Niveles de Precio">
                                                <Edit size={16} />
                                            </button>
                                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }} title="Más Opciones">
                                                <MoreVertical size={16} />
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

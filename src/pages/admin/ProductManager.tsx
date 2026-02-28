import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit3, Trash2, Tag, Loader2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ProductWithTiers } from '../../types/database';

export default function ProductManager() {
    const [products, setProducts] = useState<ProductWithTiers[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<ProductWithTiers> | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        if (supabase) {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase || !currentProduct) return;

        setLoading(true);

        const isNew = !currentProduct.id || currentProduct.id === 'NEW';
        const idToUse = isNew ? `MERC-${Math.floor(Math.random() * 10000)}` : currentProduct.id;

        const productData = {
            id: idToUse,
            name: currentProduct.name,
            description: currentProduct.description || '',
            category: currentProduct.category || 'SIN CLASIFICAR',
            stock: currentProduct.stock || 0,
            min_stock: currentProduct.min_stock || 0,
            status: currentProduct.status || 'active',
            tag: currentProduct.tag || null,
            image: currentProduct.image || null
        };

        if (isNew) {
            await supabase.from('products').insert([productData]);
        } else {
            await supabase.from('products').update(productData).eq('id', productData.id);
        }

        setIsEditing(false);
        setCurrentProduct(null);
        await fetchProducts();
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (window.confirm('¿Estás seguro de eliminar este producto? Se perderán sus variantes y niveles de precio.')) {
            setLoading(true);
            await supabase.from('products').delete().eq('id', id);
            await fetchProducts();
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Package size={28} color="var(--accent-primary)" />
                        Gestor de Catálogo ERP
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.5 }}>
                        Administra todos tus productos, variantes e imágenes directamente en el sistema nativo. Los cambios se reflejarán instantáneamente en el portal público.
                    </p>
                </div>

                <button
                    onClick={() => { setCurrentProduct({ id: 'NEW', status: 'active' }); setIsEditing(true); }}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
                    <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por SKU o Nombre..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', paddingLeft: '2.5rem' }}
                    />
                </div>
            </div>

            {loading && products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader2 size={40} className="spin" color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Cargando catálogo...</p>
                </div>
            ) : (
                <div className="glass-panel" style={{ background: 'white', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CÓDIGO (SKU)</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PRODUCTO</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CATEGORÍA</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>STOCK TOTAL</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{p.id}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                                                {p.tag && <><Tag size={12} color="var(--accent-primary)" /> {p.tag}</>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.category}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                            <span style={{
                                                background: p.stock > (p.min_stock || 10) ? 'rgba(22,163,74,0.1)' : 'rgba(217,119,6,0.1)',
                                                color: p.stock > (p.min_stock || 10) ? 'var(--accent-success)' : 'var(--accent-warning)',
                                                padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem'
                                            }}>
                                                {p.stock} pzs
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} style={{ padding: '0.4rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '0.5rem' }} title="Editar">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} style={{ padding: '0.4rem', background: 'transparent', border: 'none', color: 'var(--accent-error)', cursor: 'pointer', opacity: 0.7 }} title="Eliminar">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit / Create Modal */}
            {isEditing && currentProduct && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-panel" style={{ background: 'white', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {currentProduct.id === 'NEW' ? <Plus size={20} /> : <Edit3 size={20} />}
                                {currentProduct.id === 'NEW' ? 'Crear Nuevo Producto' : `Editar ${currentProduct.id}`}
                            </h2>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Nombre del Producto *</label>
                                    <input required type="text" className="input-field" style={{ width: '100%' }} value={currentProduct.name || ''} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} placeholder="Ej. Lote Amazon Premium" />
                                </div>

                                <div>
                                    <label style={labelStyle}>Descripción</label>
                                    <textarea className="input-field" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} value={currentProduct.description || ''} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} placeholder="Describe detalladamente el producto..." />
                                </div>

                                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>Categoría</label>
                                        <input type="text" className="input-field" style={{ width: '100%' }} value={currentProduct.category || ''} onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })} placeholder="Ej. BOLSAS" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Etiqueta Promocional</label>
                                        <input type="text" className="input-field" style={{ width: '100%' }} value={currentProduct.tag || ''} onChange={e => setCurrentProduct({ ...currentProduct, tag: e.target.value })} placeholder="Ej. Top Ventas" />
                                    </div>
                                </div>

                                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}>Stock Físico</label>
                                        <input type="number" className="input-field" style={{ width: '100%' }} value={currentProduct.stock || 0} onChange={e => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) || 0 })} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Alerta de Stock Mínimo</label>
                                        <input type="number" className="input-field" style={{ width: '100%' }} value={currentProduct.min_stock || 0} onChange={e => setCurrentProduct({ ...currentProduct, min_stock: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </div>

                                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <p style={{ margin: 0 }}><strong>Nota:</strong> Los precios por volumen y las variantes (sabores/tallas) se configuran en el menú de Inventario Avanzado una vez creado el producto principal.</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />} Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' };

import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Edit, MoreVertical, Plus, CheckCircle2, XCircle, TrendingDown, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

    // Chart Data calculations
    const lowStockCount = products.filter(p => p.stock <= p.min_stock).length;

    // Process categories for Pie Chart
    const categoryDataMap: Record<string, number> = {};
    products.forEach(p => {
        categoryDataMap[p.category] = (categoryDataMap[p.category] || 0) + p.stock;
    });
    const categoryData = Object.keys(categoryDataMap).map(key => ({
        name: key,
        value: categoryDataMap[key]
    })).filter(c => c.value > 0);

    const PIE_COLORS = ['#E63927', '#1A1A1A', '#4A4A4A', '#F4F4F4', '#ffc658'];

    // Process top products by stock for Bar Chart
    const stockData = [...products].sort((a, b) => b.stock - a.stock).slice(0, 5).map(p => ({
        name: p.name.substring(0, 15) + '...',
        stock: p.stock
    }));

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Cargando inventario de la nube...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '2rem', overflowX: 'hidden' }}>
            <div className="catalog-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>Reporte de Inventario</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Visualización de stock actual en la nube ERP.</p>
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

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Global Stock Stats */}
                <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(230,57,39,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Artículos Físicos</p>
                            <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                                {products.reduce((acc, p) => acc + p.stock, 0).toLocaleString()}
                            </h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: lowStockCount > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(22,163,74,0.1)', color: lowStockCount > 0 ? 'var(--accent-warning)' : 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Alertas de Bajo Inventario</p>
                            <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                                {lowStockCount} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>SKUs afectados</span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Stock by Category - PieChart */}
                <div className="glass-panel" style={{ background: 'white', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 1rem' }}>Distribución por Categoría</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%" cy="50%"
                                    innerRadius={50} outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => [`${value} unidades`, 'Stock']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Stocked Items - BarChart */}
                <div className="glass-panel" style={{ background: 'white', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 1rem' }}>Top 5 SKUs (Volumen Físico)</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(230,57,39,0.05)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="stock" fill="var(--text-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
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

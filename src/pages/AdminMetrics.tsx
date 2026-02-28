import { TrendingUp, PackageSearch, Users, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockChartData = [
    { name: 'Lun', revenue: 4000, profit: 2400 },
    { name: 'Mar', revenue: 5200, profit: 3100 },
    { name: 'Mié', revenue: 4800, profit: 2800 },
    { name: 'Jue', revenue: 6100, profit: 3800 },
    { name: 'Vie', revenue: 7500, profit: 4500 },
    { name: 'Sáb', revenue: 3200, profit: 1900 },
    { name: 'Dom', revenue: 4100, profit: 2500 },
];

export default function AdminMetrics() {
    const stats = [
        { title: 'Ventas de Hoy', value: '$45,231', icon: DollarSign, color: '#E63927', change: '+12.5%' },
        { title: 'Clientes Activos', value: '124', icon: Users, color: '#16a34a', change: '+4.2%' },
        { title: 'Pedidos Pendientes', value: '12', icon: PackageSearch, color: '#d97706', change: '-2' },
        { title: 'Rentabilidad', value: '32%', icon: TrendingUp, color: '#E63927', change: '+1.5%' },
    ];

    return (
        <div style={{ paddingBottom: '2rem', overflowX: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h2 style={{ color: 'var(--text-primary)' }}>Dashboard de Ventas</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Métricas de negocio actualizadas en tiempo real.</p>
                </div>
                <button className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>Exportar Reporte</button>
            </div>

            {/* KPI Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((s, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '1.25rem', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: '500' }}>{s.title}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{s.value}</h3>
                            </div>
                            <div style={{ background: `${s.color}12`, padding: '0.6rem', borderRadius: '10px', color: s.color }}>
                                <s.icon size={20} />
                            </div>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span style={{ color: s.change.startsWith('+') ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '0.8rem', fontWeight: '600' }}>
                                {s.change}
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>vs mes pasado</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                {/* Main Chart */}
                <div className="glass-panel chart-container" style={{ padding: '1.5rem', background: 'white' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Ingresos vs Rentabilidad (7 días)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E63927" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#E63927" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4A4A4A', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4A4A4A', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#E63927" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos ($)" />
                                <Area type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Rentabilidad ($)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Info */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'white' }}>
                    <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Productos más vendidos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                        {[
                            { name: 'Paletas Amazon Mixtas', units: 14, revenue: '$133,000' },
                            { name: 'Lotes Ropa Target', units: 32, revenue: '$496,000' },
                            { name: 'Kits Maquillaje', units: 156, revenue: '$49,920' },
                            { name: 'Lotes Juguetes Disney', units: 45, revenue: '$184,500' },
                        ].map((p, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.15rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.units} unidades</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: '600', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{p.revenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-secondary" style={{ width: '100%', marginTop: '0.75rem' }}>Ver Reporte Completo</button>
                </div>
            </div>
        </div>
    );
}

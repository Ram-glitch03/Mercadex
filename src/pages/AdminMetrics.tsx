import { TrendingUp, PackageSearch, Users, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockChartData = [
    { name: 'Lun', revenue: 4000, profit: 2400 },
    { name: 'Mar', revenue: 5200, profit: 3100 },
    { name: 'Mie', revenue: 4800, profit: 2800 },
    { name: 'Jue', revenue: 6100, profit: 3800 },
    { name: 'Vie', revenue: 7500, profit: 4500 },
    { name: 'Sab', revenue: 3200, profit: 1900 },
    { name: 'Dom', revenue: 4100, profit: 2500 },
];

export default function AdminMetrics() {
    const stats = [
        { title: 'Ventas de Hoy', value: '$45,231.00', icon: DollarSign, color: '#3b82f6', change: '+12.5%' },
        { title: 'Clientes Activos', value: '124', icon: Users, color: '#6366f1', change: '+4.2%' },
        { title: 'Pedidos Pendientes', value: '12', icon: PackageSearch, color: '#f59e0b', change: '-2' },
        { title: 'Rentabilidad Promedio', value: '32%', icon: TrendingUp, color: '#10b981', change: '+1.5%' },
    ];

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 className="text-gradient">Dashboard de Ventas</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Métricas en tiempo real sincronizadas desde ASPEL SAE</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-secondary">Exportar Reporte</button>
                </div>
            </div>

            {/* KPI Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map((s, i) => (
                    <div key={i} className="glass-panel interactive" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: s.color, filter: 'blur(50px)', opacity: 0.15, borderRadius: '50%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{s.title}</p>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>{s.value}</h3>
                            </div>
                            <div style={{ background: `${s.color}20`, padding: '0.75rem', borderRadius: '12px', color: s.color }}>
                                <s.icon size={22} />
                            </div>
                        </div>
                        <div>
                            <span style={{ color: s.change.startsWith('+') ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '0.85rem', fontWeight: '600' }}>
                                {s.change}
                            </span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>vs mes pasado</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Main Chart */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>Ingresos vs Rentabilidad (7 días)</h3>
                    <div style={{ height: '350px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-success)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--accent-success)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos ($)" />
                                <Area type="monotone" dataKey="profit" stroke="var(--accent-success)" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Rentabilidad ($)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Info */}
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Productos más vendidos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        {[
                            { name: 'Paletas Amazon Mixtas', units: 14, revenue: '$133,000' },
                            { name: 'Lotes Ropa Target', units: 32, revenue: '$496,000' },
                            { name: 'Kits Maquillaje', units: 156, revenue: '$49,920' },
                            { name: 'Lotes Juguetes Disney', units: 45, revenue: '$184,500' },
                        ].map((p, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{p.name}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.units} unidades</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{p.revenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Ver Reporte Completo</button>
                </div>
            </div>
        </div>
    );
}

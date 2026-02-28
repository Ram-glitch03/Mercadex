import { supabase } from '../lib/supabase';
import type { ProductWithTiers, Product, PriceTier, ProductVariant, Order, DashboardMetrics, TopProduct, RevenueDataPoint } from '../types/database';

// ─── Mock Data (used when Supabase is not configured) ──────────────────────────

const MOCK_PRODUCTS: ProductWithTiers[] = [
    {
        id: 'MERC-001', name: 'Alo Leggins', description: 'Tallas S, M y L. Colores: Negro, Café, Navy, Gris, Durazno',
        category: 'ALO ROPA', stock: 150, min_stock: 20, tag: 'Top Ventas', status: 'active', last_sync: 'Hace 2 min',
        image: '/images/leggings.png',
        created_at: '', updated_at: '',
        tiers: [
            { id: 't1', product_id: 'MERC-001', tier_level: 1, label: '1-4 pzs', price: 1050, threshold: 1 },
            { id: 't2', product_id: 'MERC-001', tier_level: 2, label: '+5 pzs', price: 920, threshold: 5 },
            { id: 't3', product_id: 'MERC-001', tier_level: 3, label: '+20 pzs', price: 810, threshold: 20 },
            { id: 't4', product_id: 'MERC-001', tier_level: 4, label: '+30 pzs', price: 765, threshold: 30 },
        ],
        variants: [
            { id: 'v1', product_id: 'MERC-001', label: 'Talla S - Negro' },
            { id: 'v2', product_id: 'MERC-001', label: 'Talla M - Negro' },
            { id: 'v3', product_id: 'MERC-001', label: 'Talla L - Negro' },
            { id: 'v4', product_id: 'MERC-001', label: 'Talla S - Navy' },
            { id: 'v5', product_id: 'MERC-001', label: 'Talla M - Navy' },
            { id: 'v6', product_id: 'MERC-001', label: 'Talla L - Navy' },
            { id: 'v7', product_id: 'MERC-001', label: 'Talla M - Durazno' }
        ]
    },
    {
        id: 'MERC-002', name: 'Hover-1 Board (Patineta)', description: 'Patineta Hoverboard Color, Negro y Rojo',
        category: 'HOVER BOARD', stock: 45, min_stock: 10, tag: null, status: 'active', last_sync: 'Hace 2 min',
        image: '/images/hoverboard.png',
        created_at: '', updated_at: '',
        tiers: [
            { id: 't5', product_id: 'MERC-002', tier_level: 1, label: '1-4 pzs', price: 1530, threshold: 1 },
            { id: 't6', product_id: 'MERC-002', tier_level: 2, label: '+5 pzs', price: 1430, threshold: 5 },
            { id: 't7', product_id: 'MERC-002', tier_level: 3, label: '+20 pzs', price: 1250, threshold: 20 },
            { id: 't8', product_id: 'MERC-002', tier_level: 4, label: '+30 pzs', price: 1180, threshold: 30 },
        ]
    },
    {
        id: 'MERC-003', name: 'Set Pijama Conjunto (2pzs)', description: '2 Conjuntos por Set, 2-3 Todler (Etiqueta con Marca)',
        category: 'PIJAMA NIÑO', stock: 200, min_stock: 50, tag: 'No Acumulable', status: 'active', last_sync: 'Hace 5 min',
        image: '/images/pajamas.png',
        created_at: '', updated_at: '',
        tiers: [
            { id: 't9', product_id: 'MERC-003', tier_level: 1, label: '1-9 sets', price: 99, threshold: 1 },
            { id: 't10', product_id: 'MERC-003', tier_level: 2, label: '+10 sets', price: 90, threshold: 10 },
            { id: 't11', product_id: 'MERC-003', tier_level: 3, label: '+50 sets', price: 85, threshold: 50 },
            { id: 't12', product_id: 'MERC-003', tier_level: 4, label: '+100 sets', price: 79, threshold: 100 },
        ]
    },
    {
        id: 'MERC-004', name: 'Pack Amazon Emprendedor (10 Pzs)', description: 'Productos de Amazon 10 Pzs por Caja',
        category: 'AMAZON PAQUETES', stock: 24, min_stock: 5, tag: null, status: 'warning', last_sync: 'Hace 12 min',
        image: '/images/amazon_box.png',
        created_at: '', updated_at: '',
        tiers: [
            { id: 't13', product_id: 'MERC-004', tier_level: 1, label: '1-2 cajas', price: 760, threshold: 1 },
            { id: 't14', product_id: 'MERC-004', tier_level: 2, label: '+3 cajas', price: 700, threshold: 3 },
            { id: 't15', product_id: 'MERC-004', tier_level: 3, label: '+10 cajas', price: 620, threshold: 10 },
            { id: 't16', product_id: 'MERC-004', tier_level: 4, label: '+20 cajas', price: 590, threshold: 20 },
        ]
    },
    {
        id: 'MERC-005', name: 'Pack Maquillaje Revolution (69Pzs)', description: 'Surtido variado: Bases, correctores, labiales, gloss, sombras y más',
        category: 'MAQUILLAJE', stock: 12, min_stock: 15, tag: 'Premium', status: 'warning', last_sync: 'Hace 1 hr',
        image: '/images/makeup.png',
        created_at: '', updated_at: '',
        tiers: [
            { id: 't17', product_id: 'MERC-005', tier_level: 1, label: '1 caja', price: 4200, threshold: 1 },
            { id: 't18', product_id: 'MERC-005', tier_level: 2, label: '+2 cajas', price: 3950, threshold: 2 },
            { id: 't19', product_id: 'MERC-005', tier_level: 3, label: '+4 cajas', price: 3450, threshold: 4 },
            { id: 't20', product_id: 'MERC-005', tier_level: 4, label: '+8 cajas', price: 3270, threshold: 8 },
        ]
    },
    {
        id: 'MERC-006', name: 'Ropa Target Mujer', description: 'Vestidos, playeras, pants con etiqueta de marca. Todas las tallas',
        category: 'ROPA TARGET', stock: 500, min_stock: 100, tag: 'No Acumulable', status: 'active', last_sync: 'Hace 2 min',
        image: '/images/target_clothes.png',
        created_at: '', updated_at: '',
        tiers: [
            { id: 't21', product_id: 'MERC-006', tier_level: 1, label: '1-9 pzs', price: 110, threshold: 1 },
            { id: 't22', product_id: 'MERC-006', tier_level: 2, label: '+10 pzs', price: 80, threshold: 10 },
            { id: 't23', product_id: 'MERC-006', tier_level: 3, label: '+50 pzs', price: 65, threshold: 50 },
            { id: 't24', product_id: 'MERC-006', tier_level: 4, label: '+100 pzs', price: 55, threshold: 100 },
        ],
        variants: [
            { id: 'v8', product_id: 'MERC-006', label: 'Mixto P/M/G (Sin especificar)' }
        ]
    },
    {
        id: 'MERC-007', name: 'Lote Bolsas Lululemon', description: 'Bolsas deportivas importadas, varios modelos',
        category: 'BOLSAS', stock: 0, min_stock: 10, tag: null, status: 'error', last_sync: 'Hace 1 día',
        image: null, created_at: '', updated_at: '',
        tiers: [
            { id: 't25', product_id: 'MERC-007', tier_level: 1, label: '1-4 pzs', price: 450, threshold: 1 },
            { id: 't26', product_id: 'MERC-007', tier_level: 2, label: '+5 pzs', price: 400, threshold: 5 },
            { id: 't27', product_id: 'MERC-007', tier_level: 3, label: '+15 pzs', price: 350, threshold: 15 },
            { id: 't28', product_id: 'MERC-007', tier_level: 4, label: '+30 pzs', price: 320, threshold: 30 },
        ]
    },
];

const MOCK_METRICS: DashboardMetrics = {
    sales_today: 45231, sales_change: 12.5,
    active_clients: 124, clients_change: 4.2,
    pending_orders: 12, orders_change: -2,
    profitability: 32, profitability_change: 1.5,
};

const MOCK_TOP_PRODUCTS: TopProduct[] = [
    { name: 'Paletas Amazon Mixtas', units_sold: 14, revenue: 133000 },
    { name: 'Lotes Ropa Target', units_sold: 32, revenue: 496000 },
    { name: 'Kits Maquillaje', units_sold: 156, revenue: 49920 },
    { name: 'Lotes Juguetes Disney', units_sold: 45, revenue: 184500 },
];

const MOCK_REVENUE: RevenueDataPoint[] = [
    { day: 'Lun', ingresos: 4200, costos: 2100 },
    { day: 'Mar', ingresos: 4800, costos: 2300 },
    { day: 'Mie', ingresos: 5100, costos: 2500 },
    { day: 'Jue', ingresos: 6200, costos: 2800 },
    { day: 'Vie', ingresos: 7500, costos: 3100 },
    { day: 'Sab', ingresos: 8200, costos: 3400 },
    { day: 'Dom', ingresos: 6800, costos: 2900 },
];

// ─── Helper: check if Supabase is configured ───────────────────────────────────

function isSupabaseConfigured(): boolean {
    return supabase !== null;
}

// ─── Products API ──────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ProductWithTiers[]> {
    if (!isSupabaseConfigured()) return MOCK_PRODUCTS;

    const { data: products, error } = await supabase!
        .from('products')
        .select('*')
        .order('id');

    if (error) {
        console.error('Error fetching products:', error);
        return MOCK_PRODUCTS;
    }

    const { data: tiers } = await supabase!
        .from('price_tiers')
        .select('*')
        .order('tier_level');

    // Fetch variants
    const { data: variants } = await supabase!
        .from('product_variants')
        .select('*');

    return (products || []).map((p: Product) => {
        const productVariants = (variants || []).filter((v: ProductVariant) => v.product_id === p.id);
        return {
            ...p,
            tiers: (tiers || []).filter((t: PriceTier) => t.product_id === p.id),
            variants: productVariants.length > 0 ? productVariants : undefined
        };
    });
}

export async function getProductById(id: string): Promise<ProductWithTiers | null> {
    if (!isSupabaseConfigured()) {
        return MOCK_PRODUCTS.find(p => p.id === id) || null;
    }

    const { data: product, error } = await supabase!
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) return MOCK_PRODUCTS.find(p => p.id === id) || null;

    const { data: tiers } = await supabase!
        .from('price_tiers')
        .select('*')
        .eq('product_id', id)
        .order('tier_level');

    const { data: variants } = await supabase!
        .from('product_variants')
        .select('*')
        .eq('product_id', id);

    return {
        ...product,
        tiers: tiers || [],
        variants: variants && variants.length > 0 ? variants : undefined
    };
}

// ─── Inventory API (Admin) ─────────────────────────────────────────────────────

export async function updateProductStock(id: string, newStock: number): Promise<boolean> {
    if (!isSupabaseConfigured()) return true; // mock success

    const { error } = await supabase!
        .from('products')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', id);

    return !error;
}

// ─── Dashboard Metrics API ─────────────────────────────────────────────────────

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!isSupabaseConfigured()) return MOCK_METRICS;

    // In production, this would query a metrics view or aggregated table
    const { data, error } = await supabase!
        .from('dashboard_metrics')
        .select('*')
        .single();

    return error ? MOCK_METRICS : (data as DashboardMetrics);
}

export async function getTopProducts(): Promise<TopProduct[]> {
    if (!isSupabaseConfigured()) return MOCK_TOP_PRODUCTS;

    const { data, error } = await supabase!
        .from('top_products_view')
        .select('*')
        .limit(5);

    return error ? MOCK_TOP_PRODUCTS : (data as TopProduct[]);
}

export async function getRevenueData(): Promise<RevenueDataPoint[]> {
    if (!isSupabaseConfigured()) return MOCK_REVENUE;

    const { data, error } = await supabase!
        .from('revenue_daily')
        .select('*')
        .order('day')
        .limit(7);

    return error ? MOCK_REVENUE : (data as RevenueDataPoint[]);
}

// ─── Orders API ────────────────────────────────────────────────────────────────

export async function createOrder(items: { product_id: string; quantity: number; unit_price: number }[]): Promise<string | null> {
    if (!isSupabaseConfigured()) {
        // Mock: return a fake order ID
        return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

    const { data: order, error } = await supabase!
        .from('orders')
        .insert({ client_id: 'CLI-001', status: 'pending', total })
        .select()
        .single();

    if (error || !order) return null;

    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
    }));

    await supabase!.from('order_items').insert(orderItems);

    return order.id;
}

export async function getOrders(): Promise<Order[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase!
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

    return error ? [] : (data as Order[]);
}

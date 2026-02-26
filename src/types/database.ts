// Database types matching the Supabase schema for the Mercadex Portal

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    stock: number;
    min_stock: number;
    image: string | null;
    tag: string | null;
    status: 'active' | 'warning' | 'error';
    last_sync: string;
    created_at: string;
    updated_at: string;
}

export interface PriceTier {
    id: string;
    product_id: string;
    tier_level: number;
    label: string;        // e.g. "1-4 pzs"
    price: number;
    threshold: number;    // minimum qty to unlock this tier
}

export interface ProductWithTiers extends Product {
    tiers: PriceTier[];
}

export interface Order {
    id: string;
    client_id: string;
    client_name: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    tier_applied: number;
    subtotal: number;
}

export interface DashboardMetrics {
    sales_today: number;
    sales_change: number;
    active_clients: number;
    clients_change: number;
    pending_orders: number;
    orders_change: number;
    profitability: number;
    profitability_change: number;
}

export interface TopProduct {
    name: string;
    units_sold: number;
    revenue: number;
}

export interface RevenueDataPoint {
    day: string;
    ingresos: number;
    costos: number;
}

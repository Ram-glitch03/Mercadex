import postgres from 'postgres';

const connectionString = "postgres://postgres.easgnumdjyehpdcikqrn:zaAYCVgcJO3KOZeJ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

async function main() {
    console.log("Connecting to Supabase to update schema...");
    const sql = postgres(connectionString, { ssl: 'require' });

    try {
        console.log("Dropping old simple tables to recreate full versions...");
        await sql`DROP TABLE IF EXISTS order_items CASCADE;`;
        await sql`DROP TABLE IF EXISTS orders CASCADE;`;
        await sql`DROP TABLE IF EXISTS customers CASCADE;`;
        await sql`DROP TABLE IF EXISTS price_tiers CASCADE;`;
        await sql`DROP TABLE IF EXISTS product_variants CASCADE;`;
        await sql`DROP TABLE IF EXISTS inventory_logs CASCADE;`;
        await sql`DROP TABLE IF EXISTS inventory_levels CASCADE;`;
        await sql`DROP TABLE IF EXISTS products CASCADE;`;
        await sql`DROP TABLE IF EXISTS dashboard_metrics CASCADE;`;
        await sql`DROP TABLE IF EXISTS top_products_view CASCADE;`;
        await sql`DROP TABLE IF EXISTS revenue_daily CASCADE;`;
        await sql`DROP TABLE IF EXISTS metrics_log CASCADE;`;

        console.log("Creating tables...");
        await sql`
            CREATE TABLE products (
                id VARCHAR(100) PRIMARY KEY, -- Using VARCHAR as id to match MERC-001 format
                name VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                stock INT DEFAULT 0,
                min_stock INT DEFAULT 0,
                tag VARCHAR(100),
                status VARCHAR(50),
                last_sync VARCHAR(50),
                image TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await sql`
            CREATE TABLE price_tiers (
                id VARCHAR(100) PRIMARY KEY,
                product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
                tier_level INT NOT NULL,
                label VARCHAR(100),
                price DECIMAL(10, 2) NOT NULL,
                threshold INT NOT NULL
            );
        `;

        await sql`
            CREATE TABLE product_variants (
                id VARCHAR(100) PRIMARY KEY,
                product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
                label VARCHAR(255) NOT NULL
            );
        `;

        await sql`
            CREATE TABLE inventory_logs (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
                variant_id VARCHAR(100) REFERENCES product_variants(id) ON DELETE SET NULL,
                movement_type VARCHAR(50) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT'
                quantity INT NOT NULL,
                reason VARCHAR(255),
                created_by VARCHAR(100) DEFAULT 'admin',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await sql`
            CREATE TABLE dashboard_metrics (
                id INT PRIMARY KEY DEFAULT 1,
                sales_today DECIMAL(15, 2),
                sales_change DECIMAL(5, 2),
                active_clients INT,
                clients_change DECIMAL(5, 2),
                pending_orders INT,
                orders_change DECIMAL(5, 2),
                profitability DECIMAL(5, 2),
                profitability_change DECIMAL(5, 2)
            );
        `;

        await sql`
            CREATE TABLE top_products_view (
                name VARCHAR(255) PRIMARY KEY,
                units_sold INT,
                revenue DECIMAL(15, 2)
            );
        `;

        await sql`
            CREATE TABLE revenue_daily (
                day VARCHAR(10) PRIMARY KEY,
                ingresos DECIMAL(15, 2),
                costos DECIMAL(15, 2)
            );
        `;

        await sql`
            CREATE TABLE customers (
              id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
              sae_client_id VARCHAR(100) UNIQUE,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await sql`
            CREATE TABLE orders (
              id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
              client_id VARCHAR(100),
              total DECIMAL(10, 2) NOT NULL,
              status VARCHAR(50) DEFAULT 'pending',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await sql`
            CREATE TABLE order_items (
              id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
              order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
              product_id VARCHAR(100) REFERENCES products(id),
              quantity INT NOT NULL,
              unit_price DECIMAL(10, 2) NOT NULL,
              subtotal DECIMAL(10, 2) NOT NULL
            );
        `;

        console.log("Schema updated. Now inserting mock products...");

        // Seeding Products
        await sql`
            INSERT INTO products (id, name, description, category, stock, min_stock, tag, status, last_sync, image)
            VALUES 
            ('MERC-001', 'Alo Leggins', 'Tallas S, M y L. Colores: Negro, Café, Navy, Gris, Durazno', 'ALO ROPA', 150, 20, 'Top Ventas', 'active', 'Hace 2 min', '/images/leggings.png'),
            ('MERC-002', 'Hover-1 Board (Patineta)', 'Patineta Hoverboard Color, Negro y Rojo', 'HOVER BOARD', 45, 10, null, 'active', 'Hace 2 min', '/images/hoverboard.png'),
            ('MERC-003', 'Set Pijama Conjunto (2pzs)', '2 Conjuntos por Set, 2-3 Todler (Etiqueta con Marca)', 'PIJAMA NIÑO', 200, 50, 'No Acumulable', 'active', 'Hace 5 min', '/images/pajamas.png'),
            ('MERC-004', 'Pack Amazon Emprendedor (10 Pzs)', 'Productos de Amazon 10 Pzs por Caja', 'AMAZON PAQUETES', 24, 5, null, 'warning', 'Hace 12 min', '/images/amazon_box.png'),
            ('MERC-005', 'Pack Maquillaje Revolution (69Pzs)', 'Surtido variado: Bases, correctores, labiales, gloss, sombras y más', 'MAQUILLAJE', 12, 15, 'Premium', 'warning', 'Hace 1 hr', '/images/makeup.png'),
            ('MERC-006', 'Ropa Target Mujer', 'Vestidos, playeras, pants con etiqueta de marca. Todas las tallas', 'ROPA TARGET', 500, 100, 'No Acumulable', 'active', 'Hace 2 min', '/images/target_clothes.png')
            ON CONFLICT (id) DO NOTHING;
        `;

        // Seeding Tiers
        await sql`
            INSERT INTO price_tiers (id, product_id, tier_level, label, price, threshold)
            VALUES 
            ('t1', 'MERC-001', 1, '1-4 pzs', 1050, 1),
            ('t2', 'MERC-001', 2, '+5 pzs', 920, 5),
            ('t3', 'MERC-001', 3, '+20 pzs', 810, 20),
            ('t4', 'MERC-001', 4, '+30 pzs', 765, 30),
            
            ('t5', 'MERC-002', 1, '1-4 pzs', 1530, 1),
            ('t6', 'MERC-002', 2, '+5 pzs', 1430, 5),
            ('t7', 'MERC-002', 3, '+20 pzs', 1250, 20),
            ('t8', 'MERC-002', 4, '+30 pzs', 1180, 30),
            
            ('t9', 'MERC-003', 1, '1-9 sets', 99, 1),
            ('t10', 'MERC-003', 2, '+10 sets', 90, 10),
            ('t11', 'MERC-003', 3, '+50 sets', 85, 50),
            ('t12', 'MERC-003', 4, '+100 sets', 79, 100),
            
            ('t13', 'MERC-004', 1, '1-2 cajas', 760, 1),
            ('t14', 'MERC-004', 2, '+3 cajas', 700, 3),
            ('t15', 'MERC-004', 3, '+10 cajas', 620, 10),
            ('t16', 'MERC-004', 4, '+20 cajas', 590, 20),
            
            ('t17', 'MERC-005', 1, '1 caja', 4200, 1),
            ('t18', 'MERC-005', 2, '+2 cajas', 3950, 2),
            ('t19', 'MERC-005', 3, '+4 cajas', 3450, 4),
            ('t20', 'MERC-005', 4, '+8 cajas', 3270, 8),
            
            ('t21', 'MERC-006', 1, '1-9 pzs', 110, 1),
            ('t22', 'MERC-006', 2, '+10 pzs', 80, 10),
            ('t23', 'MERC-006', 3, '+50 pzs', 65, 50),
            ('t24', 'MERC-006', 4, '+100 pzs', 55, 100)
            ON CONFLICT (id) DO NOTHING;
        `;

        // Seeding Variants
        await sql`
            INSERT INTO product_variants (id, product_id, label)
            VALUES 
            ('v1', 'MERC-001', 'Talla S - Negro'),
            ('v2', 'MERC-001', 'Talla M - Negro'),
            ('v3', 'MERC-001', 'Talla L - Negro'),
            ('v4', 'MERC-001', 'Talla S - Navy'),
            ('v5', 'MERC-001', 'Talla M - Navy'),
            ('v6', 'MERC-001', 'Talla L - Navy'),
            ('v7', 'MERC-001', 'Talla M - Durazno'),
            ('v8', 'MERC-006', 'Mixto P/M/G (Sin especificar)')
            ON CONFLICT (id) DO NOTHING;
        `;

        // Seeding Metrics
        await sql`
            INSERT INTO dashboard_metrics (id, sales_today, sales_change, active_clients, clients_change, pending_orders, orders_change, profitability, profitability_change)
            VALUES (1, 45231, 12.5, 124, 4.2, 12, -2, 32, 1.5)
            ON CONFLICT (id) DO UPDATE SET sales_today = EXCLUDED.sales_today;
        `;

        await sql`
            INSERT INTO top_products_view (name, units_sold, revenue)
            VALUES 
            ('Paletas Amazon Mixtas', 14, 133000),
            ('Lotes Ropa Target', 32, 496000),
            ('Kits Maquillaje', 156, 49920),
            ('Lotes Juguetes Disney', 45, 184500)
            ON CONFLICT (name) DO NOTHING;
        `;

        await sql`
            INSERT INTO revenue_daily (day, ingresos, costos)
            VALUES 
            ('Lun', 4200, 2100),
            ('Mar', 4800, 2300),
            ('Mie', 5100, 2500),
            ('Jue', 6200, 2800),
            ('Vie', 7500, 3100),
            ('Sab', 8200, 3400),
            ('Dom', 6800, 2900)
            ON CONFLICT (day) DO NOTHING;
        `;

        console.log("Database update and seeding complete!");
    } catch (err) {
        console.error("Error during migration:", err);
    } finally {
        await sql.end();
    }
}

main();

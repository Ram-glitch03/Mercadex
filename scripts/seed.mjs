import postgres from 'postgres';

const connectionString = "postgres://postgres.easgnumdjyehpdcikqrn:zaAYCVgcJO3KOZeJ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

async function main() {
    console.log("Connecting to Supabase to update schema...");
    const sql = postgres(connectionString, { ssl: 'require' });

    try {
        console.log("Schema already managed. Proceeding to insert mock products...");

        console.log("Schema updated. Now inserting mock products...");

        // Seeding Products
        await sql`
            INSERT INTO products (id, name, description, category, stock, min_stock, tag, status, last_sync, image)
            VALUES 
            ('MERC-001', 'Alo Leggins', 'Tallas S, M, L. Colores: Black, Espresso, Gray, Mushroom, Navy, Pink wild, Sweet pink', 'ALO ROPA', 250, 20, 'Top Ventas', 'active', 'Hace 2 min', '/images/leggings.png'),
            ('MERC-002', 'Hover-1 Board (Patineta)', 'Patineta Hoverboard Color, Negro y Rojo', 'HOVER BOARD', 45, 10, null, 'active', 'Hace 2 min', '/images/hoverboard.png'),
            ('MERC-003', 'Set Pijama Conjunto (2pzs)', '2 Conjuntos por Set, 2-3 Todler (Etiqueta con Marca)', 'PIJAMA NIÑO', 200, 50, 'No Acumulable', 'active', 'Hace 5 min', '/images/pajamas.png'),
            ('MERC-004', 'Pack Amazon Emprendedor (10 Pzs)', 'Productos de Amazon 10 Pzs por Caja', 'AMAZON PAQUETES', 24, 5, null, 'warning', 'Hace 12 min', '/images/amazon_box.png'),
            ('MERC-005', 'Pack Maquillaje Revolution (69Pzs)', 'Surtido variado: Bases, correctores, labiales, gloss, sombras y más', 'MAQUILLAJE', 12, 15, 'Premium', 'warning', 'Hace 1 hr', '/images/makeup.png'),
            ('MERC-006', 'Ropa Target Mujer', 'Vestidos, playeras, pants con etiqueta de marca. Todas las tallas', 'ROPA TARGET', 500, 100, 'No Acumulable', 'active', 'Hace 2 min', '/images/target_clothes.png'),
            ('MERC-008', 'Alo Short', 'Shorts deportivos Tallas S, M, L. Colores: Black, Espresso, Navy', 'ALO ROPA', 120, 15, 'Nuevo', 'active', 'Hace 5 min', '/images/leggings.png')
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
            ('t24', 'MERC-006', 4, '+100 pzs', 55, 100),
            
            ('t25', 'MERC-008', 1, '1-4 pzs', 850, 1),
            ('t26', 'MERC-008', 2, '+5 pzs', 760, 5),
            ('t27', 'MERC-008', 3, '+20 pzs', 680, 20),
            ('t28', 'MERC-008', 4, '+30 pzs', 590, 30)
            ON CONFLICT (id) DO NOTHING;
        `;

        // Seeding Variants
        await sql`
            INSERT INTO product_variants (id, product_id, label)
            VALUES 
            -- Alo Leggins Variants
            ('v_alo_leg_blk_s', 'MERC-001', 'Black - S'), ('v_alo_leg_blk_m', 'MERC-001', 'Black - M'), ('v_alo_leg_blk_l', 'MERC-001', 'Black - L'),
            ('v_alo_leg_esp_s', 'MERC-001', 'Espresso - S'), ('v_alo_leg_esp_m', 'MERC-001', 'Espresso - M'), ('v_alo_leg_esp_l', 'MERC-001', 'Espresso - L'),
            ('v_alo_leg_gry_m', 'MERC-001', 'Gray - M'), ('v_alo_leg_gry_l', 'MERC-001', 'Gray - L'),
            ('v_alo_leg_msh_s', 'MERC-001', 'Mushroom - S'), ('v_alo_leg_msh_m', 'MERC-001', 'Mushroom - M'), ('v_alo_leg_msh_l', 'MERC-001', 'Mushroom - L'),
            ('v_alo_leg_nvy_s', 'MERC-001', 'Navy - S'), ('v_alo_leg_nvy_m', 'MERC-001', 'Navy - M'), ('v_alo_leg_nvy_l', 'MERC-001', 'Navy - L'),
            ('v_alo_leg_pnk_s', 'MERC-001', 'Pink wild - S'), ('v_alo_leg_pnk_m', 'MERC-001', 'Pink wild - M'), ('v_alo_leg_pnk_l', 'MERC-001', 'Pink wild - L'),
            ('v_alo_leg_spnk_s', 'MERC-001', 'Sweet pink - S'), ('v_alo_leg_spnk_m', 'MERC-001', 'Sweet pink - M'), ('v_alo_leg_spnk_l', 'MERC-001', 'Sweet pink - L'),
            
            -- Alo Short Variants
            ('v_alo_shr_blk_s', 'MERC-008', 'Black - S'), ('v_alo_shr_blk_m', 'MERC-008', 'Black - M'), ('v_alo_shr_blk_l', 'MERC-008', 'Black - L'),
            ('v_alo_shr_esp_s', 'MERC-008', 'Espresso - S'), ('v_alo_shr_esp_m', 'MERC-008', 'Espresso - M'), ('v_alo_shr_esp_l', 'MERC-008', 'Espresso - L'),
            ('v_alo_shr_nvy_s', 'MERC-008', 'Navy - S'), ('v_alo_shr_nvy_m', 'MERC-008', 'Navy - M'), ('v_alo_shr_nvy_l', 'MERC-008', 'Navy - L'),

            -- Others
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
            INSERT INTO customers (id, name, email)
            VALUES 
            ('CLI-001', 'Mayorista Centro', 'centro@mayoristas.com'),
            ('CLI-002', 'Boutique Norte', 'contacto@boutiquenorte.com')
            ON CONFLICT (id) DO NOTHING;
        `;

        // Instead of inserting into a view, we insert orders
        await sql`
            INSERT INTO orders (id, client_id, total, status)
            VALUES 
            ('00000000-0000-0000-0000-000000000001', 'CLI-001', 133000, 'completed'),
            ('00000000-0000-0000-0000-000000000002', 'CLI-002', 496000, 'completed')
            ON CONFLICT (id) DO NOTHING;
        `;

        await sql`
            INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, subtotal)
            VALUES 
            ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MERC-004', 'Paletas Amazon Mixtas', 14, 9500, 133000),
            ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'MERC-006', 'Lotes Ropa Target', 32, 15500, 496000)
            ON CONFLICT (id) DO NOTHING;
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

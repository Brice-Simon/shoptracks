INSERT INTO items (id, name, price, category, quantity) VALUES
    ('SKU001', 'Fanta 500ml',       500,   'Beverages',   24),
    ('SKU002', 'Coca-Cola 500ml',   500,   'Beverages',   30),
    ('SKU003', 'Indomie Noodles',   300,   'Food',        48),
    ('SKU004', 'Bread Loaf',        1200,  'Food',        10),
    ('SKU005', 'USB Cable 1m',      2500,  'Electronics', 15),
    ('SKU006', 'Phone Charger',     4500,  'Electronics',  8),
    ('SKU007', 'Exercise Book',     400,   'Stationery',  60),
    ('SKU008', 'Ballpoint Pen',     150,   'Stationery', 100)
ON CONFLICT (id) DO NOTHING;


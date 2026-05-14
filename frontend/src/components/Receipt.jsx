import React from 'react';

const Receipt = ({ sale }) => {
    if (!sale) return null;

    return (
        <div style={styles.receipt}>
            <div style={styles.header}>
                <p style={styles.shopName}>ShopTrack</p>
                <p style={styles.meta}>
                    {new Date(sale.created_at).toLocaleString()}
                </p>
                <p style={styles.meta}>{sale.id}</p>
            </div>
            <div style={styles.items}>
                {sale.items.map((item) => (
                    <div key={item.id} style={styles.row}>
                        <span style={styles.itemName}>
                            {item.item_name} ×{item.quantity}
                        </span>
                        <span style={styles.itemTotal}>
                            {item.subtotal.toLocaleString()} RWF
                        </span>
                    </div>
                ))}
            </div>
            <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>
                    {sale.total.toLocaleString()} RWF
                </span>
            </div>
            <p style={styles.thanks}>Thank you!</p>
        </div>
    );
};

const styles = {
    receipt: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
        maxWidth: '320px',
        margin: '0 auto',
        fontFamily: 'monospace',
    },
    header: {
        textAlign: 'center',
        borderBottom: '1px dashed #475569',
        paddingBottom: '12px',
        marginBottom: '12px',
    },
    shopName: {
        fontSize: '16px',
        fontWeight: '700',
        margin: 0,
        color: '#f8fafc',
    },
    meta: { fontSize: '12px', color: '#94a3b8', margin: '2px 0' },
    items: { marginBottom: '12px' },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        padding: '3px 0',
        color: '#cbd5e1',
    },
    itemName: { flex: 1 },
    itemTotal: { fontWeight: '500' },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px dashed #475569',
        paddingTop: '10px',
        marginTop: '8px',
        fontSize: '15px',
        fontWeight: '700',
        color: '#f8fafc',
    },
    totalLabel: {},
    totalValue: {},
    thanks: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b',
        marginTop: '12px',
        marginBottom: 0,
    },
};

export default Receipt;
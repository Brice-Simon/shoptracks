import React from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingCart } from 'lucide-react';

const Cart = ({ onCheckout }) => {
    const { cart, removeFromCart, total } = useCart();

    if (cart.length === 0) {
        return (
            <div style={styles.empty}>
                <p>Cart is empty — scan an item to add it</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Cart</h3>
            <div style={styles.items}>
                {cart.map((item) => (
                    <div key={item.id} style={styles.row}>
                        <div style={styles.itemInfo}>
                            <p style={styles.itemName}>{item.name}</p>
                            <p style={styles.itemMeta}>
                                ×{item.quantity} @ {item.price.toLocaleString()} RWF
                            </p>
                        </div>
                        <div style={styles.itemRight}>
                            <p style={styles.itemTotal}>
                                {(item.price * item.quantity).toLocaleString()} RWF
                            </p>
                            <button
                                style={styles.removeBtn}
                                onClick={() => removeFromCart(item.id)}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={styles.footer}>
                <div style={styles.totalRow}>
                    <span style={styles.totalLabel}>Total</span>
                    <span style={styles.totalValue}>{total.toLocaleString()} RWF</span>
                </div>
                <button style={styles.checkoutBtn} onClick={onCheckout}>
                    <ShoppingCart size={16} style={{ marginRight: '6px' }} />
                    Checkout
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    empty: {
        padding: '24px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '13px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
    },
    title: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        margin: 0,
    },
    items: { padding: '8px 0' },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: '1px solid #f3f4f6',
    },
    itemInfo: { flex: 1 },
    itemName: { fontSize: '14px', fontWeight: '500', margin: 0, color: '#111827' },
    itemMeta: { fontSize: '12px', color: '#6b7280', margin: 0 },
    itemRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    itemTotal: { fontSize: '14px', fontWeight: '500', margin: 0, color: '#111827' },
    removeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#ef4444',
        fontSize: '14px',
        padding: '2px 6px',
        display: 'flex',
        alignItems: 'center',
    },
    footer: { padding: '12px 16px', borderTop: '1px solid #e5e7eb' },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
    },
    totalLabel: { fontSize: '15px', fontWeight: '600', color: '#111827' },
    totalValue: { fontSize: '15px', fontWeight: '600', color: '#111827' },
    checkoutBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#1d4ed8',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default Cart;
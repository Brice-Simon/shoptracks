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
        backgroundColor: '#1e293b', // Darker slate
        border: '1px solid #334155', // Subtle dark border
        borderRadius: '12px',
        overflow: 'hidden',
    },
    empty: {
        padding: '24px',
        textAlign: 'center',
        color: '#94a3b8', // Muted text
        fontSize: '13px',
        backgroundColor: '#1e293b', // Matches container
        border: '1px solid #334155',
        borderRadius: '12px',
    },
    title: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#94a3b8', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '12px 16px',
        borderBottom: '1px solid #334155',
        margin: 0,
    },
    items: { padding: '8px 0' },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: '1px solid #334155', // Darker separator
    },
    itemInfo: { flex: 1 },
    itemName: { fontSize: '14px', fontWeight: '500', margin: 0, color: '#f8fafc' },
    itemMeta: { fontSize: '12px', color: '#94a3b8', margin: 0 },
    itemRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    itemTotal: { fontSize: '14px', fontWeight: '500', margin: 0, color: '#f8fafc' },
    removeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#f87171', // Softer red for dark mode
        fontSize: '14px',
        padding: '2px 6px',
        display: 'flex',
        alignItems: 'center',
    },
    footer: { padding: '12px 16px', borderTop: '1px solid #334155' },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
    },
    totalLabel: { fontSize: '15px', fontWeight: '600', color: '#f8fafc' },
    totalValue: { fontSize: '15px', fontWeight: '600', color: '#60a5fa' }, // Blue accent
    checkoutBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#3b82f6', // Brighter blue for dark background
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
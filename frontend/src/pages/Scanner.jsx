import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import itemService from '../services/itemService';
import saleService from '../services/saleService';
import QRScanner from '../components/QRScanner';
import Cart from '../components/Cart';
import Receipt from '../components/Receipt';
import { Plus, PlusCircle } from 'lucide-react';

const Scanner = () => {
    const { cart, addToCart, clearCart, total } = useCart();
    const [scannedItem, setScannedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [receipt, setReceipt] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async (itemId) => {
        setError(null);
        try {
            const response = await itemService.getById(itemId);
            setScannedItem(response.data.data);
            setQuantity(1);
        } catch (err) {
            setError(`Item not found for QR code: ${itemId}`);
        }
    };

    const handleAddToCart = () => {
        if (!scannedItem) return;
        addToCart(scannedItem, quantity);
        setScannedItem(null);
        setQuantity(1);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            const response = await saleService.create({
                items: cart.map((item) => ({
                    item_id: item.id,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity,
                })),
            });
            setReceipt(response.data.data);
            clearCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Scan & Sell</h1>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.layout}>
                <div style={styles.left}>
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Scan item</h2>
                        <QRScanner onScanSuccess={handleScan} />
                        {scannedItem && (
                            <div style={styles.scannedResult}>
                                <div style={styles.scannedInfo}>
                                    <p style={styles.scannedName}>{scannedItem.name}</p>
                                    <p style={styles.scannedMeta}>
                                        {scannedItem.category} · {scannedItem.id}
                                    </p>
                                </div>
                                <p style={styles.scannedPrice}>
                                    {scannedItem.price.toLocaleString()} RWF
                                </p>
                                <div style={styles.qtyRow}>
                                    <label style={styles.label}>Qty:</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        min="1"
                                        max={scannedItem.quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        style={styles.qtyInput}
                                    />
                                    <button style={styles.addBtn} onClick={handleAddToCart}>
                                        <Plus size={14} style={{ marginRight: '4px' }} />
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <Cart onCheckout={handleCheckout} />
                        {loading && <p style={styles.loading}>Processing sale...</p>}
                    </div>
                </div>
                <div style={styles.right}>
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Receipt</h2>
                        {receipt ? (
                            <div>
                                <Receipt sale={receipt} />
                                <button
                                    style={styles.newSaleBtn}
                                    onClick={() => setReceipt(null)}
                                >
                                    <PlusCircle size={14} style={{ marginRight: '6px' }} />
                                    New Sale
                                </button>
                            </div>
                        ) : (
                            <p style={styles.placeholder}>
                                Receipt will appear after checkout
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        minHeight: '100%',
        backgroundColor: '#0f172a', // Dark base color
    },
    title: { fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#f8fafc' },
    layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    left: {},
    right: {},
    card: {
        backgroundColor: '#1e293b', // Darker card color
        border: '1px solid #334155', // Subtle dark border
        borderRadius: '12px',
        padding: '20px',
    },
    cardTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#94a3b8', // Muted gray
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '14px',
    },
    error: {
        backgroundColor: '#7f1d1d', // Dark red background
        color: '#fecaca', // Light red text
        padding: '10px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '12px',
    },
    scannedResult: {
        marginTop: '14px',
        padding: '12px',
        backgroundColor: '#334155', // Inner card contrast
        border: '1px solid #475569',
        borderRadius: '8px',
    },
    scannedInfo: { marginBottom: '6px' },
    scannedName: { fontSize: '15px', fontWeight: '600', margin: 0, color: '#f8fafc' },
    scannedMeta: { fontSize: '12px', color: '#94a3b8', margin: 0 },
    scannedPrice: { fontSize: '18px', fontWeight: '600', color: '#60a5fa', margin: '6px 0' },
    qtyRow: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' },
    label: { fontSize: '13px', color: '#94a3b8' },
    qtyInput: {
        width: '60px',
        padding: '6px 8px',
        fontSize: '13px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #475569',
        borderRadius: '6px',
    },
    addBtn: {
        padding: '7px 14px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
    },
    loading: { color: '#94a3b8', fontSize: '13px', textAlign: 'center', marginTop: '8px' },
    placeholder: { color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' },
    newSaleBtn: {
        width: '100%',
        marginTop: '14px',
        padding: '10px',
        backgroundColor: '#334155',
        border: '1px solid #475569',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default Scanner;
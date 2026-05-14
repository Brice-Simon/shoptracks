import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import itemService from '../services/itemService';
import { useStock } from '../context/StockContext';
import { PlusCircle, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Beverages', 'Food', 'Electronics', 'Clothing', 'Stationery', 'Other'];

const AddItem = () => {
    const { refreshItems } = useStock();
    const [form, setForm] = useState({ name: '', price: '', category: 'Beverages', quantity: '' });
    const [createdItem, setCreatedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await itemService.create({
                name: form.name,
                price: parseFloat(form.price),
                category: form.category,
                quantity: parseInt(form.quantity),
            });
            setCreatedItem(response.data.data);
            setForm({ name: '', price: '', category: 'Beverages', quantity: '' });
            refreshItems();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Add Item</h1>
            <div style={styles.layout}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Item details</h2>
                    {error && <p style={styles.error}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Item name</label>
                            <input
                                style={styles.input}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Fanta 500ml"
                                required
                            />
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Price (RWF)</label>
                                <input
                                    style={styles.input}
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="500"
                                    min="1"
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Quantity</label>
                                <input
                                    style={styles.input}
                                    name="quantity"
                                    type="number"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="10"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Category</label>
                            <select
                                style={styles.input}
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            style={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : (
                                <>
                                    <PlusCircle size={16} style={{ marginRight: '6px' }} />
                                    Add & Generate QR
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>QR preview</h2>
                    {createdItem ? (
                        <div style={styles.qrPreview}>
                            <div style={styles.qrBox}>
                                <QRCode value={createdItem.id} size={120} />
                            </div>
                            <p style={styles.qrId}>{createdItem.id}</p>
                            <p style={styles.qrName}>{createdItem.name}</p>
                            <p style={styles.qrPrice}>{createdItem.price.toLocaleString()} RWF</p>
                            <div style={styles.successMsg}>
                                <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
                                Item added — print this QR and attach it to the item
                            </div>
                        </div>
                    ) : (
                        <p style={styles.placeholder}>
                            Fill in item details and click Add to generate the QR code
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { 
        minHeight: '100vh', 
        backgroundColor: '#0f172a', 
        padding: '20px',
        color: '#f8fafc' 
    },
    title: { fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#f8fafc' },
    layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    card: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
    },
    cardTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '16px',
    },
    formGroup: { marginBottom: '14px' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    label: { display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' },
    input: {
        width: '100%',
        padding: '8px 10px',
        fontSize: '13px',
        border: '1px solid #334155',
        borderRadius: '8px',
        outline: 'none',
        boxSizing: 'border-box',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
    },
    submitBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        backgroundColor: 'rgba(220, 38, 38, 0.2)',
        color: '#f87171',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '12px',
    },
    qrPreview: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    qrBox: {
        padding: '12px',
        border: '1px solid #334155',
        borderRadius: '8px',
        backgroundColor: '#ffffff', // QR code must stay white for scanning
    },
    qrId: { fontSize: '11px', color: '#64748b', margin: 0 },
    qrName: { fontSize: '14px', fontWeight: '600', color: '#f8fafc', margin: 0 },
    qrPrice: { fontSize: '13px', color: '#60a5fa', margin: 0 },
    successMsg: {
        fontSize: '12px',
        color: '#4ade80',
        backgroundColor: 'rgba(22, 101, 52, 0.2)',
        padding: '8px 12px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: { color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' },
};

export default AddItem;
import React, { useEffect, useState } from 'react';
import { useStock } from '../context/StockContext';
import QRGenerator from '../components/QRGenerator';
import itemService from '../services/itemService';
import { QrCode, Edit, Trash2 } from 'lucide-react';

const Inventory = () => {
    const { items, fetchItems, loading } = useStock();
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editQuantity, setEditQuantity] = useState('');
    const [editPrice, setEditPrice] = useState('');

    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await itemService.delete(id);
            fetchItems();
            if (selectedItem?.id === id) setSelectedItem(null);
            if (editingItem?.id === id) setEditingItem(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const openQR = (item) => {
        setSelectedItem(item);
        setEditingItem(null);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setEditQuantity(item.quantity);
        setEditPrice(item.price);
        setSelectedItem(null);
    };

    const handleUpdateStock = async () => {
        if (!editingItem) return;
        try {
            await itemService.update(editingItem.id, {
                ...editingItem,
                quantity: parseInt(editQuantity, 10) || 0,
                price: parseFloat(editPrice) || 0,
            });
            fetchItems();
            setEditingItem(null);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return (
        <div style={styles.container}>
            <p style={styles.loading}>Loading...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Inventory</h1>
            <div style={styles.layout}>
                <div style={styles.tableCard}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {['SKU', 'Name', 'Category', 'Price (RWF)', 'Stock', 'Actions'].map((h) => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={styles.empty}>No items found</td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr
                                        key={item.id}
                                        style={{
                                            ...styles.row,
                                            backgroundColor:
                                                selectedItem?.id === item.id || editingItem?.id === item.id ? '#1e293b' : 'transparent',
                                        }}
                                    >
                                        <td style={styles.td}>
                                            <span style={styles.sku}>{item.id}</span>
                                        </td>
                                        <td style={{ ...styles.td, fontWeight: '500', color: '#f8fafc' }}>{item.name}</td>
                                        <td style={styles.td}>
                                            <span style={styles.categoryBadge}>{item.category}</span>
                                        </td>
                                        <td style={styles.td}>{item.price.toLocaleString()}</td>
                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    backgroundColor: item.quantity > 5 ? 'rgba(22, 101, 52, 0.2)' : 'rgba(133, 77, 14, 0.2)',
                                                    color: item.quantity > 5 ? '#4ade80' : '#facc15',
                                                    border: `1px solid ${item.quantity > 5 ? '#166534' : '#854d0e'}`
                                                }}
                                            >
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() => openQR(item)}
                                                    title="Show QR"
                                                >
                                                    <QrCode size={14} />
                                                </button>
                                                <button
                                                    style={styles.actionBtnEdit}
                                                    onClick={() => openEdit(item)}
                                                    title="Edit Stock"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    style={styles.actionBtnDelete}
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {selectedItem && (
                    <div style={styles.sidePanel}>
                        <div style={styles.editCard}>
                            <QRGenerator item={selectedItem} />
                            <button
                                style={styles.closeBtn}
                                onClick={() => setSelectedItem(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {editingItem && (
                    <div style={styles.sidePanel}>
                        <div style={styles.editCard}>
                            <h3 style={styles.editTitle}>Edit Item</h3>
                            <p style={styles.editName}>{editingItem.name}</p>
                            
                            <label style={styles.editLabel}>Quantity</label>
                            <input 
                                type="number" 
                                value={editQuantity} 
                                onChange={(e) => setEditQuantity(e.target.value)}
                                style={styles.editInput}
                                min="0"
                            />

                            <label style={styles.editLabel}>Price (RWF)</label>
                            <input 
                                type="number" 
                                value={editPrice} 
                                onChange={(e) => setEditPrice(e.target.value)}
                                style={styles.editInput}
                                min="0"
                            />
                            
                            <button style={styles.saveBtn} onClick={handleUpdateStock}>Save</button>
                            <button style={styles.closeBtn} onClick={() => setEditingItem(null)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    // container fix: ensures the dark background covers the full screen height
    container: { 
        minHeight: '100vh', 
        backgroundColor: '#0f172a', 
        padding: '20px',
        color: '#f8fafc'
    },
    title: { fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#f8fafc' },
    loading: { color: '#94a3b8', fontSize: '14px' },
    layout: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
    tableCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: {
        textAlign: 'left',
        padding: '10px 12px',
        borderBottom: '1px solid #334155',
        fontSize: '11px',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    td: { 
        padding: '10px 12px', 
        borderBottom: '1px solid #1e293b', 
        color: '#cbd5e1', 
        verticalAlign: 'middle' 
    },
    row: { cursor: 'pointer' },
    sku: { fontSize: '11px', color: '#64748b' },
    categoryBadge: {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '99px',
        fontSize: '11px',
        fontWeight: '500',
        backgroundColor: '#334155',
        color: '#e2e8f0',
    },
    badge: {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '99px',
        fontSize: '11px',
        fontWeight: '600',
    },
    empty: { textAlign: 'center', padding: '24px', color: '#64748b' },
    actionBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        backgroundColor: 'rgba(30, 64, 175, 0.2)',
        color: '#60a5fa',
        border: '1px solid #1e40af',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    actionBtnEdit: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        backgroundColor: 'rgba(146, 64, 14, 0.2)',
        color: '#fbbf24',
        border: '1px solid #92400e',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    actionBtnDelete: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        backgroundColor: 'rgba(153, 27, 27, 0.2)',
        color: '#f87171',
        border: '1px solid #991b1b',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    sidePanel: {
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    editCard: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
    },
    editTitle: { fontSize: '14px', fontWeight: '600', margin: '0 0 8px', color: '#f8fafc' },
    editName: { fontSize: '13px', color: '#94a3b8', margin: '0 0 12px' },
    editLabel: { fontSize: '12px', color: '#94a3b8', marginBottom: '4px' },
    editInput: {
        width: '100%',
        padding: '8px',
        fontSize: '13px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #334155',
        borderRadius: '6px',
        marginBottom: '12px',
        boxSizing: 'border-box',
    },
    saveBtn: {
        padding: '8px',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        marginBottom: '8px',
    },
    closeBtn: {
        padding: '8px',
        fontSize: '13px',
        backgroundColor: '#334155',
        border: '1px solid #475569',
        borderRadius: '6px',
        cursor: 'pointer',
        color: '#f8fafc',
    },
};

export default Inventory;
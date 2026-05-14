import React, { useEffect, useState } from 'react';
import saleService from '../services/saleService';
import Receipt from '../components/Receipt';

const SalesLog = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await saleService.getAll();
                setSales(response.data.data);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div style={styles.container}>
            <p style={styles.loading}>Loading logs...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Sales Log</h1>
            <div style={styles.layout}>
                <div style={styles.tableCard}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {['Transaction ID', 'Date & Time', 'Items', 'Total (RWF)'].map((h) => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={styles.empty}>No sales yet</td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr
                                        key={sale.id}
                                        style={{
                                            ...styles.row,
                                            backgroundColor:
                                                selectedSale?.id === sale.id ? '#334155' : 'transparent',
                                        }}
                                        onClick={() => setSelectedSale(sale)}
                                    >
                                        <td style={styles.td}>
                                            <span style={styles.txnId}>{sale.id}</span>
                                        </td>
                                        <td style={styles.td}>
                                            {new Date(sale.created_at).toLocaleString()}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.itemCount}>{sale.items.length} item(s)</span>
                                        </td>
                                        <td style={{ ...styles.td, fontWeight: '600', color: '#f8fafc' }}>
                                            {sale.total.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {selectedSale && (
                    <div style={styles.receiptPanel}>
                        <div style={styles.receiptWrapper}>
                             <Receipt sale={selectedSale} />
                        </div>
                        <button
                            style={styles.closeBtn}
                            onClick={() => setSelectedSale(null)}
                        >
                            Close Preview
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { 
        minHeight: '100vh', 
        padding: '24px', 
        backgroundColor: '#0f172a', 
        color: '#f8fafc' 
    },
    title: { 
        fontSize: '22px', 
        fontWeight: '600', 
        marginBottom: '24px', 
        color: '#f8fafc' 
    },
    loading: { 
        color: '#94a3b8', 
        fontSize: '14px', 
        textAlign: 'center', 
        marginTop: '40px' 
    },
    layout: { 
        display: 'flex', 
        gap: '24px', 
        alignItems: 'flex-start' 
    },
    tableCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: {
        textAlign: 'left',
        padding: '12px 16px',
        borderBottom: '1px solid #334155',
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    td: { 
        padding: '12px 16px', 
        borderBottom: '1px solid #0f172a', 
        color: '#cbd5e1' 
    },
    row: { 
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    txnId: { 
        fontSize: '11px', 
        color: '#475569', 
        fontFamily: 'monospace' 
    },
    itemCount: {
        backgroundColor: '#334155',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#e2e8f0'
    },
    empty: { 
        textAlign: 'center', 
        padding: '40px', 
        color: '#64748b' 
    },
    receiptPanel: {
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    receiptWrapper: {
        backgroundColor: '#f8fafc', // Kept white so the actual receipt is readable
        borderRadius: '8px',
        padding: '4px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    },
    closeBtn: {
        padding: '10px',
        fontSize: '13px',
        backgroundColor: '#334155',
        border: '1px solid #475569',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#f8fafc',
        fontWeight: '500',
        transition: 'background-color 0.2s',
    },
};

export default SalesLog;
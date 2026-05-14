import React, { useEffect, useState } from 'react';
import { useStock } from '../context/StockContext';
import saleService from '../services/saleService';

const Dashboard = () => {
    const { items, fetchItems } = useStock();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            await fetchItems();
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

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const todaySales = sales.filter((sale) => {
        const today = new Date().toDateString();
        return new Date(sale.created_at).toDateString() === today;
    });

    const stats = [
        { label: 'Total items', value: items.length },
        { label: 'Sales today', value: todaySales.length },
        { label: 'Total revenue', value: `${totalRevenue.toLocaleString()} RWF` },
        { label: 'All time sales', value: sales.length },
    ];

    if (loading) return <p style={styles.loading}>Loading...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Dashboard</h1>
            <div style={styles.statsGrid}>
                {stats.map((stat) => (
                    <div key={stat.label} style={styles.statCard}>
                        <p style={styles.statLabel}>{stat.label}</p>
                        <p style={styles.statValue}>{stat.value}</p>
                    </div>
                ))}
            </div>
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>Recent sales</h2>
                {sales.length === 0 ? (
                    <p style={styles.empty}>No sales yet — scan items to sell them</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {['Transaction ID', 'Date', 'Items', 'Total'].map((h) => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sales.slice(0, 10).map((sale) => (
                                <tr key={sale.id}>
                                    <td style={styles.td}>{sale.id}</td>
                                    <td style={styles.td}>
                                        {new Date(sale.created_at).toLocaleString()}
                                    </td>
                                    <td style={styles.td}>{sale.items.length} item(s)</td>
                                    <td style={styles.td}>
                                        {sale.total.toLocaleString()} RWF
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const styles = {
    // Added a container style to ensure the whole page background is dark
    container: { minHeight: '100vh', padding: '20px', backgroundColor: '#0f172a' }, 
    title: { fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#f8fafc' },
    loading: { color: '#94a3b8', fontSize: '14px' },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    statCard: {
        backgroundColor: '#1e293b', // Deep slate
        border: '1px solid #334155', // Subtle border
        borderRadius: '12px',
        padding: '16px',
    },
    statLabel: { fontSize: '13px', color: '#94a3b8', margin: '0 0 6px' },
    statValue: { fontSize: '24px', fontWeight: '600', color: '#f8fafc', margin: 0 },
    card: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '16px',
    },
    cardTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '12px',
    },
    empty: { color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: {
        textAlign: 'left',
        padding: '8px',
        borderBottom: '1px solid #334155',
        fontSize: '11px',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    td: { padding: '10px 8px', borderBottom: '1px solid #1e293b', color: '#e2e8f0' },
};

export default Dashboard;
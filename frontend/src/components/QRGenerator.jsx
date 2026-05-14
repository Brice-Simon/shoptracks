import React from 'react';
import QRCode from 'react-qr-code';

const QRGenerator = ({ item }) => {
    if (!item) return null;

    return (
        <div style={styles.container}>
            <div style={styles.qrBox}>
                <QRCode value={item.id} size={140} />
            </div>
            <p style={styles.sku}>{item.id}</p>
            <p style={styles.name}>{item.name}</p>
            <p style={styles.price}>{item.price.toLocaleString()} RWF</p>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '16px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
    },
    qrBox: {
        padding: '12px',
        border: '1px solid #334155',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
    },
    sku: { fontSize: '11px', color: '#94a3b8', margin: 0 },
    name: { fontSize: '14px', fontWeight: '600', color: '#f8fafc', margin: 0 },
    price: { fontSize: '13px', color: '#60a5fa', margin: 0 },
};

export default QRGenerator;
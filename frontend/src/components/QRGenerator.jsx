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
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
    },
    qrBox: {
        padding: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
    },
    sku: { fontSize: '11px', color: '#9ca3af', margin: 0 },
    name: { fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 },
    price: { fontSize: '13px', color: '#1d4ed8', margin: 0 },
};

export default QRGenerator;
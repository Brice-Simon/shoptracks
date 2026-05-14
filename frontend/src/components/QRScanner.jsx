import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, StopCircle } from 'lucide-react';

const QRScanner = ({ onScanSuccess }) => {
    const scannerRef = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started) return;

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(
            (decodedText) => {
                onScanSuccess(decodedText);
                scanner.clear();
                setStarted(false);
            },
            (error) => {
                // Scan errors are expected while waiting — ignore them
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => { });
            }
        };
    }, [started, onScanSuccess]);

    return (
        <div style={styles.container}>
            {!started ? (
                <button style={styles.startButton} onClick={() => setStarted(true)}>
                    <Camera size={16} style={{ marginRight: '6px' }} />
                    Start Camera Scanner
                </button>
            ) : (
                <div>
                    <div id="qr-reader" style={styles.reader} />
                    <button style={styles.stopButton} onClick={() => setStarted(false)}>
                        <StopCircle size={14} style={{ marginRight: '4px' }} />
                        Stop Scanner
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
    },
    startButton: {
        padding: '12px 24px',
        fontSize: '14px',
        backgroundColor: '#1d4ed8',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
    },
    stopButton: {
        marginTop: '10px',
        padding: '8px 16px',
        fontSize: '13px',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fca5a5',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    reader: {
        width: '100%',
        maxWidth: '400px',
    },
};

export default QRScanner;

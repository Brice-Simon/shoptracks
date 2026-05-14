import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { StockProvider } from './context/StockContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddItem from './pages/AddItem';
import Scanner from './pages/Scanner';
import SalesLog from './pages/SalesLog';

const App = () => {
    return (
        <BrowserRouter>
            <StockProvider>
                <CartProvider>
                    <div style={styles.layout}>
                        <Sidebar />
                        <main style={styles.main}>
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/inventory" element={<Inventory />} />
                                <Route path="/add-item" element={<AddItem />} />
                                <Route path="/scanner" element={<Scanner />} />
                                <Route path="/sales" element={<SalesLog />} />
                            </Routes>
                        </main>
                    </div>
                </CartProvider>
            </StockProvider>
        </BrowserRouter>
    );
};

const styles = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0f172a', // Changed from #f5f5f5 to match your dark theme
        fontFamily: 'Segoe UI, sans-serif',
    },
    main: {
        flex: 1,
        // Removed padding here because your individual pages (Dashboard, Scanner, etc.) 
        // already have 24px padding. Keeping it here creates a double-gap.
        overflowY: 'auto',
    },
};
export default App;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ScanLine, Receipt, Store } from 'lucide-react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/add-item', label: 'Add Item', icon: PlusCircle },
    { path: '/scanner', label: 'Scan & Sell', icon: ScanLine },
    { path: '/sales', label: 'Sales Log', icon: Receipt },
];

const Sidebar = () => {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.logo}>
                <Store size={24} color="#60a5fa" /> 
                <div>
                    <p style={styles.logoText}>ShopTrack</p>
                    <p style={styles.logoSub}>Asset & POS System</p>
                </div>
            </div>
            <nav style={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            ...styles.navItem,
                            ...(isActive ? styles.navItemActive : {}),
                        })}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: '220px',
        backgroundColor: '#0f172a', 
        borderRight: 'none', // Removed the border to eliminate the gap
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '20px 16px',
        borderBottom: '1px solid #1e293b', // Darker, subtle border
    },
    logoText: {
        fontSize: '15px',
        fontWeight: '600',
        margin: 0,
        color: '#f8fafc',
    },
    logoSub: {
        fontSize: '11px',
        color: '#94a3b8',
        margin: 0,
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 8px',
        gap: '2px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        color: '#536f97',
        fontWeight: '400',
        transition: 'background-color 0.2s',
    },
    navItemActive: {
        backgroundColor: '#1e293b',
        color: '#60a5fa',
        fontWeight: '500',
    },
};

export default Sidebar;
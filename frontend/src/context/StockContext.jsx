import React, { createContext, useContext, useState, useCallback } from 'react';
import itemService from '../services/itemService';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await itemService.getAll();
            setItems(response.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshItems = () => fetchItems();

    return (
        <StockContext.Provider value={{ items, loading, error, fetchItems, refreshItems }}>
            {children}
        </StockContext.Provider>
    );
};

export const useStock = () => useContext(StockContext);
import api from './api';

const itemService = {
    getAll: () => api.get('/items'),
    getById: (id) => api.get(`/items/${id}`),
    create: (data) => api.post('/items', data),
    update: (id, data) => api.put(`/items/${id}`, data),
    delete: (id) => api.delete(`/items/${id}`),
    getQR: (id) => api.get(`/qr/${id}`),
};

export default itemService;
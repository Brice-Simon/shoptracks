import api from './api';

const saleService = {
    getAll: () => api.get('/sales'),
    getById: (id) => api.get(`/sales/${id}`),
    create: (data) => api.post('/sales', data),
};

export default saleService;
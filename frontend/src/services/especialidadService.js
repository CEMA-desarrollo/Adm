import apiClient from './api';

const especialidadService = {
  async getAll(soloActivos = false) {
    const params = soloActivos ? { activo: 1 } : {};
    const response = await apiClient.get('/especialidades', { params });
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/especialidades', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/especialidades/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/especialidades/${id}`);
    return response.data;
  },
};

export default especialidadService;
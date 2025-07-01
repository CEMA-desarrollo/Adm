import apiClient from './api';

const servicioService = {
  async getAll() {
    const response = await apiClient.get('/servicios');
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/servicios', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/servicios/${id}`, data);
    return response.data;
  },

  // Corregido: Se pasa el ID para la eliminación lógica (desactivación)
  async delete(id) {
    const response = await apiClient.delete(`/servicios/${id}`);
    return response.data;
  },

  // Corregido: Se pasa el ID para el borrado permanente
  async deletePermanent(id) {
    const response = await apiClient.delete(`/servicios/${id}/permanent`);
    return response.data;
  },
};

export default servicioService;

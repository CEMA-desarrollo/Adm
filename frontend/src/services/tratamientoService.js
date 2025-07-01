import apiClient from './api';

const tratamientoService = {
  async getAll() {
    const response = await apiClient.get('/tratamientos');
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/tratamientos', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/tratamientos/${id}`, data);
    return response.data;
  },

  // Por ahora, la eliminación será lógica (cambiar estado a 'Cancelado')
  // La eliminación permanente se puede añadir después si es necesario.
};

export default tratamientoService;
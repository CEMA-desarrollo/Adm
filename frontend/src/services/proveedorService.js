import apiClient from './api';

const proveedorService = {
  async getAll() {
    const response = await apiClient.get('/proveedores');
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/proveedores', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/proveedores/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/proveedores/${id}`);
    return response.data;
  },

  async deletePermanent(id) {
    const response = await apiClient.delete(`/proveedores/${id}/permanent`);
    return response.data;
  },

  async getServicesByProveedor(proveedorId) {
    const response = await apiClient.get(`/proveedores/${proveedorId}/servicios`);
    return response.data;
  },

  async updateProveedorServices(proveedorId, serviceIds) {
    const response = await apiClient.put(`/proveedores/${proveedorId}/servicios`, { servicios: serviceIds });
    return response.data;
  },
};

export default proveedorService;
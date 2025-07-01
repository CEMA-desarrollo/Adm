import apiClient from './api';

const pacienteService = {
  async getAll() {
    const response = await apiClient.get('/pacientes');
    return response.data;
  },
};

export default pacienteService;
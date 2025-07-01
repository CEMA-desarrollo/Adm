import apiClient from './api';

const userService = {
  getAll() {
    return apiClient.get('/users');
  },

  create(userData) {
    return apiClient.post('/users', userData);
  },

  update(id, userData) {
    return apiClient.put(`/users/${id}`, userData);
  },

  delete(id) {
    return apiClient.delete(`/users/${id}`);
  },
};

export default userService;
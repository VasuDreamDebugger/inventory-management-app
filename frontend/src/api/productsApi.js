import axiosClient from './axiosClient';

const productsApi = {
  async getProducts(params = {}) {
    const response = await axiosClient.get('/products', { params });
    return response.data;
  },

  async getCategories() {
    const response = await axiosClient.get('/products/categories');
    return response.data;
  },

  async createProduct(data) {
    const response = await axiosClient.post('/products', data);
    return response.data;
  },

  async updateProduct(id, data) {
    const response = await axiosClient.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },

  async getProductHistory(id) {
    const response = await axiosClient.get(`/products/${id}/history`);
    return response.data;
  },

  async importProducts(formData) {
    const response = await axiosClient.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async exportProducts() {
    const response = await axiosClient.get('/products/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default productsApi;


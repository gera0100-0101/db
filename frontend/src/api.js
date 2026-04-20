import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = async (shopId = null, categoryId = null) => {
  const params = {};
  if (shopId) params.shop_id = shopId;
  if (categoryId) params.category_id = categoryId;
  const response = await api.get('/products/', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export const uploadProductImage = async (productId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/products/${productId}/images/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProductImage = async (productId, imageId) => {
  await api.delete(`/products/${productId}/images/${imageId}`);
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories/', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};

// Manufacturers
export const getManufacturers = async () => {
  const response = await api.get('/manufacturers/');
  return response.data;
};

export const createManufacturer = async (manufacturerData) => {
  const response = await api.post('/manufacturers/', manufacturerData);
  return response.data;
};

export const updateManufacturer = async (id, manufacturerData) => {
  const response = await api.put(`/manufacturers/${id}`, manufacturerData);
  return response.data;
};

export const deleteManufacturer = async (id) => {
  await api.delete(`/manufacturers/${id}`);
};

// Shops
export const getShops = async () => {
  const response = await api.get('/shops/');
  return response.data;
};

export const createShop = async (shopData) => {
  const response = await api.post('/shops/', shopData);
  return response.data;
};

export const updateShop = async (id, shopData) => {
  const response = await api.put(`/shops/${id}`, shopData);
  return response.data;
};

export const deleteShop = async (id) => {
  await api.delete(`/shops/${id}`);
};

// Companies
export const getCompanies = async () => {
  const response = await api.get('/companies/');
  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await api.post('/companies/', companyData);
  return response.data;
};

// Workers
export const getWorkers = async () => {
  const response = await api.get('/workers/');
  return response.data;
};

export const createWorker = async (workerData) => {
  const response = await api.post('/workers/', workerData);
  return response.data;
};

export const updateWorker = async (id, workerData) => {
  const response = await api.put(`/workers/${id}`, workerData);
  return response.data;
};

export const deleteWorker = async (id) => {
  await api.delete(`/workers/${id}`);
};

// Posts
export const getPosts = async () => {
  const response = await api.get('/posts/');
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts/', postData);
  return response.data;
};

// Orders
export const checkoutOrder = async (orderData) => {
  const response = await api.post('/orders/checkout/', orderData);
  return response.data;
};

export const getOrders = async (statusFilter = null) => {
  const params = {};
  if (statusFilter) params.status_filter = statusFilter;
  const response = await api.get('/orders/', { params });
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await api.put(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id) => {
  await api.delete(`/orders/${id}`);
};

export const getAdminOrders = async () => {
  const response = await api.get('/admin/orders/');
  return response.data;
};

export default api;

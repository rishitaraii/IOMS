import axios from 'axios';
import type { Product, ProductInput, Customer,CustomerInput, Order, OrderInput } from '../types/types';
const BASE_URL = 'http://localhost:8000/api/';

export const api= axios.create({
  baseURL: BASE_URL,
});

export const fetchProducts = () => api.get<Product[]>("products/");
export const fetchProduct = (id: number) => api.get<Product>(`products/${id}/`);
export const createProduct = (data: ProductInput) => api.post("products/create/", data);
export const updateProduct = (id: number, data: ProductInput) =>
  api.put(`products/${id}/update/`, data);
export const deleteProduct = (id: number) => api.delete(`products/${id}/delete/`);

export const fetchCustomers = () => api.get<Customer[]>("customers/");
export const fetchCustomer = (id: number) => api.get<Customer>(`customers/${id}/`);
export const createCustomer = (data: CustomerInput) => api.post("customers/create/", data);
export const updateCustomer = (id: number, data: CustomerInput) =>
  api.put(`customers/${id}/update/`, data);
export const deleteCustomer = (id: number) => api.delete(`customers/${id}/delete/`);

export const fetchOrders = () => api.get<Order[]>("orders/");
export const fetchOrder = (id: number) => api.get<Order>(`orders/${id}/`);
export const createOrder = (order: OrderInput) => api.post("orders/create/", order);
export const updateOrder = (id: number, order: OrderInput) =>api.put(`orders/${id}/update/`, order);
export const deleteOrder = (id: number) => api.delete(`orders/${id}/delete/`);

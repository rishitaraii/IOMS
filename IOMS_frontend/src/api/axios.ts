import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/';

export const api= axios.create({
  baseURL: BASE_URL,
});

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  status: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}
export const fetchProducts = () => api.get<Product[]>('products/');
export const createProduct = (product: Product) => api.post<Product>('products/', product);
export const updateProduct = (id: number, product: Product) => api.put<Product>(`products/${id}/`, product);
export const deleteProduct = (id: number) => api.delete(`products/${id}/`);

export const fetchCustomer = () => api.get<Customer[]>('customers/');
export const createCustomer = (product: Customer) => api.post<Customer>('customers/', product);
export const updateCustomer = (id: number, customer: any) => api.put<Customer>(`customers/${id}/`, customer);
export const deleteCustomer = (id: number) => api.delete(`customers/${id}/`);

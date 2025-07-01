
export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  status: string;
}

export interface ProductInput {
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

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItemInput {
  product: number; // product ID for creating orders
  quantity: number;
}

export interface OrderItem {
  product: Product; // full product for display
  quantity: number;
}

export interface OrderInput {
  customer: number; // customer ID for creating
  status: string;
  items: OrderItemInput[];
}

export interface Order {
  order_id: number;
  customer: number;
  customer_details: Customer;
  date: string;
  status: string;
  total_items: number;
  total_price: string;
  items: OrderItem[];
}

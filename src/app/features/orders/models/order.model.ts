export interface Order {
  id?: number;
  customerId: number;
  customerName?: string;
  orderDate?: Date;
  status?: OrderStatus;
  totalAmount?: number;
  items: OrderItem[];
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  imageUrl?: string;
  barcode?: string;
}
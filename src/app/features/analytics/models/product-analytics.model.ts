// src/app/features/analytics/models/product-analytics.model.ts
export interface ProductAnalytics {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  price: number;
  inventoryValue: number;
  salesCount?: number;
  imageUrl?: string;
}
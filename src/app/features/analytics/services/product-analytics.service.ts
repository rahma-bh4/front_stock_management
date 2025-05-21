// src/app/features/analytics/services/product-analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductAnalytics } from '../models/product-analytics.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductAnalyticsService {
  private apiUrl = `${environment.productApi}/analytics`;

  constructor(private http: HttpClient) { }

  getTopSellingProducts(limit: number = 10): Observable<ProductAnalytics[]> {
    return this.http.get<ProductAnalytics[]>(`${this.apiUrl}/top-selling?limit=${limit}`);
  }

  getLowStockProducts(threshold: number = 5): Observable<ProductAnalytics[]> {
    return this.http.get<ProductAnalytics[]>(`${this.apiUrl}/low-stock?threshold=${threshold}`);
  }

  getProductsByCategory(): Observable<{[key: string]: number}> {
    return this.http.get<{[key: string]: number}>(`${this.apiUrl}/by-category`);
  }

  getTotalInventoryValue(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/inventory-value`);
  }
}
// src/app/features/analytics/product-analytics/product-analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductAnalyticsService } from '../services/product-analytics.service';
import { ProductAnalytics } from '../models/product-analytics.model';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-product-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ProductAnalyticsService],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Product Analytics Dashboard</h1>
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Products</div>
              <div class="text-xl font-bold">{{totalProducts}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i class="fas fa-dollar-sign text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Inventory Value</div>
              <div class="text-xl font-bold">{{inventoryValue | currency}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <i class="fas fa-exclamation-triangle text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Low Stock Items</div>
              <div class="text-xl font-bold">{{lowStockCount}}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Top Selling Products -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Top Selling Products</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th class="py-3 px-6 text-left">Product</th>
                <th class="py-3 px-6 text-center">Category</th>
                <th class="py-3 px-6 text-right">Price</th>
                <th class="py-3 px-6 text-right">Current Stock</th>
                <th class="py-3 px-6 text-right">Sales</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
              <tr *ngFor="let product of topSellingProducts" class="border-b border-gray-100 hover:bg-gray-50">
                <td class="py-3 px-6 text-left">
                  <div class="font-medium">{{product.name}}</div>
                </td>
                <td class="py-3 px-6 text-center">
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {{product.category || 'Uncategorized'}}
                  </span>
                </td>
                <td class="py-3 px-6 text-right">{{product.price | currency}}</td>
                <td class="py-3 px-6 text-right" [class.text-red-600]="product.currentStock <= 5">
                  {{product.currentStock}}
                </td>
                <td class="py-3 px-6 text-right">{{product.salesCount || 'N/A'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Category Distribution -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Product Categories Distribution</h2>
        <div class="h-80 bg-gray-50 rounded flex items-center justify-center">
          <div id="categoryChart" class="w-full h-full"></div>
        </div>
      </div>
      
      <!-- Low Stock Alert -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-800">Low Stock Alert</h2>
          <a routerLink="/products" [queryParams]="{lowStock: true}" class="text-primary hover:underline text-sm">View All</a>
        </div>
        
        <div *ngFor="let product of lowStockProducts" class="border-b border-gray-100 py-3">
          <div class="flex items-center">
            <div class="w-10 h-10 flex-shrink-0 mr-3">
              <img [src]="product.imageUrl || 'assets/images/product-placeholder.png'" 
                   [alt]="product.name"
                   class="w-10 h-10 rounded object-cover">
            </div>
            <div class="flex-grow">
              <div class="font-medium">{{product.name}}</div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">{{product.category || 'Uncategorized'}}</span>
                <span class="text-red-600 font-medium">Stock: {{product.currentStock}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-primary {
      color: #3f51b5;
    }
  `]
})
export class ProductAnalyticsComponent implements OnInit {
  totalProducts: number = 0;
  inventoryValue: number = 0;
  lowStockCount: number = 0;
  topSellingProducts: ProductAnalytics[] = [];
  lowStockProducts: ProductAnalytics[] = [];
  categoryDistribution: Map<string, number> = new Map();
  constructor(@Inject(ProductAnalyticsService) private analyticsService: ProductAnalyticsService) {}
//   constructor(private analyticsService: ProductAnalyticsService) {}
  
  ngOnInit(): void {
    this.loadInventoryValue();
    this.loadTopSellingProducts();
    this.loadLowStockProducts();
    this.loadCategoryDistribution();
  }
  
  loadInventoryValue(): void {
    this.analyticsService.getTotalInventoryValue().subscribe(
      (value:any) => {
        this.inventoryValue = value;
      },
      (error:any) => {
        console.error('Error loading inventory value', error);
      }
    );
  }
  
  loadTopSellingProducts(): void {
    this.analyticsService.getTopSellingProducts().subscribe(
      (products:any) => {
        this.topSellingProducts = products;
        this.totalProducts = products.length; // This should be the total count from API
      },
      (error:any) => {
        console.error('Error loading top selling products', error);
      }
    );
  }
  
  loadLowStockProducts(): void {
    this.analyticsService.getLowStockProducts().subscribe(
      (products:any) => {
        this.lowStockProducts = products;
        this.lowStockCount = products.length;
      },
      (error:any) => {
        console.error('Error loading low stock products', error);
      }
    );
  }
  
  loadCategoryDistribution(): void {
    this.analyticsService.getProductsByCategory().subscribe(
      (distribution:any) => {
        this.categoryDistribution = new Map(Object.entries(distribution));
        this.renderCategoryChart();
      },
      (error:any) => {
        console.error('Error loading category distribution', error);
      }
    );
  }
  
  renderCategoryChart(): void {
    // In a real implementation, you would use a charting library like Chart.js
    // or D3.js to render the chart using the categoryDistribution data
    console.log('Category distribution data ready for chart rendering');
  }
}
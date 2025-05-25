import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductAnalyticsService } from '../services/product-analytics.service';
import { ProductAnalytics } from '../models/product-analytics.model';

@Component({
  selector: 'app-product-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ProductAnalyticsService],
  template: `
    <div class="container mx-auto p-6 pt-20">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 text-white">
        <h1 class="text-3xl font-bold mb-2">Product Analytics Dashboard</h1>
        <p class="opacity-90">Comprehensive insights into your product performance</p>
      </div>

      <!-- Summary Cards using REAL backend data -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">TOTAL PRODUCTS</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{topSellingProducts.length}}</p>
              <div class="flex items-center mt-2">
                <span class="text-blue-500 text-sm font-medium flex items-center">
                  <i class="fas fa-box mr-1"></i>
                  Active products
                </span>
              </div>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-box text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">INVENTORY VALUE</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{inventoryValue | currency}}</p>
              <div class="flex items-center mt-2">
                <span class="text-green-500 text-sm font-medium flex items-center">
                  <i class="fas fa-dollar-sign mr-1"></i>
                  Total value
                </span>
              </div>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">LOW STOCK ITEMS</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{lowStockProducts.length}}</p>
              <div class="flex items-center mt-2">
                <span class="text-red-500 text-sm font-medium flex items-center">
                  <i class="fas fa-exclamation-triangle mr-1"></i>
                  Need attention
                </span>
              </div>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row using REAL backend data -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        <!-- Category Distribution Chart - Using real /by-category endpoint -->
        <div class="bg-white rounded-xl shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-800">Product Categories Distribution</h2>
            <p class="text-gray-600 text-sm mt-1">Data from /api/products/analytics/by-category</p>
          </div>
          <div class="p-6">
            <div class="relative h-80 flex items-center justify-center">
              
              <!-- Loading state -->
              <div *ngIf="isLoadingCategories" class="text-gray-500 text-center">
                <i class="fas fa-spinner fa-spin text-4xl mb-2"></i>
                <p>Loading category data...</p>
              </div>
              
              <!-- No data state -->
              <div *ngIf="!isLoadingCategories && categoryArray.length === 0" class="text-gray-500 text-center">
                <i class="fas fa-chart-pie text-4xl mb-2"></i>
                <p>No category data available</p>
              </div>
              
              <!-- Real Category Chart -->
              <div *ngIf="!isLoadingCategories && categoryArray.length > 0" class="w-full h-full flex items-center justify-center">
                <div class="relative w-64 h-64">
                  <!-- Simple pie chart using CSS with real backend data -->
                  <div class="pie-chart-container relative">
                    <div class="w-64 h-64 rounded-full relative overflow-hidden" 
                         [style.background]="getPieChartBackground()">
                    </div>
                    
                    <!-- Center content -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                        <div class="text-center">
                          <p class="text-xl font-bold text-gray-900">{{getTotalCategoryCount()}}</p>
                          <p class="text-sm text-gray-500">Products</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Legend with real category data -->
                  <div class="ml-8 space-y-2">
                    <div *ngFor="let category of categoryArray; let i = index" class="flex items-center">
                      <div class="w-4 h-4 rounded mr-3" [style.background-color]="getCategoryColor(i)"></div>
                      <span class="text-sm text-gray-700">{{category.key}} ({{category.value}})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Products Chart - Using real /top-selling endpoint -->
        <div class="bg-white rounded-xl shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-800">Product Stock Levels</h2>
            <p class="text-gray-600 text-sm mt-1">Data from /api/products/analytics/top-selling</p>
          </div>
          <div class="p-6">
            <div class="h-80 relative">
              
              <!-- Loading state -->
              <div *ngIf="isLoadingProducts" class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                  <i class="fas fa-spinner fa-spin text-4xl mb-2"></i>
                  <p>Loading product data...</p>
                </div>
              </div>
              
              <!-- No data state -->
              <div *ngIf="!isLoadingProducts && topSellingProducts.length === 0" class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                  <i class="fas fa-chart-bar text-4xl mb-2"></i>
                  <p>No product data available</p>
                </div>
              </div>
              
              <!-- Real Bar Chart showing product stock levels -->
              <div *ngIf="!isLoadingProducts && topSellingProducts.length > 0" class="flex items-end justify-between h-full px-4 pb-8">
                <div *ngFor="let product of topSellingProducts.slice(0, 6); let i = index" class="flex flex-col items-center flex-1 max-w-24 h-full">
                  <!-- Bar container with full height -->
                  <div class="flex flex-col justify-end h-full w-full">
                    <div 
                      class="w-full rounded-t transition-all duration-1000 ease-out"
                      [style.height.px]="getProductStockHeight(product.currentStock)"
                      [style.background]="'linear-gradient(to top, ' + getProductColor(i) + ', ' + getProductLightColor(i) + ')'"
                      [style.animation-delay]="i * 200 + 'ms'">
                    </div>
                  </div>
                  <!-- Labels below the chart area -->
                  <div class="mt-2 text-center">
                    <span class="text-xs text-gray-500 truncate w-full block" [title]="product.name">{{product.name}}</span>
                    <span class="text-xs font-semibold text-gray-700">{{product.currentStock}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Selling Products Table - Using real /top-selling endpoint -->
      <div class="bg-white rounded-xl shadow-lg mb-6">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-800">Top Selling Products</h2>
            <a routerLink="/products" class="text-blue-600 text-sm font-medium hover:text-blue-700">View All</a>
          </div>
        </div>
        <div class="p-6">
          
          <!-- Loading state -->
          <div *ngIf="isLoadingProducts" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-4xl mb-2 text-gray-400"></i>
            <p class="text-gray-500">Loading products...</p>
          </div>
          
          <!-- Table with real data -->
          <div *ngIf="!isLoadingProducts" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left border-b border-gray-100">
                  <th class="pb-4 text-sm font-medium text-gray-600">PRODUCT</th>
                  <th class="pb-4 text-sm font-medium text-gray-600">CATEGORY</th>
                  <th class="pb-4 text-sm font-medium text-gray-600 text-right">PRICE</th>
                  <th class="pb-4 text-sm font-medium text-gray-600 text-right">CURRENT STOCK</th>
                  <th class="pb-4 text-sm font-medium text-gray-600 text-right">INVENTORY VALUE</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let product of topSellingProducts; let i = index" class="border-b border-gray-50">
                  <td class="py-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-cube text-gray-500"></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{product.name}}</p>
                        <p class="text-sm text-gray-500">#{{product.id}}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{product.category || 'Uncategorized'}}
                    </span>
                  </td>
                  <td class="py-4 text-right font-medium text-gray-900">{{product.price | currency}}</td>
                  <td class="py-4 text-right" [class.text-red-600]="product.currentStock <= 5">
                    <span class="font-medium">{{product.currentStock}}</span>
                  </td>
                  <td class="py-4 text-right">
                    <span class="font-medium text-gray-900">{{product.inventoryValue | currency}}</span>
                  </td>
                </tr>
                
                <!-- No data state -->
                <tr *ngIf="topSellingProducts.length === 0">
                  <td colspan="5" class="py-8 text-center text-gray-500">
                    <i class="fas fa-box-open text-4xl mb-2"></i>
                    <p>No products data available</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Low Stock Alert using real /low-stock endpoint -->
      <div *ngIf="!isLoadingLowStock && lowStockProducts.length > 0" class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
        <div class="flex items-start space-x-4">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-red-800 text-lg">Low Stock Alert</h3>
            <p class="text-red-600 mt-1">{{lowStockProducts.length}} products are running low on stock and need immediate attention.</p>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div *ngFor="let product of lowStockProducts.slice(0, 3)" 
                   class="bg-white rounded-lg p-4 border border-red-200">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-cube text-gray-500"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{product.name}}</p>
                    <p class="text-sm text-red-600 font-medium">Only {{product.currentStock}} left</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <a routerLink="/products" [queryParams]="{lowStock: true}" 
                 class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                View All Low Stock Products
                <i class="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pie-chart-container {
      animation: fadeIn 0.8s ease-out;
    }
    
    .hover\:shadow-xl:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .transition-shadow {
      transition: box-shadow 0.15s ease-in-out;
    }
    
    .transition-colors {
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    }
    
    .transition-all {
      transition: all 0.3s ease-in-out;
    }
    
    .duration-300 {
      transition-duration: 300ms;
    }
    
    .duration-1000 {
      transition-duration: 1000ms;
    }
    
    .ease-out {
      transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class ProductAnalyticsComponent implements OnInit {
  // Data properties matching your backend responses
  inventoryValue: number = 0;
  topSellingProducts: ProductAnalytics[] = [];
  lowStockProducts: ProductAnalytics[] = [];
  categoryDistribution: Map<string, number> = new Map();
  categoryArray: {key: string, value: number}[] = [];
  
  // Loading states for better UX
  isLoadingProducts: boolean = true;
  isLoadingLowStock: boolean = true;
  isLoadingCategories: boolean = true;
  isLoadingInventory: boolean = true;

  constructor(private analyticsService: ProductAnalyticsService) {}
  
  ngOnInit(): void {
    this.loadAllAnalyticsData();
  }
  
  loadAllAnalyticsData(): void {
    this.loadInventoryValue();
    this.loadTopSellingProducts();
    this.loadLowStockProducts();
    this.loadCategoryDistribution();
  }
  
  loadInventoryValue(): void {
    this.isLoadingInventory = true;
    this.analyticsService.getTotalInventoryValue().subscribe({
      next: (value: number) => {
        this.inventoryValue = value;
        this.isLoadingInventory = false;
      },
      error: (error: any) => {
        console.error('Error loading inventory value from /api/products/analytics/inventory-value:', error);
        this.inventoryValue = 0;
        this.isLoadingInventory = false;
      }
    });
  }
  
  loadTopSellingProducts(): void {
    this.isLoadingProducts = true;
    this.analyticsService.getTopSellingProducts().subscribe({
      next: (products: ProductAnalytics[]) => {
        this.topSellingProducts = products || [];
        this.isLoadingProducts = false;
      },
      error: (error: any) => {
        console.error('Error loading top selling products from /api/products/analytics/top-selling:', error);
        this.topSellingProducts = [];
        this.isLoadingProducts = false;
      }
    });
  }
  
  loadLowStockProducts(): void {
    this.isLoadingLowStock = true;
    this.analyticsService.getLowStockProducts().subscribe({
      next: (products: ProductAnalytics[]) => {
        this.lowStockProducts = products || [];
        this.isLoadingLowStock = false;
      },
      error: (error: any) => {
        console.error('Error loading low stock products from /api/products/analytics/low-stock:', error);
        this.lowStockProducts = [];
        this.isLoadingLowStock = false;
      }
    });
  }
  
  loadCategoryDistribution(): void {
    this.isLoadingCategories = true;
    this.analyticsService.getProductsByCategory().subscribe({
      next: (distribution: {[key: string]: number}) => {
        // Convert Map<String, Long> from backend to usable format
        this.categoryDistribution = new Map(Object.entries(distribution || {}));
        this.categoryArray = Array.from(this.categoryDistribution.entries()).map(([key, value]) => ({
          key: key,
          value: Number(value) // Ensure it's a number
        }));
        this.isLoadingCategories = false;
      },
      error: (error: any) => {
        console.error('Error loading category distribution from /api/products/analytics/by-category:', error);
        this.categoryDistribution = new Map();
        this.categoryArray = [];
        this.isLoadingCategories = false;
      }
    });
  }
  
  // Helper methods for rendering charts with real backend data
  getTotalCategoryCount(): number {
    return this.categoryArray.reduce((sum, category) => sum + category.value, 0);
  }
  
  getPieChartBackground(): string {
    if (this.categoryArray.length === 0) return '#f1f5f9';
    
    const total = this.getTotalCategoryCount();
    if (total === 0) return '#f1f5f9';
    
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    let gradientStops: string[] = [];
    let currentPercentage = 0;
    
    this.categoryArray.forEach((category, index) => {
      const percentage = (category.value / total) * 100;
      const color = colors[index % colors.length];
      
      gradientStops.push(`${color} ${currentPercentage}% ${currentPercentage + percentage}%`);
      currentPercentage += percentage;
    });
    
    return `conic-gradient(${gradientStops.join(', ')})`;
  }
  
  getCategoryColor(index: number): string {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  }
  
  getProductStockHeight(stock: number): number {
    if (this.topSellingProducts.length === 0) return 20;
    
    const maxStock = Math.max(...this.topSellingProducts.map(p => p.currentStock || 0));
    if (maxStock === 0) return 20;
    
    // Calculate height in pixels (max height 200px, min height 20px)
    const maxHeight = 200;
    const minHeight = 20;
    const height = (stock / maxStock) * maxHeight;
    
    return Math.max(minHeight, height);
  }
  
  getProductStockPercentage(stock: number): number {
    if (this.topSellingProducts.length === 0) return 0;
    const maxStock = Math.max(...this.topSellingProducts.map(p => p.currentStock || 0));
    if (maxStock === 0) return 0;
    
    // Ensure minimum 10% height for visibility and scale the rest
    const percentage = (stock / maxStock) * 100;
    return Math.max(10, percentage); // Minimum 10% height for small values
  }
  
  getProductColor(index: number): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  }
  
  getProductLightColor(index: number): string {
    const colors = ['#93c5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#c4b5fd', '#67e8f9'];
    return colors[index % colors.length];
  }
}
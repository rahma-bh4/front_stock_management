import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../products/services/product.service';
import { OrderService } from '../orders/services/order.service';
import { Product } from '../products/models/product.model';
import { Customer } from '../customers/models/customer.model';
import { Order, OrderStatus } from '../orders/models/order.model';
import { CustomerService } from '../customers/models/customers/services/customer.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-6 pt-20">
      <!-- Header with gradient background -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
        <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
        <p class="opacity-90">Welcome back! Here's what's happening with your business today.</p>
      </div>
      
      <!-- Stats Cards with REAL DATA ONLY -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Products Card - Real Data -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500 uppercase font-semibold">Total Products</div>
              <div class="text-2xl font-bold text-gray-800">{{products.length}}</div>
              <div class="text-blue-500 text-sm flex items-center mt-1">
                <i class="fas fa-info-circle mr-1"></i>
                Active products
              </div>
            </div>
          </div>
        </div>
        
        <!-- Total Customers Card - Real Data -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i class="fas fa-users text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500 uppercase font-semibold">Total Customers</div>
              <div class="text-2xl font-bold text-gray-800">{{customers.length}}</div>
              <div class="text-green-500 text-sm flex items-center mt-1">
                <i class="fas fa-users mr-1"></i>
                Registered customers
              </div>
            </div>
          </div>
        </div>
        
        <!-- Total Orders Card - Real Data -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <i class="fas fa-shopping-cart text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500 uppercase font-semibold">Total Orders</div>
              <div class="text-2xl font-bold text-gray-800">{{orders.length}}</div>
              <div class="text-yellow-600 text-sm flex items-center mt-1">
                <i class="fas fa-shopping-cart mr-1"></i>
                All orders
              </div>
            </div>
          </div>
        </div>
        
        <!-- Total Revenue Card - Real Data -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <i class="fas fa-dollar-sign text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500 uppercase font-semibold">Total Revenue</div>
              <div class="text-2xl font-bold text-gray-800">{{calculateTotalRevenue() | currency}}</div>
              <div class="text-purple-600 text-sm flex items-center mt-1">
                <i class="fas fa-chart-line mr-1"></i>
                Total earnings
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sales Overview Chart - Using Real Order Data -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-xl font-bold text-gray-800">Sales Overview</h2>
                <p class="text-gray-600 text-sm mt-1">Revenue from completed orders</p>
              </div>
              <div class="flex space-x-2">
                <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium">Orders</button>
                <button class="px-4 py-2 text-gray-600 text-sm rounded-lg font-medium hover:bg-gray-100">Revenue</button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <!-- Chart showing REAL order data by month -->
            <div class="h-60 bg-gray-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
              
              <!-- Show message if no data -->
              <div *ngIf="ordersByMonth.length === 0" class="text-gray-500 text-center z-10">
                <i class="fas fa-chart-line text-4xl mb-2"></i>
                <p>No order data available</p>
              </div>
              
              <!-- Real Chart with order data -->
              <div *ngIf="ordersByMonth.length > 0" class="w-full h-full relative z-10 p-4">
                <div class="flex items-end justify-between h-full">
                  <div *ngFor="let monthData of ordersByMonth" class="flex flex-col items-center flex-1">
                    <div 
                      class="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-1000"
                      [style.height.%]="getMonthPercentage(monthData.count)">
                    </div>
                    <span class="text-xs text-gray-500 mt-2">{{monthData.month}}</span>
                    <span class="text-xs font-semibold text-gray-700">{{monthData.count}}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Real statistics from your data -->
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-sm text-gray-500">Total Sales</div>
                <div class="text-lg font-bold">{{calculateTotalRevenue() | currency}}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Avg. Order Value</div>
                <div class="text-lg font-bold">{{calculateAverageOrderValue() | currency}}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Completed Orders</div>
                <div class="text-lg font-bold">{{completedOrders.length}}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Order Status Distribution - Real Data -->
        <div class="bg-white rounded-xl shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-800">Order Status</h2>
            <p class="text-gray-600 text-sm mt-1">Current order statuses</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div *ngFor="let status of orderStatusData" class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-3" [style.background-color]="status.color"></div>
                  <span class="text-sm font-medium">{{status.name}}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-bold">{{status.count}}</span>
                  <div class="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      class="h-full rounded-full transition-all duration-1000" 
                      [style.width.%]="status.percentage"
                      [style.background-color]="status.color">
                    </div>
                  </div>
                </div>
              </div>
              
              <div *ngIf="orderStatusData.length === 0" class="text-center text-gray-500 py-4">
                No orders to display
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Recent Orders - Real Data -->
        <div class="bg-white rounded-xl shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-800">Recent Orders</h2>
              <a routerLink="/orders" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</a>
            </div>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th class="py-3 px-4 text-left">Order ID</th>
                    <th class="py-3 px-4 text-left">Customer</th>
                    <th class="py-3 px-4 text-left">Date</th>
                    <th class="py-3 px-4 text-center">Status</th>
                    <th class="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                  <tr *ngFor="let order of recentOrders" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-2 px-4 text-left">
                      <a [routerLink]="['/orders', order.id]" class="font-medium text-blue-600 hover:underline">
                        #{{order.id}}
                      </a>
                    </td>
                    <td class="py-2 px-4 text-left">{{order.customerName || 'Customer #' + order.customerId}}</td>
                    <td class="py-2 px-4 text-left">{{order.orderDate | date:'shortDate'}}</td>
                    <td class="py-2 px-4 text-center">
                      <span [class]="getStatusBadgeClass(order.status)" class="text-xs">
                        {{order.status}}
                      </span>
                    </td>
                    <td class="py-2 px-4 text-right font-medium">{{order.totalAmount | currency}}</td>
                  </tr>
                  
                  <tr *ngIf="recentOrders.length === 0">
                    <td colspan="5" class="py-4 text-center text-gray-500">No recent orders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Low Stock Products - Real Data -->
        <div class="bg-white rounded-xl shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-800">Low Stock Products</h2>
              <a routerLink="/products" [queryParams]="{lowStock: true}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</a>
            </div>
          </div>
          <div class="p-6">
            <div *ngFor="let product of lowStockProducts" class="border-b border-gray-100 py-3">
              <div class="flex items-center">
                <div class="w-10 h-10 flex-shrink-0 mr-3">
                  <img [src]="baseurl+product.imageUrl || 'assets/images/product-placeholder.png'" 
                       [alt]="product.name"
                       class="w-10 h-10 rounded object-cover">
                </div>
                <div class="flex-grow">
                  <div class="font-medium">{{product.name}}</div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">{{product.category || 'Uncategorized'}}</span>
                    <span class="text-red-600 font-medium">Stock: {{product.quantity}}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div *ngIf="lowStockProducts.length === 0" class="py-4 text-center text-gray-500">
              No low stock products
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transition-shadow {
      transition: box-shadow 0.3s ease;
    }
    
    .hover\:shadow-xl:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .transition-all {
      transition: all 0.3s ease;
    }
    
    .duration-300 {
      transition-duration: 300ms;
    }
    
    .duration-1000 {
      transition-duration: 1000ms;
    }
  `]
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  customers: Customer[] = [];
  orders: Order[] = [];
  baseurl:string=environment.fileServerUrl;
  // Derived data from real backend
  lowStockProducts: Product[] = [];
  recentOrders: Order[] = [];
  completedOrders: Order[] = [];
  ordersByMonth: any[] = [];
  orderStatusData: any[] = [];
  
  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService
  ) {}
  
  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();
    this.loadOrders();
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.lowStockProducts = this.products
          .filter(p => p.quantity <= 5)
          .sort((a, b) => a.quantity - b.quantity)
          .slice(0, 5);
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }
  
  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data: any) => {
        this.customers = data;
      },
      (error: any) => {
        console.error('Error loading customers', error);
      }
    );
  }
  
  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.processOrderData();
      },
      (error) => {
        console.error('Error loading orders', error);
      }
    );
  }
  
  processOrderData(): void {
    // Sort orders by date
    this.orders.sort((a, b) => {
      const dateA = new Date(a.orderDate || '');
      const dateB = new Date(b.orderDate || '');
      return dateB.getTime() - dateA.getTime();
    });
    
    // Get recent orders
    this.recentOrders = this.orders.slice(0, 5);
    
    // Get completed orders
    this.completedOrders = this.orders.filter(o => o.status === OrderStatus.DELIVERED);
    
    // Process orders by month
    this.processOrdersByMonth();
    
    // Process order status data
    this.processOrderStatusData();
  }
  
  processOrdersByMonth(): void {
    const monthCounts: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    this.orders.forEach(order => {
      if (order.orderDate) {
        const date = new Date(order.orderDate);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const monthName = monthNames[date.getMonth()];
        
        if (!monthCounts[monthKey]) {
          monthCounts[monthKey] = 0;
        }
        monthCounts[monthKey]++;
      }
    });
    
    // Convert to array and get last 6 months
    this.ordersByMonth = Object.entries(monthCounts)
      .map(([key, count]) => {
        const [year, month] = key.split('-');
        return {
          month: monthNames[parseInt(month)],
          count: count,
          key: key
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6); // Last 6 months
  }
  
  processOrderStatusData(): void {
    const statusCounts: { [key: string]: number } = {};
    const statusColors: { [key: string]: string } = {
      'PENDING': '#f59e0b',
      'PROCESSING': '#3b82f6',
      'SHIPPED': '#6366f1',
      'DELIVERED': '#10b981',
      'CANCELLED': '#ef4444'
    };
    
    this.orders.forEach(order => {
      const status = order.status || 'PENDING';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const totalOrders = this.orders.length;
    
    this.orderStatusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0) + status.slice(1).toLowerCase(),
      count: count,
      percentage: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
      color: statusColors[status] || '#6b7280'
    }));
  }
  
  getMonthPercentage(count: number): number {
    if (this.ordersByMonth.length === 0) return 0;
    const maxCount = Math.max(...this.ordersByMonth.map(m => m.count));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }
  
  getStatusBadgeClass(status?: OrderStatus): string {
    if (!status) return 'bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full';
    
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full';
      case OrderStatus.SHIPPED:
        return 'bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full';
      default:
        return 'bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full';
    }
  }
  
  calculateTotalRevenue(): number {
    return this.orders
      .filter(o => o.status !== OrderStatus.CANCELLED)
      .reduce((total, order) => total + (order.totalAmount || 0), 0);
  }
  
  calculateAverageOrderValue(): number {
    const validOrders = this.orders.filter(o => o.status !== OrderStatus.CANCELLED);
    if (validOrders.length === 0) return 0;
    
    const totalRevenue = validOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
    return totalRevenue / validOrders.length;
  }
}
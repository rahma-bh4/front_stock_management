import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../products/services/product.service';

import { OrderService } from '../orders/services/order.service';
import { Product } from '../products/models/product.model';
import { Customer } from '../customers/models/customer.model';
import { Order, OrderStatus } from '../orders/models/order.model';
import { CustomerService } from '../customers/models/customers/services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i class="fas fa-box text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Products</div>
              <div class="text-xl font-bold">{{products.length}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i class="fas fa-users text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Customers</div>
              <div class="text-xl font-bold">{{customers.length}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <i class="fas fa-shopping-cart text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Orders</div>
              <div class="text-xl font-bold">{{orders.length}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <i class="fas fa-dollar-sign text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Revenue</div>
              <div class="text-xl font-bold">{{calculateTotalRevenue() | currency}}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Orders -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-800">Recent Orders</h2>
            <a routerLink="/orders" class="text-primary hover:underline text-sm">View All</a>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
                <tr>
                  <th class="py-2 px-4 text-left">Order ID</th>
                  <th class="py-2 px-4 text-left">Customer</th>
                  <th class="py-2 px-4 text-left">Date</th>
                  <th class="py-2 px-4 text-center">Status</th>
                  <th class="py-2 px-4 text-right">Total</th>
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
        
        <!-- Low Stock Products -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-800">Low Stock Products</h2>
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
      
      <!-- Second Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <!-- Sales Overview -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-800">Sales Overview</h2>
            <div class="text-sm text-gray-500">Last 7 days</div>
          </div>
          
          <!-- For an actual chart, you would use a library like Chart.js or D3.js -->
          <div class="h-60 bg-gray-100 rounded flex items-center justify-center mb-4">
            <div class="text-gray-500">Sales Chart Placeholder</div>
          </div>
          
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
        
        <!-- Recent Customers -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-800">Recent Customers</h2>
            <a routerLink="/customers" class="text-primary hover:underline text-sm">View All</a>
          </div>
          
          <div *ngFor="let customer of recentCustomers" class="border-b border-gray-100 py-3">
            <div class="flex items-center">
              <div class="mr-3 bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {{getInitials(customer)}}
              </div>
              <div class="flex-grow">
                <div class="font-medium">{{customer.firstName}} {{customer.lastName}}</div>
                <div class="text-sm text-gray-500">{{customer.email}}</div>
              </div>
            </div>
          </div>
          
          <div *ngIf="recentCustomers.length === 0" class="py-4 text-center text-gray-500">
            No recent customers
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
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  customers: Customer[] = [];
  orders: Order[] = [];
  
  // Derived data
  lowStockProducts: Product[] = [];
  recentOrders: Order[] = [];
  recentCustomers: Customer[] = [];
  completedOrders: Order[] = [];
  
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
      (data:any) => {
        this.customers = data;
        this.recentCustomers = this.customers.slice(0, 5);
      },
      (error:any) => {
        console.error('Error loading customers', error);
      }
    );
  }
  
  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        // Sort by date descending
        this.orders.sort((a, b) => {
          const dateA = new Date(a.orderDate || '');
          const dateB = new Date(b.orderDate || '');
          return dateB.getTime() - dateA.getTime();
        });
        
        this.recentOrders = this.orders.slice(0, 5);
        this.completedOrders = this.orders.filter(o => o.status === OrderStatus.DELIVERED);
      },
      (error) => {
        console.error('Error loading orders', error);
      }
    );
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
  
  getInitials(customer: Customer): string {
    return `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`;
  }
  
  calculateTotalRevenue(): number {
    return this.orders
      .filter(o => o.status !== OrderStatus.CANCELLED)
      .reduce((total, order) => total + (order.totalAmount || 0), 0);
  }
  
  calculateAverageOrderValue(): number {
    const completedOrders = this.orders.filter(o => o.status !== OrderStatus.CANCELLED);
    if (completedOrders.length === 0) return 0;
    
    const totalRevenue = completedOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
    return totalRevenue / completedOrders.length;
  }
}
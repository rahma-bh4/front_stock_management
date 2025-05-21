import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Order Management</h1>
        <a routerLink="/orders/new" class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i> Create New Order
        </a>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
          <div class="w-full md:w-1/3 mb-4 md:mb-0">
            <div class="relative">
              <input 
                type="text" 
                [(ngModel)]="searchTerm"
                (keyup)="applyFilter()"
                placeholder="Search orders..." 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <select 
              [(ngModel)]="statusFilter" 
              (change)="applyFilter()"
              class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">All Statuses</option>
              <option *ngFor="let status of orderStatuses" [value]="status">{{status}}</option>
            </select>
            
            <div class="relative">
              <input
                type="date"
                [(ngModel)]="startDate"
                (change)="applyFilter()"
                class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>
            
            <div class="relative">
              <input
                type="date"
                [(ngModel)]="endDate"
                (change)="applyFilter()"
                class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th class="py-3 px-6 text-left cursor-pointer" (click)="sortBy('id')">
                  Order ID
                  <i *ngIf="sortColumn === 'id'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-left">Customer</th>
                <th class="py-3 px-6 text-left cursor-pointer" (click)="sortBy('orderDate')">
                  Date
                  <i *ngIf="sortColumn === 'orderDate'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-center">Status</th>
                <th class="py-3 px-6 text-right cursor-pointer" (click)="sortBy('totalAmount')">
                  Total
                  <i *ngIf="sortColumn === 'totalAmount'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
              <tr *ngFor="let order of filteredOrders" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left whitespace-nowrap">
                  <a [routerLink]="['/orders', order.id]" class="font-medium text-blue-600 hover:underline">
                    #{{order.id}}
                  </a>
                </td>
                <td class="py-3 px-6 text-left">
                  <div class="font-medium">{{order.customerName || 'Customer #' + order.customerId}}</div>
                </td>
                <td class="py-3 px-6 text-left">
                  {{order.orderDate | date:'medium'}}
                </td>
                <td class="py-3 px-6 text-center">
                  <span [class]="getStatusBadgeClass(order.status)">
                    {{order.status}}
                  </span>
                </td>
                <td class="py-3 px-6 text-right">
                  {{order.totalAmount | currency}}
                </td>
                <td class="py-3 px-6 text-center">
                  <div class="flex item-center justify-center gap-2">
                    <a [routerLink]="['/orders', order.id]" class="text-blue-500 hover:text-blue-700">
                      <i class="fas fa-eye"></i>
                    </a>
                    <button *ngIf="order.status === 'PENDING'"
                            [routerLink]="['/orders/edit', order.id]" 
                            class="text-yellow-500 hover:text-yellow-700">
                      <i class="fas fa-edit"></i>
                    </button>
                    <div class="relative group">
                      <button class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                        <a [routerLink]="['/invoices/order', order.id]" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <i class="fas fa-file-invoice-dollar mr-2"></i> View Invoice
                        </a>
                        <button (click)="updateOrderStatus(order, getNextStatus(order.status))" 
                                *ngIf="getNextStatus(order.status)"
                                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <i class="fas fa-arrow-right mr-2"></i> Mark as {{getNextStatus(order.status)}}
                        </button>
                        <button (click)="confirmCancel(order)" 
                                *ngIf="order.status !== 'CANCELLED' && order.status !== 'DELIVERED'"
                                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                          <i class="fas fa-times mr-2"></i> Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              
              <!-- Empty state -->
              <tr *ngIf="filteredOrders.length === 0">
                <td colspan="6" class="py-6 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <i class="fas fa-shopping-cart text-4xl mb-2"></i>
                    <p>No orders found matching your criteria</p>
                    <button (click)="resetFilters()" class="mt-2 text-primary hover:underline">
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-between items-center mt-4">
          <div class="text-gray-600">
            Showing {{filteredOrders.length}} of {{orders.length}} orders
          </div>
          
          <div class="flex space-x-1">
            <button class="px-3 py-1 rounded border" [disabled]="currentPage === 1" (click)="goToPreviousPage()">
              <i class="fas fa-chevron-left"></i>
            </button>
            <ng-container *ngFor="let page of getPageNumbers()">
              <button class="px-3 py-1 rounded border" 
                     [class.bg-primary]="page === currentPage" 
                     [class.text-white]="page === currentPage" 
                     (click)="goToPage(page)">
                {{page}}
              </button>
            </ng-container>
            <button class="px-3 py-1 rounded border" [disabled]="currentPage === getTotalPages()" (click)="goToNextPage()">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i class="fas fa-shopping-cart text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Orders</div>
              <div class="text-xl font-bold">{{orders.length}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <i class="fas fa-clock text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Pending Orders</div>
              <div class="text-xl font-bold">{{getPendingOrdersCount()}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i class="fas fa-truck text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Shipped Orders</div>
              <div class="text-xl font-bold">{{getShippedOrdersCount()}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <i class="fas fa-dollar-sign text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Revenue</div>
              <div class="text-xl font-bold">{{calculateTotalRevenue() | currency}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Cancel Order Confirmation Modal -->
    <div *ngIf="showCancelModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg p-6 z-10 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Confirm Cancellation</h3>
        <p class="mb-6">Are you sure you want to cancel Order #{{orderToCancel?.id}}? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button 
            (click)="showCancelModal = false" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-100">
            No, Keep Order
          </button>
          <button 
            (click)="cancelOrder()" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
    }
    .focus-ring-primary {
      --tw-ring-color: rgba(63, 81, 181, 0.5);
    }
    .bg-primary {
      background-color: #3f51b5;
    }
    .text-primary {
      color: #3f51b5;
    }
  `]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  
  // Filters
  searchTerm: string = '';
  statusFilter: string = '';
  startDate: string = '';
  endDate: string = '';
  
  // Sorting
  sortColumn: string = 'orderDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  
  // Order statuses
  orderStatuses = Object.values(OrderStatus);
  
  // Modal
  showCancelModal: boolean = false;
  orderToCancel: Order | null = null;
  
  constructor(private orderService: OrderService) {}
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data;
        this.applyFilter();
      },
      (error) => {
        console.error('Error loading orders', error);
        // Implement proper error handling/notification
      }
    );
  }
  
  applyFilter(): void {
    let filtered = [...this.orders];
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o => 
        o.id?.toString().includes(term) || 
        (o.customerName && o.customerName.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(o => o.status === this.statusFilter as OrderStatus);
    }
    
    // Apply date range filter
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59); // End of day
      
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.orderDate!);
        return orderDate >= start;
      });
    } else if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59); // End of day
      
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.orderDate!);
        return orderDate <= end;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn as keyof Order];
      const bValue = b[this.sortColumn as keyof Order];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (this.sortColumn === 'orderDate') {
        return this.sortDirection === 'asc' 
          ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime() 
          : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return this.sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number) 
          : (bValue as number) - (aValue as number);
      }
    });
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredOrders = filtered.slice(startIndex, startIndex + this.pageSize);
  }
  
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.applyFilter();
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilter();
  }
  
  getStatusBadgeClass(status?: OrderStatus): string {
    if (!status) return 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded';
    
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded';
      case OrderStatus.SHIPPED:
        return 'bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded';
      default:
        return 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded';
    }
  }
  
  getNextStatus(currentStatus?: OrderStatus): OrderStatus | null {
    if (!currentStatus) return null;
    
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return OrderStatus.PROCESSING;
      case OrderStatus.PROCESSING:
        return OrderStatus.SHIPPED;
      case OrderStatus.SHIPPED:
        return OrderStatus.DELIVERED;
      default:
        return null;
    }
  }
  
  updateOrderStatus(order: Order, newStatus: OrderStatus | null): void {
    if (!order.id || !newStatus) return;
    
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe(
      (updatedOrder) => {
        // Update the order in the list
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.applyFilter();
        }
        // Show success notification
      },
      (error) => {
        console.error('Error updating order status', error);
        // Show error notification
      }
    );
  }
  
  confirmCancel(order: Order): void {
    this.orderToCancel = order;
    this.showCancelModal = true;
  }
  
  cancelOrder(): void {
    if (!this.orderToCancel?.id) return;
    
    this.updateOrderStatus(this.orderToCancel, OrderStatus.CANCELLED);
    this.showCancelModal = false;
    this.orderToCancel = null;
  }
  
  // Stats methods
  getPendingOrdersCount(): number {
    return this.orders.filter(o => o.status === OrderStatus.PENDING).length;
  }
  
  getShippedOrdersCount(): number {
    return this.orders.filter(o => o.status === OrderStatus.SHIPPED).length;
  }
  
  calculateTotalRevenue(): number {
    return this.orders
      .filter(o => o.status !== OrderStatus.CANCELLED)
      .reduce((total, order) => total + (order.totalAmount || 0), 0);
  }
  
  // Pagination methods
  getTotalPages(): number {
    return Math.ceil(this.orders.length / this.pageSize);
  }
  
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages = [];
    
    // Show at most 5 page numbers
    let startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.applyFilter();
    }
  }
  
  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.applyFilter();
    }
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilter();
    }
  }
}
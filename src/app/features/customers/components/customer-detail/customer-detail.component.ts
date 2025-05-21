import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { OrderService } from '../../../orders/services/order.service';
import { Customer } from '../../models/customer.model';
import { Order } from '../../../orders/models/order.model';
import { CustomerService } from '../../models/customers/services/customer.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [CustomerService, OrderService],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6 flex items-center">
        <button (click)="goBack()" class="text-gray-600 mr-4">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Customer Details</h1>
      </div>

      <div *ngIf="customer" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Customer Profile Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="mr-4 bg-blue-100 text-blue-800 font-bold rounded-full h-14 w-14 flex items-center justify-center text-lg">
              {{getInitials(customer)}}
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">{{customer.firstName}} {{customer.lastName}}</h2>
              <p class="text-gray-600">Customer #{{customer.id}}</p>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4 mt-4">
            <div class="grid grid-cols-1 gap-3">
              <div>
                <div class="text-sm text-gray-500">Email</div>
                <div class="font-medium">
                  <a href="mailto:{{customer.email}}" class="text-blue-600 hover:underline">
                    {{customer.email}}
                  </a>
                </div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500">Phone</div>
                <div class="font-medium">{{customer.phoneNumber || 'N/A'}}</div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500">Address</div>
                <div class="font-medium">
                  <div *ngIf="customer.address">{{customer.address}}</div>
                  <div *ngIf="customer.city || customer.postalCode">
                    {{customer.city}} {{customer.postalCode}}
                  </div>
                  <div *ngIf="customer.country">{{customer.country}}</div>
                  <div *ngIf="!customer.address && !customer.city && !customer.country">N/A</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex space-x-3">
            <a [routerLink]="['/customers/edit', customer.id]" class="btn btn-primary flex-1 text-center">
              <i class="fas fa-edit mr-2"></i> Edit
            </a>
            <button (click)="confirmDelete()" class="btn btn-danger flex-1">
              <i class="fas fa-trash mr-2"></i> Delete
            </button>
          </div>
        </div>
        
        <!-- Orders and Stats -->
        <div class="md:col-span-2">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow-md p-4">
              <div class="text-sm text-gray-500">Total Orders</div>
              <div class="text-xl font-bold">{{customerOrders.length}}</div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-4">
              <div class="text-sm text-gray-500">Total Spent</div>
              <div class="text-xl font-bold">{{calculateTotalSpent() | currency}}</div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-4">
              <div class="text-sm text-gray-500">Last Order</div>
              <div class="text-xl font-bold">{{getLastOrderDate() | date:'shortDate'}}</div>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800">Recent Orders</h3>
              <a routerLink="/orders/new" [queryParams]="{customerId: customer.id}" class="text-primary hover:underline text-sm">
                <i class="fas fa-plus mr-1"></i> New Order
              </a>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th class="py-2 px-4 text-left">Order ID</th>
                    <th class="py-2 px-4 text-left">Date</th>
                    <th class="py-2 px-4 text-center">Status</th>
                    <th class="py-2 px-4 text-right">Total</th>
                    <th class="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                  <tr *ngFor="let order of customerOrders" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-2 px-4 text-left">
                      <a [routerLink]="['/orders', order.id]" class="font-medium text-blue-600 hover:underline">
                        #{{order.id}}
                      </a>
                    </td>
                    <td class="py-2 px-4 text-left">{{order.orderDate | date:'shortDate'}}</td>
                    <td class="py-2 px-4 text-center">
                      <span [class]="getStatusBadgeClass(order.status)" class="text-xs">
                        {{order.status}}
                      </span>
                    </td>
                    <td class="py-2 px-4 text-right font-medium">{{order.totalAmount | currency}}</td>
                    <td class="py-2 px-4 text-center">
                      <a [routerLink]="['/orders', order.id]" class="text-blue-500 hover:text-blue-700 mx-1">
                        <i class="fas fa-eye"></i>
                      </a>
                      <a [routerLink]="['/invoices/order', order.id]" class="text-green-500 hover:text-green-700 mx-1">
                        <i class="fas fa-file-invoice-dollar"></i>
                      </a>
                    </td>
                  </tr>
                  
                  <tr *ngIf="customerOrders.length === 0">
                    <td colspan="5" class="py-4 text-center text-gray-500">
                      No orders found for this customer
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="!customer" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p>Loading customer details...</p>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg p-6 z-10 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
        <p class="mb-6">Are you sure you want to delete <span class="font-bold">{{customer?.firstName}} {{customer?.lastName}}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button 
            (click)="showDeleteModal = false" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Cancel
          </button>
          <button 
            (click)="deleteCustomer()" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center;
    }
    .btn-danger {
      @apply bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center;
    }
    .border-primary {
      border-color: #3f51b5;
    }
    .text-primary {
      color: #3f51b5;
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  customerOrders: Order[] = [];
  showDeleteModal: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private orderService: OrderService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadCustomer(+params['id']);
      }
    });
  }
  
  loadCustomer(id: number): void {
    this.customerService.getCustomerById(id).subscribe(
      (customer:any) => {
        this.customer = customer;
        this.loadCustomerOrders(id);
      },
      (error:any) => {
        console.error('Error loading customer', error);
        // Show error notification
      }
    );
  }
  
  loadCustomerOrders(customerId: number): void {
    this.orderService.getOrdersByCustomerId(customerId).subscribe(
      (orders) => {
        this.customerOrders = orders;
        // Sort by date descending
        this.customerOrders.sort((a, b) => {
          const dateA = new Date(a.orderDate || '');
          const dateB = new Date(b.orderDate || '');
          return dateB.getTime() - dateA.getTime();
        });
      },
      (error) => {
        console.error('Error loading customer orders', error);
        // Show error notification
      }
    );
  }
  
  getInitials(customer: Customer): string {
    return `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`;
  }
  
  getStatusBadgeClass(status?: string): string {
    if (!status) return 'bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full';
    
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full';
      default:
        return 'bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full';
    }
  }
  
  calculateTotalSpent(): number {
    return this.customerOrders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((total, order) => total + (order.totalAmount || 0), 0);
  }
  
  getLastOrderDate(): Date | null {
    if (this.customerOrders.length === 0) return null;
    return new Date(this.customerOrders[0].orderDate || '');
  }
  
  confirmDelete(): void {
    this.showDeleteModal = true;
  }
  
  deleteCustomer(): void {
    if (!this.customer?.id) return;
    
    this.customerService.deleteCustomer(this.customer.id).subscribe(
      () => {
        this.showDeleteModal = false;
        // Show success notification
        this.router.navigate(['/customers']);
      },
      (error:any) => {
        console.error('Error deleting customer', error);
        // Show error notification
      }
    );
  }
  
  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
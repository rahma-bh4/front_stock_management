import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6 flex items-center">
        <button (click)="goBack()" class="text-gray-600 mr-4">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Order Details</h1>
      </div>

      <div *ngIf="order" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Order Summary Card -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h2 class="text-xl font-bold text-gray-800">Order #{{order.id}}</h2>
                <p class="text-gray-600">Placed on {{order.orderDate | date:'medium'}}</p>
              </div>
              <div>
                <span [class]="getStatusBadgeClass(order.status)" class="text-sm">
                  {{order.status}}
                </span>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <h3 class="font-medium text-gray-700 mb-2">Items</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                  <thead class="bg-gray-50 text-gray-600 text-xs">
                    <tr>
                      <th class="py-2 px-4 text-left">Product</th>
                      <th class="py-2 px-4 text-right">Price</th>
                      <th class="py-2 px-4 text-right">Quantity</th>
                      <th class="py-2 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 text-sm">
                    <tr *ngFor="let item of order.items" class="border-b border-gray-100">
                      <td class="py-3 px-4 text-left">
                        <div class="font-medium">{{item.productName}}</div>
                        <div class="text-xs text-gray-500">Product #{{item.productId}}</div>
                      </td>
                      <td class="py-3 px-4 text-right">
                        {{item.price | currency}}
                      </td>
                      <td class="py-3 px-4 text-right">
                        {{item.quantity}}
                      </td>
                      <td class="py-3 px-4 text-right font-medium">
                        {{item.subtotal | currency}}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="font-medium text-gray-700">
                    <tr class="border-t border-gray-200">
                      <td colspan="3" class="py-3 px-4 text-right">Total</td>
                      <td class="py-3 px-4 text-right">{{order.totalAmount | currency}}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          <!-- Invoice Card -->
          <div *ngIf="invoice" class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-bold text-gray-800">Invoice Details</h3>
              <a [routerLink]="['/invoices', invoice.id]" class="text-primary hover:underline">
                View Full Invoice
              </a>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Invoice Number</p>
                <p class="font-medium">{{invoice.invoiceNumber}}</p>
              </div>
              <div>
                <p class="text-gray-500">Issue Date</p>
                <p class="font-medium">{{invoice.issueDate | date:'mediumDate'}}</p>
              </div>
              <div>
                <p class="text-gray-500">Due Date</p>
                <p class="font-medium">{{invoice.dueDate | date:'mediumDate'}}</p>
              </div>
              <div>
                <p class="text-gray-500">Payment Status</p>
                <p class="font-medium">
                  <span [class]="getPaymentStatusClass(invoice.paymentStatus)">
                    {{invoice.paymentStatus}}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="md:col-span-1">
          <!-- Customer Information -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="font-bold text-gray-800 mb-4">Customer Information</h3>
            <div class="text-sm">
              <p class="font-medium">{{order.customerName}}</p>
              <p class="text-gray-600 mt-1">Customer #{{order.customerId}}</p>
              <a [routerLink]="['/customers', order.customerId]" class="text-primary hover:underline mt-2 inline-block">
                View Customer Details
              </a>
            </div>
          </div>
          
          <!-- Actions Card -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="font-bold text-gray-800 mb-4">Actions</h3>
            <div class="space-y-2">
              <button *ngIf="invoice && invoice.paymentStatus !== 'PAID'"
                     (click)="markAsPaid()" 
                     class="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center">
                <i class="fas fa-check mr-2"></i> Mark as Paid
              </button>
              
              <button *ngIf="getNextStatus(order.status)"
                     (click)="updateStatus(getNextStatus(order.status))" 
                     class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center">
                <i class="fas fa-arrow-right mr-2"></i> Mark as {{getNextStatus(order.status)}}
              </button>
              
              <button *ngIf="order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED"
                     (click)="cancelOrder()" 
                     class="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center">
                <i class="fas fa-times mr-2"></i> Cancel Order
              </button>
            </div>
          </div>
          
          <!-- Order Timeline -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="font-bold text-gray-800 mb-4">Order Timeline</h3>
            <div class="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-200">
              <div class="relative flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 shrink-0 z-10">
                  <i class="fas fa-check"></i>
                </div>
                <div class="ml-4">
                  <div class="font-medium">Order Placed</div>
                  <div class="text-xs text-gray-500">{{order.orderDate | date:'medium'}}</div>
                </div>
              </div>
              
              <div *ngIf="order.status !== OrderStatus.PENDING" class="relative flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 shrink-0 z-10">
                  <i class="fas fa-cog"></i>
                </div>
                <div class="ml-4">
                  <div class="font-medium">Processing</div>
                  <div class="text-xs text-gray-500">May 19, 2025</div>
                </div>
              </div>
              
              <div *ngIf="order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED" class="relative flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 shrink-0 z-10">
                  <i class="fas fa-truck"></i>
                </div>
                <div class="ml-4">
                  <div class="font-medium">Shipped</div>
                  <div class="text-xs text-gray-500">May 20, 2025</div>
                </div>
              </div>
              
              <div *ngIf="order.status === OrderStatus.DELIVERED" class="relative flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 shrink-0 z-10">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="ml-4">
                  <div class="font-medium">Delivered</div>
                  <div class="text-xs text-gray-500">May 21, 2025</div>
                </div>
              </div>
              
              <div *ngIf="order.status === OrderStatus.CANCELLED" class="relative flex items-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 shrink-0 z-10">
                  <i class="fas fa-times-circle"></i>
                </div>
                <div class="ml-4">
                  <div class="font-medium">Cancelled</div>
                  <div class="text-xs text-gray-500">May 19, 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="!order" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-primary {
      color: #3f51b5;
    }
    .border-primary {
      border-color: #3f51b5;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  invoice: Invoice | null = null;
  OrderStatus = OrderStatus;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadOrder(+params['id']);
      }
    });
  }
  
  loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe(
      (order) => {
        this.order = order;
        this.loadInvoice(id);
      },
      (error) => {
        console.error('Error loading order', error);
        // Show error notification
      }
    );
  }
  
  loadInvoice(orderId: number): void {
    this.orderService.getInvoiceByOrderId(orderId).subscribe(
      (invoice) => {
        this.invoice = invoice;
      },
      (error) => {
        console.error('Error loading invoice', error);
        // Not critical, just continue without invoice
      }
    );
  }
  
  getStatusBadgeClass(status?: OrderStatus): string {
    if (!status) return 'bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full';
    
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full';
      case OrderStatus.SHIPPED:
        return 'bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full';
      default:
        return 'bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full';
    }
  }
  
  getPaymentStatusClass(status?: string): string {
    if (!status) return '';
    
    switch (status) {
      case 'PAID':
        return 'text-green-600';
      case 'UNPAID':
        return 'text-red-600';
      case 'PARTIAL':
        return 'text-yellow-600';
      default:
        return '';
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
  
  updateStatus(newStatus: OrderStatus | null): void {
    if (!this.order?.id || !newStatus) return;
    
    this.orderService.updateOrderStatus(this.order.id, newStatus).subscribe(
      (updatedOrder) => {
        this.order = updatedOrder;
        // Show success notification
      },
      (error) => {
        console.error('Error updating order status', error);
        // Show error notification
      }
    );
  }
  
  cancelOrder(): void {
    if (!this.order?.id) return;
    
    this.updateStatus(OrderStatus.CANCELLED);
  }
  
  markAsPaid(): void {
    if (!this.invoice?.id) return;
    
    this.orderService.updateInvoicePaymentStatus(this.invoice.id, 'PAID').subscribe(
      (updatedInvoice) => {
        this.invoice = updatedInvoice;
        // Show success notification
      },
      (error) => {
        console.error('Error updating invoice payment status', error);
        // Show error notification
      }
    );
  }
  
  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
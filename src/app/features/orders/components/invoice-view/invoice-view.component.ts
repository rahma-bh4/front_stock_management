import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Invoice } from '../../models/invoice.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4 non-printable">
      <div class="mb-6 flex items-center">
        <button (click)="goBack()" class="text-gray-600 mr-4">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Invoice</h1>
        <div class="ml-auto">
          <button (click)="printInvoice()" class="btn btn-primary">
            <i class="fas fa-print mr-2"></i> Print
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="invoice && order" id="invoice-container" class="bg-white rounded-lg shadow-md p-8 mb-6 mx-auto" style="max-width: 800px;">
      <!-- Company Logo and Info -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <div class="text-2xl font-bold text-gray-800 mb-1">INVOICE</div>
          <div class="text-gray-600">#{{invoice.invoiceNumber}}</div>
        </div>
        <div class="text-right">
          <div class="font-bold text-lg text-gray-800">Stock Management System</div>
          <div class="text-gray-600">123 Business Street</div>
          <div class="text-gray-600">City, Country, 12345</div>
          <div class="text-gray-600">contact&#64;stockmanagementsystem.com</div>
        </div>
      </div>
      
      <!-- Customer Info and Invoice Details -->
      <div class="flex justify-between mb-8">
        <div>
          <div class="text-gray-600 mb-2">Bill To:</div>
          <div class="font-medium">{{order.customerName}}</div>
          <div class="text-gray-600">Customer #{{order.customerId}}</div>
        </div>
        <div class="text-right">
          <div class="grid grid-cols-2 gap-x-4 text-sm">
            <div class="text-gray-600">Invoice Date:</div>
            <div class="font-medium">{{invoice.issueDate | date:'mediumDate'}}</div>
            
            <div class="text-gray-600">Due Date:</div>
            <div class="font-medium">{{invoice.dueDate | date:'mediumDate'}}</div>
            
            <div class="text-gray-600">Status:</div>
            <div [class]="getPaymentStatusClass(invoice.paymentStatus)" class="font-medium">
              {{invoice.paymentStatus}}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Invoice Items Table -->
      <div class="border rounded-lg overflow-hidden mb-8">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 text-gray-600">
            <tr>
              <th class="py-3 px-4 text-left">Item</th>
              <th class="py-3 px-4 text-right">Quantity</th>
              <th class="py-3 px-4 text-right">Price</th>
              <th class="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of order.items" class="border-t border-gray-200">
              <td class="py-3 px-4 text-left">
                <div class="font-medium">{{item.productName}}</div>
                <div class="text-xs text-gray-500">Product #{{item.productId}}</div>
              </td>
              <td class="py-3 px-4 text-right">{{item.quantity}}</td>
              <td class="py-3 px-4 text-right">{{item.price | currency}}</td>
              <td class="py-3 px-4 text-right">{{item.subtotal | currency}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Totals Section -->
      <div class="flex justify-end mb-8">
        <div class="w-72">
          <div class="flex justify-between py-2">
            <div class="text-gray-600">Subtotal:</div>
            <div class="font-medium">{{order.totalAmount | currency}}</div>
          </div>
          <div class="flex justify-between py-2">
            <div class="text-gray-600">Tax (15%):</div>
            <div class="font-medium">{{invoice.taxAmount | currency}}</div>
          </div>
          <div class="flex justify-between py-2 border-t border-gray-200 text-lg font-bold">
            <div>Total:</div>
            <div>{{calculateTotal() | currency}}</div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="border-t border-gray-200 pt-8">
        <div class="text-center text-gray-600 text-sm mb-2">
          Thank you for your business!
        </div>
        <div class="text-center text-gray-500 text-xs">
          If you have any questions about this invoice, please contact us at support&#64;stockmanagementsystem.com
        </div>
      </div>
    </div>
      
    <!-- Loading State -->
    <div *ngIf="!invoice || !order" class="bg-white rounded-lg shadow-md p-6 text-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p>Loading invoice...</p>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
    }
    .border-primary {
      border-color: #3f51b5;
    }
    
    @media print {
      /* Hide non-printable elements */
      .non-printable,
      button,
      .btn {
        display: none !important;
      }
      
      /* Reset page margins */
      @page {
        margin: 0.5in;
      }
      
      /* Make sure invoice container takes full width */
      #invoice-container {
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      
      /* Ensure proper text colors for printing */
      body {
        color: black !important;
        background: white !important;
      }
      
      /* Make sure all text is black */
      * {
        color: black !important;
        background: white !important;
      }
      
      /* Preserve table borders for printing */
      table, th, td {
        border-color: #000 !important;
      }
      
      /* Ensure good contrast */
      .text-gray-600,
      .text-gray-500 {
        color: #666 !important;
      }
      
      .font-bold,
      .font-medium {
        font-weight: bold !important;
      }
    }
  `]
})
export class InvoiceViewComponent implements OnInit {
  invoice: Invoice | null = null;
  order: Order | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadInvoice(+params['id']);
      } else if (params['orderId']) {
        this.loadInvoiceByOrderId(+params['orderId']);
      }
    });
  }
  
  loadInvoice(id: number): void {
    this.orderService.getInvoiceById(id).subscribe(
      (invoice) => {
        this.invoice = invoice;
        this.loadOrder(invoice.orderId);
      },
      (error) => {
        console.error('Error loading invoice', error);
        // Show error notification
      }
    );
  }
  
  loadInvoiceByOrderId(orderId: number): void {
    this.orderService.getInvoiceByOrderId(orderId).subscribe(
      (invoice) => {
        this.invoice = invoice;
        this.loadOrder(orderId);
      },
      (error) => {
        console.error('Error loading invoice', error);
        // Show error notification
      }
    );
  }
  
  loadOrder(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe(
      (order) => {
        this.order = order;
      },
      (error) => {
        console.error('Error loading order', error);
        // Show error notification
      }
    );
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
  
  printInvoice(): void {
    // Simple and reliable print function
    if (this.invoice && this.order) {
      // Give a small delay to ensure the DOM is ready
      setTimeout(() => {
        window.print();
      }, 100);
    } else {
      console.error('Cannot print: Invoice or Order data is not loaded');
      alert('Please wait for the invoice to load completely before printing.');
    }
  }
  
  calculateTotal(): number {
    if (!this.order || !this.invoice) return 0;
    
    const subtotal = this.order.totalAmount || 0;
    const taxAmount = this.invoice.taxAmount || 0;
    
    return subtotal + taxAmount;
  }
  
  goBack(): void {
    this.router.navigate(['/orders', this.order?.id]);
  }
}
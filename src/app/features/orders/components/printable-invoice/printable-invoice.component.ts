// src/app/features/orders/components/printable-invoice/printable-invoice.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Invoice } from '../../models/invoice.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-printable-invoice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="print-container p-8" *ngIf="invoice && order">
      <!-- Company Logo and Header -->
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
            <div class="font-medium">{{invoice.paymentStatus}}</div>
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
            <div>{{invoice.totalAmount | currency}}</div>
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

    <!-- Auto print script -->
    <script *ngIf="invoice && order">
      window.onload = function() {
        window.print();
      }
    </script>
  `,
  styles: [`
    .print-container {
      max-width: 800px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
        font-size: 12pt;
      }
      
      .print-container {
        width: 100%;
        max-width: 100%;
        padding: 15mm;
      }
    }
  `]
})
export class PrintableInvoiceComponent implements OnInit {
  invoice: Invoice | null = null;
  order: Order | null = null;
  
  constructor(
    private route: ActivatedRoute,
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
      }
    );
  }
  
  loadOrder(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe(
      (order) => {
        this.order = order;
        // Auto-print once everything is loaded
        setTimeout(() => {
          window.print();
        }, 500);
      },
      (error) => {
        console.error('Error loading order', error);
      }
    );
  }
}
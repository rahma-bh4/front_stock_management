// src/app/features/orders/components/order-form/order-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../../customers/models/customers/services/customer.service';
import { ProductService } from '../../products/services/product.service';
import { Customer } from '../../customers/models/customer.model';
import { Product } from '../../products/models/product.model';
import { Order, OrderItem, OrderStatus } from '../models/order.model';


@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6 flex items-center">
        <button (click)="goBack()" class="text-gray-600 mr-4">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">{{isEditMode ? 'Edit' : 'Create New'}} Order</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
          <!-- Customer Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Customer <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select 
                formControlName="customerId"
                (change)="onCustomerChange()"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                [class.border-red-500]="isFieldInvalid('customerId')"
              >
                <option [value]="null" disabled>Select a customer</option>
                <option *ngFor="let customer of customers" [value]="customer.id">
                  {{customer.firstName}} {{customer.lastName}} ({{customer.email}})
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
            <div *ngIf="isFieldInvalid('customerId')" class="mt-1 text-sm text-red-500">
              Please select a customer
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">
                Order Items <span class="text-red-500">*</span>
              </label>
              <button 
                type="button" 
                (click)="addItem()"
                class="text-primary hover:underline text-sm flex items-center"
              >
                <i class="fas fa-plus mr-1"></i> Add Item
              </button>
            </div>
            
            <div formArrayName="items">
              <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" 
                   class="p-4 border rounded-md mb-3 relative">
                <button 
                  type="button" 
                  (click)="removeItem(i)"
                  class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <i class="fas fa-times"></i>
                </button>
                
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div class="md:col-span-5">
                    <label class="block text-xs font-medium text-gray-500 mb-1">
                      Product <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <select 
                        formControlName="productId"
                        (change)="onProductChange(i)"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                        [class.border-red-500]="isItemFieldInvalid(i, 'productId')"
                      >
                        <option [value]="null" disabled>Select a product</option>
                        <option *ngFor="let product of products" [value]="product.id" [disabled]="product.quantity <= 0">
                          {{product.name}} {{product.quantity <= 0 ? '(Out of stock)' : ''}}
                        </option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i class="fas fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-500 mb-1">
                      Quantity <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      formControlName="quantity"
                      min="1"
                      (change)="updateItemSubtotal(i)"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      [class.border-red-500]="isItemFieldInvalid(i, 'quantity')"
                    >
                  </div>
                  
                  <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-gray-500 mb-1">
                      Price <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        formControlName="price"
                        step="0.01"
                        min="0"
                        (change)="updateItemSubtotal(i)"
                        class="w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        [class.border-red-500]="isItemFieldInvalid(i, 'price')"
                      >
                    </div>
                  </div>
                  
                  <div class="md:col-span-3">
                    <label class="block text-xs font-medium text-gray-500 mb-1">
                      Subtotal
                    </label>
                    <div class="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
                      {{calculateItemSubtotal(i) | currency}}
                    </div>
                  </div>
                </div>
                
                <div *ngIf="isItemFieldInvalid(i, 'productId')" class="mt-1 text-sm text-red-500">
                  Please select a product
                </div>
                <div *ngIf="isItemFieldInvalid(i, 'quantity')" class="mt-1 text-sm text-red-500">
                  Quantity must be at least 1
                </div>
                <div *ngIf="isItemFieldInvalid(i, 'price')" class="mt-1 text-sm text-red-500">
                  Price is required
                </div>
              </div>
            </div>
            
            <div *ngIf="items.length === 0" class="p-8 border border-dashed rounded-md text-center text-gray-500">
              <p>No items added to this order yet</p>
              <button 
                type="button" 
                (click)="addItem()"
                class="mt-2 text-primary hover:underline"
              >
                Add your first item
              </button>
            </div>
            
            <div *ngIf="orderForm.errors?.['noItems']" class="mt-1 text-sm text-red-500">
              Order must have at least one item
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 class="font-medium text-gray-700 mb-2">Order Summary</h3>
            <div class="flex justify-between py-2 border-t">
              <span>Total</span>
              <span class="font-bold">{{calculateTotal() | currency}}</span>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end space-x-3">
            <button 
              type="button" 
              (click)="goBack()" 
              class="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="orderForm.invalid || isSubmitting"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
              <i *ngIf="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{isEditMode ? 'Update' : 'Create'}} Order
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .bg-primary {
      background-color: #3f51b5;
    }
    .focus-ring-primary {
      --tw-ring-color: rgba(63, 81, 181, 0.5);
    }
    .text-primary {
      color: #3f51b5;
    }
  `]
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  isEditMode: boolean = false;
  orderId?: number;
  isSubmitting: boolean = false;
  
  // Related data
  customers: Customer[] = [];
  products: Product[] = [];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    this.loadProducts();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.orderId = +params['id'];
        this.loadOrder(this.orderId);
      }
    });
    
    // Handle direct customer selection from URL (e.g., from customer detail page)
    this.route.queryParams.subscribe(params => {
      if (params['customerId'] && !this.isEditMode) {
        const customerId = +params['customerId'];
        this.orderForm.patchValue({ customerId: customerId });
      }
    });
  }
  
  initForm(): void {
    this.orderForm = this.fb.group({
      customerId: [null, Validators.required],
      items: this.fb.array([])
    }, { validators: this.orderValidator });
  }
  
  orderValidator(form: FormGroup): {[key: string]: any} | null {
    const items = form.get('items') as FormArray;
    if (items.length === 0) {
      return { noItems: true };
    }
    return null;
  }
  
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  
  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }
  
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateTotalAmount();
  }
  
  createItemFormGroup(item?: OrderItem): FormGroup {
    return this.fb.group({
      id: [item?.id],
      productId: [item?.productId || null, Validators.required],
      productName: [item?.productName || ''],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      price: [item?.price || 0, [Validators.required, Validators.min(0)]],
      subtotal: [item?.subtotal || 0]
    });
  }
  
  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data:any) => {
        this.customers = data;
      },
      (error:any) => {
        console.error('Error loading customers', error);
        // Show error notification
      }
    );
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products', error);
        // Show error notification
      }
    );
  }
  
  loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe(
      (order) => {
        // Set customer ID
        this.orderForm.patchValue({
          customerId: order.customerId
        });
        
        // Add items
        this.items.clear();
        if (order.items && order.items.length > 0) {
          order.items.forEach(item => {
            this.items.push(this.createItemFormGroup(item));
          });
        }
      },
      (error) => {
        console.error('Error loading order', error);
        // Show error notification
      }
    );
  }
  
  onCustomerChange(): void {
    // Additional logic if needed when customer changes
  }
  
  onProductChange(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const productId = itemGroup.get('productId')?.value;
    
    if (productId) {
      const product = this.products.find(p => p.id === +productId);
      if (product) {
        itemGroup.patchValue({
          productName: product.name,
          price: product.price
        });
        this.updateItemSubtotal(index);
      }
    }
  }
  
  updateItemSubtotal(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const quantity = itemGroup.get('quantity')?.value || 0;
    const price = itemGroup.get('price')?.value || 0;
    const subtotal = quantity * price;
    
    itemGroup.patchValue({
      subtotal: subtotal
    });
    
    this.updateTotalAmount();
  }
  
  calculateItemSubtotal(index: number): number {
    const itemGroup = this.items.at(index) as FormGroup;
    const quantity = itemGroup.get('quantity')?.value || 0;
    const price = itemGroup.get('price')?.value || 0;
    return quantity * price;
  }
  
  calculateTotal(): number {
    return this.items.controls.reduce((total, control) => {
      const itemGroup = control as FormGroup;
      return total + (itemGroup.get('subtotal')?.value || 0);
    }, 0);
  }
  
  updateTotalAmount(): void {
    // Just trigger change detection, the total is computed on-the-fly
  }
  
  onSubmit(): void {
    if (this.orderForm.invalid) return;
    
    this.isSubmitting = true;
    
    const orderData: Order = {
      ...this.orderForm.value,
      totalAmount: this.calculateTotal(),
      status: OrderStatus.PENDING
    };
    
    if (this.isEditMode && this.orderId) {
      this.orderService.updateOrder(this.orderId, orderData).subscribe(
        this.handleSuccess.bind(this),
        this.handleError.bind(this)
      );
    } else {
      this.orderService.createOrder(orderData).subscribe(
        this.handleSuccess.bind(this),
        this.handleError.bind(this)
      );
    }
  }
  
  handleSuccess(): void {
    this.isSubmitting = false;
    // Show success notification
    this.goBack();
  }
  
  handleError(error: any): void {
    console.error('Error saving order', error);
    this.isSubmitting = false;
    // Show error notification
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  isItemFieldInvalid(itemIndex: number, fieldName: string): boolean {
    const itemGroup = this.items.at(itemIndex) as FormGroup;
    const field = itemGroup.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
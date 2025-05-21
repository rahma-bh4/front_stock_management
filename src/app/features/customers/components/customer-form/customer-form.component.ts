import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../models/customers/services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [CustomerService],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6 flex items-center">
        <button (click)="goBack()" class="text-gray-600 mr-4">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">{{isEditMode ? 'Edit' : 'Add New'}} Customer</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <div class="form-group">
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="firstName" 
                  formControlName="firstName"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="isFieldInvalid('firstName')"
                >
                <div *ngIf="isFieldInvalid('firstName')" class="mt-1 text-sm text-red-500">
                  First name is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="lastName" 
                  formControlName="lastName"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="isFieldInvalid('lastName')"
                >
                <div *ngIf="isFieldInvalid('lastName')" class="mt-1 text-sm text-red-500">
                  Last name is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="isFieldInvalid('email')"
                >
                <div *ngIf="isFieldInvalid('email')" class="mt-1 text-sm text-red-500">
                  <span *ngIf="customerForm.get('email')?.hasError('required')">
                    Email is required
                  </span>
                  <span *ngIf="customerForm.get('email')?.hasError('email')">
                    Please enter a valid email address
                  </span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  formControlName="phoneNumber"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="form-group">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input 
                  type="text" 
                  id="address" 
                  formControlName="address"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
              </div>
              
              <div class="form-group">
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input 
                  type="text" 
                  id="city" 
                  formControlName="city"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input 
                    type="text" 
                    id="country" 
                    formControlName="country"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                </div>
                
                <div class="form-group">
                  <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input 
                    type="text" 
                    id="postalCode" 
                    formControlName="postalCode"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                </div>
              </div>
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
              [disabled]="customerForm.invalid || isSubmitting"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
              <i *ngIf="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{isEditMode ? 'Update' : 'Create'}} Customer
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
  `]
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEditMode: boolean = false;
  customerId?: number;
  isSubmitting: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(CustomerService) private customerService: CustomerService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.customerId = +params['id'];
        this.loadCustomer(this.customerId);
      }
    });
  }
  
  initForm(): void {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      city: [''],
      country: [''],
      postalCode: ['']
    });
  }
  
  loadCustomer(id: number): void {
    this.customerService.getCustomerById(id).subscribe(
      (customer:any) => {
        this.customerForm.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          city: customer.city,
          country: customer.country,
          postalCode: customer.postalCode
        });
      },
      (error:any) => {
        console.error('Error loading customer', error);
        // Show error notification
      }
    );
  }
  
  onSubmit(): void {
    if (this.customerForm.invalid) return;
    
    this.isSubmitting = true;
    const customerData: Customer = this.customerForm.value;
    
    if (this.isEditMode && this.customerId) {
      this.customerService.updateCustomer(this.customerId, customerData).subscribe(
        this.handleSuccess.bind(this),
        this.handleError.bind(this)
      );
    } else {
      this.customerService.createCustomer(customerData).subscribe(
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
    console.error('Error saving customer', error);
    this.isSubmitting = false;
    // Show error notification
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
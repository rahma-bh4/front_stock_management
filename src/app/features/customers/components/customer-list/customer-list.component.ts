import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../models/customers/services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  providers: [CustomerService],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Customer Management</h1>
        <a routerLink="/customers/new" class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i> Add New Customer
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
                placeholder="Search customers..." 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th class="py-3 px-6 text-left cursor-pointer" (click)="sortBy('lastName')">
                  Name
                  <i *ngIf="sortColumn === 'lastName'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-left cursor-pointer" (click)="sortBy('email')">
                  Email
                  <i *ngIf="sortColumn === 'email'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-left">Phone Number</th>
                <th class="py-3 px-6 text-left">Location</th>
                <th class="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
              <tr *ngFor="let customer of filteredCustomers" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="mr-2 bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center">
                      {{getInitials(customer)}}
                    </div>
                    <div>
                      <div class="font-medium">{{customer.firstName}} {{customer.lastName}}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-6 text-left">
                  <a href="mailto:{{customer.email}}" class="text-blue-600 hover:underline">
                    {{customer.email}}
                  </a>
                </td>
                <td class="py-3 px-6 text-left">
                  {{customer.phoneNumber || 'N/A'}}
                </td>
                <td class="py-3 px-6 text-left">
                  <span *ngIf="customer.city && customer.country">
                    {{customer.city}}, {{customer.country}}
                  </span>
                  <span *ngIf="!customer.city || !customer.country">
                    N/A
                  </span>
                </td>
                <td class="py-3 px-6 text-center">
                  <div class="flex item-center justify-center gap-2">
                    <a [routerLink]="['/customers', customer.id]" class="text-blue-500 hover:text-blue-700">
                      <i class="fas fa-eye"></i>
                    </a>
                    <a [routerLink]="['/customers/edit', customer.id]" class="text-yellow-500 hover:text-yellow-700">
                      <i class="fas fa-edit"></i>
                    </a>
                    <button (click)="confirmDelete(customer)" class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty state -->
              <tr *ngIf="filteredCustomers.length === 0">
                <td colspan="5" class="py-6 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <i class="fas fa-users text-4xl mb-2"></i>
                    <p>No customers found matching your criteria</p>
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
            Showing {{filteredCustomers.length}} of {{customers.length}} customers
          </div>
          
          <div class="flex space-x-1">
            <button class="px-3 py-1 rounded border" [disabled]="currentPage === 1"
                    (click)="goToPreviousPage()">
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
            <button class="px-3 py-1 rounded border" 
                    [disabled]="currentPage === getTotalPages()"
                    (click)="goToNextPage()">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i class="fas fa-users text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Customers</div>
              <div class="text-xl font-bold">{{customers.length}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i class="fas fa-chart-line text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">New Customers (This Month)</div>
              <div class="text-xl font-bold">{{getNewCustomersCount()}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg p-6 z-10 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
        <p class="mb-6">Are you sure you want to delete customer <span class="font-bold">{{customerToDelete?.firstName}} {{customerToDelete?.lastName}}</span>? This action cannot be undone.</p>
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
      @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all;
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
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  
  // Filters
  searchTerm: string = '';
  
  // Sorting
  sortColumn: string = 'lastName';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  
  // Modal
  showDeleteModal: boolean = false;
  customerToDelete: Customer | null = null;
  
  constructor(private customerService: CustomerService) {}
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  
  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data:any) => {
        this.customers = data;
        this.applyFilter();
      },
      (error:any) => {
        console.error('Error loading customers', error);
        // Implement proper error handling/notification
      }
    );
  }
  
  applyFilter(): void {
    let filtered = [...this.customers];
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.firstName.toLowerCase().includes(term) || 
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.phoneNumber && c.phoneNumber.includes(term)) ||
        (c.city && c.city.toLowerCase().includes(term)) ||
        (c.country && c.country.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn as keyof Customer];
      const bValue = b[this.sortColumn as keyof Customer];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
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
    this.filteredCustomers = filtered.slice(startIndex, startIndex + this.pageSize);
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
    this.currentPage = 1;
    this.applyFilter();
  }
  
  getInitials(customer: Customer): string {
    return `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`;
  }
  
  // Pagination methods
  getTotalPages(): number {
    return Math.ceil(this.customers.length / this.pageSize);
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
  
  // Stats methods
  getNewCustomersCount(): number {
    // In a real app, you would filter customers created this month
    // For demo purposes, we'll just return a random number
    return Math.floor(Math.random() * 10) + 1;
  }
  
  // Delete methods
  confirmDelete(customer: Customer): void {
    this.customerToDelete = customer;
    this.showDeleteModal = true;
  }
  
  deleteCustomer(): void {
    if (!this.customerToDelete?.id) return;
    
    this.customerService.deleteCustomer(this.customerToDelete.id).subscribe(
      () => {
        this.customers = this.customers.filter(c => c.id !== this.customerToDelete?.id);
        this.applyFilter();
        this.showDeleteModal = false;
        this.customerToDelete = null;
        // Show success notification
      },
      (error:any) => {
        console.error('Error deleting customer', error);
        // Show error notification
      }
    );
  }
}
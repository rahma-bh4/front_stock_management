import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Product Management</h1>
        <a routerLink="/products/new" class="btn btn-primary">
          <i class="fas fa-plus mr-2"></i> Add New Product
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
                placeholder="Search products..." 
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <select 
              [(ngModel)]="categoryFilter" 
              (change)="applyFilter()"
              class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">{{category}}</option>
            </select>
            
            <button 
              class="btn btn-outline-secondary" 
              [class.active]="showLowStock" 
              (click)="toggleLowStock()">
              <i class="fas fa-exclamation-circle mr-1"></i> Low Stock
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th class="py-3 px-6 text-left">Image</th>
                <th class="py-3 px-6 text-left cursor-pointer" (click)="sortBy('name')">
                  Product Name 
                  <i *ngIf="sortColumn === 'name'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-left">Category</th>
                <th class="py-3 px-6 text-right cursor-pointer" (click)="sortBy('price')">
                  Price
                  <i *ngIf="sortColumn === 'price'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-right cursor-pointer" (click)="sortBy('quantity')">
                  Stock 
                  <i *ngIf="sortColumn === 'quantity'" 
                     [class]="sortDirection === 'asc' ? 'fas fa-sort-up ml-1' : 'fas fa-sort-down ml-1'"></i>
                </th>
                <th class="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
              <tr *ngFor="let product of filteredProducts" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-6 text-left whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-12 h-12 flex-shrink-0 mr-2">
                      <img [src]="product.imageUrl || 'assets/images/product-placeholder.png'" 
                           [alt]="product.name"
                           class="w-12 h-12 rounded-md object-cover">
                    </div>
                  </div>
                </td>
                <td class="py-3 px-6 text-left">
                  <div class="font-medium">{{product.name}}</div>
                  <div class="text-xs text-gray-500">{{product.barcode || 'No barcode'}}</div>
                </td>
                <td class="py-3 px-6 text-left">
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {{product.category || 'Uncategorized'}}
                  </span>
                </td>
                <td class="py-3 px-6 text-right">
                  {{product.price | currency}}
                </td>
                <td class="py-3 px-6 text-right">
                  <span [class]="product.quantity <= 5 ? 'text-red-600 font-medium' : ''">
                    {{product.quantity}}
                  </span>
                </td>
                <td class="py-3 px-6 text-center">
                  <div class="flex item-center justify-center gap-2">
                    <a [routerLink]="['/products', product.id]" class="text-blue-500 hover:text-blue-700">
                      <i class="fas fa-eye"></i>
                    </a>
                    <a [routerLink]="['/products/edit', product.id]" class="text-yellow-500 hover:text-yellow-700">
                      <i class="fas fa-edit"></i>
                    </a>
                    <button (click)="confirmDelete(product)" class="text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty state -->
              <tr *ngIf="filteredProducts.length === 0">
                <td colspan="6" class="py-6 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <i class="fas fa-box-open text-4xl mb-2"></i>
                    <p>No products found matching your criteria</p>
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
            Showing {{filteredProducts.length}} of {{products.length}} products
          </div>
          
          <div class="flex space-x-1">
            <button class="px-3 py-1 rounded border" [disabled]="currentPage === 1">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="px-3 py-1 rounded border bg-primary text-white">1</button>
            <button class="px-3 py-1 rounded border">2</button>
            <button class="px-3 py-1 rounded border">3</button>
            <button class="px-3 py-1 rounded border" [disabled]="true">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i class="fas fa-boxes text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Total Products</div>
              <div class="text-xl font-bold">{{products.length}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i class="fas fa-dollar-sign text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Inventory Value</div>
              <div class="text-xl font-bold">{{calculateInventoryValue() | currency}}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <i class="fas fa-exclamation-triangle text-xl"></i>
            </div>
            <div>
              <div class="text-sm text-gray-500">Low Stock Items</div>
              <div class="text-xl font-bold">{{lowStockCount}}</div>
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
        <p class="mb-6">Are you sure you want to delete product <span class="font-bold">{{productToDelete?.name}}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button 
            (click)="showDeleteModal = false" 
            class="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Cancel
          </button>
          <button 
            (click)="deleteProduct()" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Filters
  searchTerm: string = '';
  categoryFilter: string = '';
  showLowStock: boolean = false;
  
  // Sorting
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  
  // Stats
  lowStockCount: number = 0;
  
  // Categories
  categories: string[] = [];
  
  // Modal
  showDeleteModal: boolean = false;
  productToDelete: Product | null = null;
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.extractCategories();
        this.applyFilter();
        this.countLowStockItems();
      },
      (error) => {
        console.error('Error loading products', error);
        // Implement proper error handling/notification
      }
    );
  }
  
  applyFilter(): void {
    let filtered = [...this.products];
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term) ||
        p.barcode?.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(p => p.category === this.categoryFilter);
    }
    
    // Apply low stock filter
    if (this.showLowStock) {
      filtered = filtered.filter(p => p.quantity <= 5);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn as keyof Product];
      const bValue = b[this.sortColumn as keyof Product];
      
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
    
    this.filteredProducts = filtered;
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
  
  toggleLowStock(): void {
    this.showLowStock = !this.showLowStock;
    this.applyFilter();
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.showLowStock = false;
    this.applyFilter();
  }
  
  countLowStockItems(): void {
    this.lowStockCount = this.products.filter(p => p.quantity <= 5).length;
  }
  
  calculateInventoryValue(): number {
    return this.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }
  
  extractCategories(): void {
    const uniqueCategories = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    this.categories = Array.from(uniqueCategories);
  }
  
  confirmDelete(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }
  
  deleteProduct(): void {
    if (!this.productToDelete?.id) return;
    
    this.productService.deleteProduct(this.productToDelete.id).subscribe(
      () => {
        this.products = this.products.filter(p => p.id !== this.productToDelete?.id);
        this.applyFilter();
        this.showDeleteModal = false;
        this.productToDelete = null;
        this.countLowStockItems();
        // Show success notification
      },
      (error) => {
        console.error('Error deleting product', error);
        // Show error notification
      }
    );
  }
}
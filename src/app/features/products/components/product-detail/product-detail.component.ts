import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6 flex items-center">
        <button (click)="goBack()" class="text-gray-600 mr-4">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Product Details</h1>
      </div>

      <div *ngIf="product" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Product Image -->
        <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div class="mb-4 w-full h-64 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
           <img 
  [src]="product.imageUrl ? (apiBaseUrl + product.imageUrl) : 'assets/images/product-placeholder.png'" 
  [alt]="product.name"
  class="max-w-full max-h-full object-contain"
>
          </div>
          
          <div class="mt-6 flex space-x-3 w-full">
            <a [routerLink]="['/products/edit', product.id]" class="btn btn-primary flex-1 text-center">
              <i class="fas fa-edit mr-2"></i> Edit
            </a>
            <button (click)="confirmDelete()" class="btn btn-danger flex-1">
              <i class="fas fa-trash mr-2"></i> Delete
            </button>
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">{{product.name}}</h2>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div class="text-sm text-gray-500">Price</div>
                <div class="text-lg font-bold">{{product.price | currency}}</div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500">Stock</div>
                <div class="text-lg font-bold" [class.text-red-600]="product.quantity <= 5">
                  {{product.quantity}}
                </div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500">Category</div>
                <div class="font-medium">
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {{product.category || 'Uncategorized'}}
                  </span>
                </div>
              </div>
              
              <div>
                <div class="text-sm text-gray-500">Barcode</div>
                <div class="font-medium">{{product.barcode || 'N/A'}}</div>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="text-sm text-gray-500 mb-1">Description</div>
              <div class="text-gray-700">
                {{product.description || 'No description available'}}
              </div>
            </div>
          </div>
          
          <!-- Additional product details, stats, etc. can be added here -->
        </div>
      </div>
      
      <!-- Loading State -->
      <div *ngIf="!product" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg p-6 z-10 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
        <p class="mb-6">Are you sure you want to delete <span class="font-bold">{{product?.name}}</span>? This action cannot be undone.</p>
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
  styles: [`
    .btn-primary {
      @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center;
    }
    .btn-danger {
      @apply bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  showDeleteModal: boolean = false;
    apiBaseUrl = environment.fileServerUrl;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProduct(+params['id']);
      }
    });
  }
  
  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product:any) => {
        this.product = product;
      },
      (error:any) => {
        console.error('Error loading product', error);
        // Show error notification
      }
    );
  }
  
  confirmDelete(): void {
    this.showDeleteModal = true;
  }
  
  deleteProduct(): void {
    if (!this.product?.id) return;
    
    this.productService.deleteProduct(this.product.id).subscribe(
      () => {
        // Show success notification
        this.router.navigate(['/products']);
      },
      (error:any) => {
        console.error('Error deleting product', error);
        // Show error notification
      }
    );
  }
  
  goBack(): void {
    this.router.navigate(['/products']);
  }
}
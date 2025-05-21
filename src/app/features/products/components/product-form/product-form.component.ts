import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImageUploadComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6 flex items-center">
        <button (click)="goBack()" class="text-gray-600 mr-4">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">{{isEditMode ? 'Edit' : 'Add New'}} Product</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <div class="form-group">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  [class.border-red-500]="isFieldInvalid('name')"
                >
                <div *ngIf="isFieldInvalid('name')" class="mt-1 text-sm text-red-500">
                  Product name is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  id="description" 
                  formControlName="description"
                  rows="3"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input 
                  type="text" 
                  id="category" 
                  formControlName="category"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  list="categories"
                >
                <datalist id="categories">
                  <option *ngFor="let category of categories" [value]="category"></option>
                </datalist>
              </div>
              
              <div class="form-group">
                <label for="barcode" class="block text-sm font-medium text-gray-700 mb-1">
                  Barcode
                </label>
                <input 
                  type="text" 
                  id="barcode" 
                  formControlName="barcode"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="price" class="block text-sm font-medium text-gray-700 mb-1">
                    Price <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      id="price" 
                      formControlName="price"
                      step="0.01"
                      min="0"
                      class="w-full pl-7 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      [class.border-red-500]="isFieldInvalid('price')"
                    >
                  </div>
                  <div *ngIf="isFieldInvalid('price')" class="mt-1 text-sm text-red-500">
                    Valid price is required
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="quantity" 
                    formControlName="quantity"
                    min="0"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    [class.border-red-500]="isFieldInvalid('quantity')"
                  >
                  <div *ngIf="isFieldInvalid('quantity')" class="mt-1 text-sm text-red-500">
                    Valid quantity is required
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Product Image
                </label>
                <app-image-upload
                  [currentImageUrl]="productForm.get('imageUrl')?.value"
                  (imageSelected)="onImageSelected($event)"
                  (imageRemoved)="onImageRemoved()"
                ></app-image-upload>
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
              [disabled]="productForm.invalid || isSubmitting"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
              <i *ngIf="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{isEditMode ? 'Update' : 'Create'}} Product
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
      --tw-ring-color: #3f51b5;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId?: number;
  categories: string[] = ['Electronics', 'Clothing', 'Furniture', 'Food', 'Books'];
  selectedImage: File | null = null;
  isSubmitting: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    
    // Fetch existing categories to populate the datalist
    this.productService.getProducts().subscribe(products => {
      const uniqueCategories = new Set<string>();
      products.forEach(product => {
        if (product.category) {
          uniqueCategories.add(product.category);
        }
      });
      this.categories = Array.from(uniqueCategories);
    });
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }
  
  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      imageUrl: [''],
      barcode: ['']
    });
  }
  
  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category: product.category,
          imageUrl: product.imageUrl,
          barcode: product.barcode
        });
      },
      (error) => {
        console.error('Error loading product', error);
        // Show error notification
      }
    );
  }
  
onSubmit(): void {
  if (this.productForm.invalid) return;
  
  this.isSubmitting = true;
  
  // Create a copy of the form data
  const productData: Product = {...this.productForm.value};
  
  // IMPORTANT: If there's a selected image, don't send the imageUrl in the initial product creation
  if (this.selectedImage) {
    // Set to empty or null to prevent sending any large image data
    productData.imageUrl = '';
  }
  
  if (this.isEditMode && this.productId) {
    // Update existing product
    this.productService.updateProduct(this.productId, productData).subscribe(
      (product) => {
        if (this.selectedImage && this.productId) {
          this.uploadImage(this.productId, product);
        } else {
          this.handleSuccess(product);
        }
      },
      this.handleError.bind(this)
    );
  } else {
    // Create new product
    this.productService.createProduct(productData).subscribe(
      (product) => {
        if (this.selectedImage && product.id) {
          this.uploadImage(product.id, product);
        } else {
          this.handleSuccess(product);
        }
      },
      this.handleError.bind(this)
    );
  }
}
uploadImage(productId: number, product: Product): void {
  this.productService.uploadProductImage(productId, this.selectedImage!).subscribe(
    (response) => {
      // Update product with new image URL if it's in the response
      if (response && response.imageUrl) {
        product.imageUrl = response.imageUrl;
      }
      this.handleSuccess(product);
    },
    (error) => {
      console.error('Error uploading image', error);
      // Still proceed with success even if image upload fails
      this.handleSuccess(product);
    }
  );
}
  
  uploadProductImage(productId: number, callback?: () => void): void {
    if (!this.selectedImage) return;
    
    this.productService.uploadProductImage(productId, this.selectedImage).subscribe(
      (response) => {
        // Update image URL in form if available in response
        if (response && response.imageUrl) {
          this.productForm.patchValue({ imageUrl: response.imageUrl });
        }
        
        if (callback) {
          callback();
        } else {
          this.handleSuccess();
        }
      },
      (error) => {
        console.error('Error uploading image', error);
        // We'll still save the product even if image upload fails
        if (callback) {
          callback();
        } else {
          this.handleSuccess();
        }
      }
    );
  }
  
  handleSuccess(product?: Product): void {
    this.isSubmitting = false;
    // Show success notification
    this.goBack();
  }
  
  handleError(error: any): void {
    console.error('Error saving product', error);
    this.isSubmitting = false;
    // Show error notification
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
 onImageSelected(file: File): void {
  this.selectedImage = file;
  
  // IMPORTANT: Don't set the dataURL as the imageUrl value
  // The current code likely does something like:
  // reader.onload = (e) => {
  //   this.productForm.patchValue({ 
  //     imageUrl: reader.result as string  // This is sending the base64 data to your API
  //   });
  // };
  
  // Instead, just set a placeholder or leave it empty
  this.productForm.patchValue({ 
    imageUrl: 'pending-upload'  // Just a placeholder, not the actual image data
  });
}
  
  onImageRemoved(): void {
    this.selectedImage = null;
    this.productForm.patchValue({ imageUrl: '' });
  }
  
  goBack(): void {
    this.router.navigate(['/products']);
  }
}
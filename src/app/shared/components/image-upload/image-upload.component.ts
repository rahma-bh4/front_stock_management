import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-upload-container">
      <div *ngIf="currentImageUrl" class="image-preview mb-3">
        <img [src]="currentImageUrl" alt="Product image" class="rounded max-h-40 mb-2">
        <button *ngIf="currentImageUrl" 
                (click)="removeImage()" 
                class="btn btn-sm btn-danger ms-2"
                type="button">
          Remove
        </button>
      </div>
      
      <div class="drop-zone p-4 border-2 border-dashed rounded-lg text-center cursor-pointer bg-gray-50"
           [class.border-primary]="isDragOver"
           (dragover)="onDragOver($event)" 
           (dragleave)="onDragLeave()" 
           (drop)="onDrop($event)"
           (click)="fileInput.click()">
        <div class="flex flex-col items-center">
          <div class="text-5xl text-gray-400 mb-2">
            <i class="fas fa-cloud-upload-alt"></i>
          </div>
          <p class="mb-1 text-gray-700">Drag & drop an image here or click to browse</p>
          <p class="text-sm text-gray-500">Supports: JPG, JPEG, PNG (max 5MB)</p>
        </div>
      </div>
      
      <input type="file" 
             #fileInput
             class="hidden"
             accept="image/jpeg,image/png,image/jpg"
             (change)="onFileSelected($event)">
             
      <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="mt-3">
        <div class="progress">
          <div class="progress-bar bg-primary" 
               [style.width.%]="uploadProgress">
            {{uploadProgress}}%
          </div>
        </div>
      </div>
      
      <div *ngIf="errorMessage" class="text-danger mt-2">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .drop-zone {
      transition: all 0.3s;
    }
    .drop-zone:hover {
      background-color: #f7fafc;
      border-color: #3f51b5;
    }
  `]
})
export class ImageUploadComponent {
  @Input() currentImageUrl: string | null = null;
  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  
  isDragOver = false;
  uploadProgress = 0;
  errorMessage = '';
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }
  
  onDragLeave(): void {
    this.isDragOver = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files.length) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }
  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    
    if (fileInput.files?.length) {
      this.processFile(fileInput.files[0]);
    }
  }
  
  processFile(file: File): void {
    // Reset
    this.errorMessage = '';
    this.uploadProgress = 0;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'Invalid file type. Only JPG, JPEG, and PNG are allowed.';
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.errorMessage = 'File is too large. Maximum size is 5MB.';
      return;
    }
    
    // Create a preview
    this.createImagePreview(file);
    
    // Simulate upload progress for demo purposes
    this.simulateUploadProgress();
    
    // Emit the file for the parent component to handle the actual upload
    this.imageSelected.emit(file);
  }
  
  createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentImageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  
  simulateUploadProgress(): void {
    // Just for UI feedback, actual upload happens in the parent
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      this.uploadProgress = progress;
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  }
  
  removeImage(): void {
    this.currentImageUrl = null;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.imageRemoved.emit();
  }
}
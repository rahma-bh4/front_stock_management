import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// src/app/shared/components/header/header.component.ts
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="fixed top-0 right-0 left-0 md:left-64 bg-white shadow-md z-20 h-16">
      <nav class="container mx-auto h-full px-4 flex items-center justify-between">
        <div class="flex items-center md:hidden">
          <a routerLink="/" class="flex items-center">
            <img src="assets/images/logo.png" alt="Stock Management" class="h-8 w-8 mr-2">
            <span class="text-xl font-bold text-primary">Stock Management</span>
          </a>
        </div>
        
        <div class="flex-grow mx-4">
          <div class="relative w-full max-w-xl">
            <input 
              type="text" 
              placeholder="Search products, customers, orders..." 
              class="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              [(ngModel)]="searchQuery"
              (keyup.enter)="search()">
            <button 
              class="absolute right-2 top-2 text-gray-500 hover:text-primary"
              (click)="search()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button class="p-2 rounded-full hover:bg-gray-100">
              <i class="far fa-bell text-gray-600"></i>
              <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          
          <div class="relative group">
            <button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
              <img src="assets/images/avatar.png" alt="User Avatar" class="h-8 w-8 rounded-full">
              <span class="font-medium hidden md:inline">Admin</span>
              <i class="fas fa-chevron-down text-xs text-gray-500"></i>
            </button>
            
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <a routerLink="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i class="fas fa-user-circle mr-2"></i> Profile
              </a>
              <a routerLink="/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i class="fas fa-cog mr-2"></i> Settings
              </a>
              <div class="border-t border-gray-200 my-1"></div>
              <a routerLink="/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                <i class="fas fa-sign-out-alt mr-2"></i> Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .text-primary { color: #3949ab; }
    .focus-ring-primary { --tw-ring-color: rgba(57, 73, 171, 0.5); }
  `]
})
export class HeaderComponent {
  searchQuery: string = '';
  
  search(): void {
    console.log('Searching for:', this.searchQuery);
    // Implement global search logic here
  }
}
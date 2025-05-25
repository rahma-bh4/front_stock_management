import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="fixed top-0 right-0 left-64 bg-white shadow-lg z-20 h-16 border-b border-gray-200">
      <nav class="h-full px-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="hidden md:flex items-center text-sm text-gray-500">
            <i class="fas fa-home mr-2 text-blue-600"></i>
            <span>Dashboard</span>
          </div>
        </div>
        
        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl mx-8">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400 text-sm"></i>
            </div>
            <input 
              type="text" 
              placeholder="Search products, customers, orders..." 
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              [(ngModel)]="searchQuery"
              (keyup.enter)="search()">
          </div>
        </div>
        
        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <div class="relative">
            <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 relative">
              <i class="fas fa-bell text-lg"></i>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                3
              </span>
            </button>
          </div>
          
          <!-- Settings -->
          <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <i class="fas fa-cog text-lg"></i>
          </button>
          
          <!-- User Profile Dropdown -->
          <div class="relative group">
            <button class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">A</span>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900">Admin</p>
                <p class="text-xs text-gray-500">Administrator</p>
              </div>
              <i class="fas fa-chevron-down text-xs text-gray-400 hidden md:block"></i>
            </button>
            
            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">Admin User</p>
                <p class="text-xs text-gray-500">adminstockmanagement.com</p>
              </div>
              
              <a routerLink="/profile" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <i class="fas fa-user-circle mr-3 text-gray-400"></i>
                My Profile
              </a>
              
              <a routerLink="/settings" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                <i class="fas fa-cog mr-3 text-gray-400"></i>
                Settings
              </a>
              
              <div class="border-t border-gray-100 my-2"></div>
              
              <a routerLink="/login" class="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                <i class="fas fa-sign-out-alt mr-3 text-red-500"></i>
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .transition-all {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .duration-200 {
      transition-duration: 200ms;
    }
    
    .transition-colors {
      transition-property: color, background-color, border-color;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .bg-gradient-to-br {
      background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
    }
    
    .from-blue-500 {
      --tw-gradient-from: #3b82f6;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
    }
    
    .to-purple-600 {
      --tw-gradient-to: #9333ea;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
    
    .group:hover .group-hover\\:opacity-100 {
      opacity: 1;
    }
    
    .group:hover .group-hover\\:visible {
      visibility: visible;
    }
    
    .group:hover .group-hover\\:translate-y-0 {
      transform: translateY(0);
    }
    
    /* Custom focus styles */
    input:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    /* Smooth transitions for dropdown */
    .group > div:last-child {
      transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
    }
  `]
})
export class HeaderComponent {
  searchQuery: string = '';
  
  search(): void {
    console.log('Searching for:', this.searchQuery);
    // Implement global search logic here
  }
}
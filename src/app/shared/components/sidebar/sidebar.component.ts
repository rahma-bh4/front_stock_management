import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="fixed h-screen bg-white shadow-2xl w-64 top-0 pt-16 left-0 z-10 overflow-y-auto border-r border-gray-200">
      <div class="py-4">
        <ul>
          <li>
            <a routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600" 
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                <i class="fas fa-tachometer-alt text-gray-600 group-hover:text-blue-600"></i>
              </div>
              <span class="font-medium">Dashboard</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/products" routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600" 
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-100 transition-colors">
                <i class="fas fa-box text-gray-600 group-hover:text-green-600"></i>
              </div>
              <span class="font-medium">Products</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/customers" routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600" 
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors">
                <i class="fas fa-users text-gray-600 group-hover:text-purple-600"></i>
              </div>
              <span class="font-medium">Customers</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/orders" routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600" 
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-100 transition-colors">
                <i class="fas fa-shopping-cart text-gray-600 group-hover:text-orange-600"></i>
              </div>
              <span class="font-medium">Orders</span>
            </a>
          </li>
          
          <!-- <li>
            <a routerLink="/reports" routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600" 
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-100 transition-colors">
                <i class="fas fa-chart-bar text-gray-600 group-hover:text-indigo-600"></i>
              </div>
              <span class="font-medium">Reports</span>
            </a>
          </li> -->
          
          <li>
            <a routerLink="/analytics" routerLinkActive="bg-blue-50 text-blue-700 border-r-4 border-blue-600" 
              class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-pink-100 transition-colors">
                <i class="fas fa-chart-line text-gray-600 group-hover:text-pink-600"></i>
              </div>
              <span class="font-medium">Analytics</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
    
    <!-- Mobile Sidebar Toggle Button -->
    <button class="fixed bottom-4 right-4 z-20 bg-blue-600 text-white rounded-full p-3 shadow-lg md:hidden hover:bg-blue-700 transition-colors">
      <i class="fas fa-bars"></i>
    </button>
  `,
  styles: [`
    .bg-gradient-to-b {
      background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
    }
    
    .from-slate-900 {
      --tw-gradient-from: #0f172a;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(15, 23, 42, 0));
    }
    
    .to-slate-800 {
      --tw-gradient-to: #1e293b;
    }
    
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
    
    .border-r-4 {
      border-right-width: 4px;
    }
    
    .group:hover .group-hover\\:bg-blue-100 {
      background-color: #dbeafe;
    }
    
    .group:hover .group-hover\\:bg-green-100 {
      background-color: #dcfce7;
    }
    
    .group:hover .group-hover\\:bg-purple-100 {
      background-color: #f3e8ff;
    }
    
    .group:hover .group-hover\\:bg-orange-100 {
      background-color: #fed7aa;
    }
    
    .group:hover .group-hover\\:bg-indigo-100 {
      background-color: #e0e7ff;
    }
    
    .group:hover .group-hover\\:bg-pink-100 {
      background-color: #fce7f3;
    }
    
    .group:hover .group-hover\\:text-blue-600 {
      color: #2563eb;
    }
    
    .group:hover .group-hover\\:text-green-600 {
      color: #16a34a;
    }
    
    .group:hover .group-hover\\:text-purple-600 {
      color: #9333ea;
    }
    
    .group:hover .group-hover\\:text-orange-600 {
      color: #ea580c;
    }
    
    .group:hover .group-hover\\:text-indigo-600 {
      color: #4f46e5;
    }
    
    .group:hover .group-hover\\:text-pink-600 {
      color: #db2777;
    }
    
    /* Custom scrollbar */
    aside::-webkit-scrollbar {
      width: 4px;
    }
    
    aside::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    
    aside::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }
    
    aside::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class SidebarComponent {}
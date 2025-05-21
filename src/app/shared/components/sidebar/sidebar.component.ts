import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// src/app/shared/components/sidebar/sidebar.component.ts
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="fixed h-screen bg-white shadow-md w-64 top-0 pt-16 left-0 z-10 overflow-y-auto">
      <div class="py-4">
        <ul>
          <li>
            <a routerLink="/dashboard" routerLinkActive="bg-primary text-white" 
              class="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors">
              <i class="fas fa-tachometer-alt w-5 mr-3"></i>
              <span>Dashboard</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/products" routerLinkActive="bg-primary text-white" 
              class="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors">
              <i class="fas fa-box w-5 mr-3"></i>
              <span>Products</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/customers" routerLinkActive="bg-primary text-white" 
              class="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors">
              <i class="fas fa-users w-5 mr-3"></i>
              <span>Customers</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/orders" routerLinkActive="bg-primary text-white" 
              class="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors">
              <i class="fas fa-shopping-cart w-5 mr-3"></i>
              <span>Orders</span>
            </a>
          </li>

          <li>
            <a routerLink="/invoices" routerLinkActive="bg-primary text-white" 
              class="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors">
              <i class="fas fa-file-invoice-dollar w-5 mr-3"></i>
              <span>Invoices</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/reports" routerLinkActive="bg-primary text-white" 
              class="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors">
              <i class="fas fa-chart-bar w-5 mr-3"></i>
              <span>Reports</span>
            </a>
          </li>
          
          <li>
            <a routerLink="/settings" routerLinkActive="bg-primary text-white" 
              class="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors">
              <i class="fas fa-cog w-5 mr-3"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
    
    
    <!-- Mobile Sidebar Toggle Button -->
    <button class="fixed bottom-4 right-4 z-20 bg-primary text-white rounded-full p-3 shadow-lg md:hidden">
      <i class="fas fa-bars"></i>
    </button>
  `,
  styles: [`
    .bg-primary {
      background-color: #3949ab; /* Couleur primaire plus foncée */
    }
    .text-primary {
      color: #3949ab;
    }
  `]
})
export class SidebarComponent {}
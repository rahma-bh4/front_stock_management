import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';

// src/app/app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <app-sidebar></app-sidebar>
      
      <div class="flex flex-col w-full md:ml-64">
        <app-header></app-header>
        
        <main class="flex-grow p-4 pt-16">
          <router-outlet></router-outlet>
        </main>
        
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'stock-management-frontend';
}

// src/app/shared/components/footer/footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white shadow-md mt-auto py-4">
      <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
        <p>&copy; 2025 Stock Management System. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}

// src/app/features/products/components/product-detail/product-detail.component.ts

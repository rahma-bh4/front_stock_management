// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(mod => mod.PRODUCTS_ROUTES)
  },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.routes').then(mod => mod.CUSTOMERS_ROUTES)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders.routes').then(mod => mod.ORDERS_ROUTES)
  },
  {
    path: 'invoices',
    loadChildren: () => import('./orders.routes').then(mod => mod.INVOICE_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
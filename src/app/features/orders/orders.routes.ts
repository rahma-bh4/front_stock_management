// src/app/features/orders/orders.routes.ts
import { Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { PrintableInvoiceComponent } from './components/printable-invoice/printable-invoice.component';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrderListComponent
  },
  {
    path: 'new',
    component: OrderFormComponent
  },
  {
    path: 'edit/:id',
    component: OrderFormComponent
  },
  {
    path: ':id',
    component: OrderDetailComponent
  }
];

export const INVOICE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/orders',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: InvoiceViewComponent
  },
  {
    path: 'order/:orderId',
    component: InvoiceViewComponent
  },
  {
    path: 'print/:id',
    component: PrintableInvoiceComponent
  },
  {
    path: 'print/order/:orderId',
    component: PrintableInvoiceComponent
  }
];
import { Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';

import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { OrderFormComponent } from './order-form/order-form.component';

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
  }
];
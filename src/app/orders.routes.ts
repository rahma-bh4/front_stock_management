import { Routes } from '@angular/router';
import { OrderListComponent } from './features/orders/components/order-list/order-list.component';
import { OrderFormComponent } from './features/orders/order-form/order-form.component';
import { OrderDetailComponent } from './features/orders/components/order-detail/order-detail.component';
import { InvoiceViewComponent } from './features/orders/components/invoice-view/invoice-view.component';


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
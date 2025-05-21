import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    component: CustomerListComponent
  },
  {
    path: 'new',
    component: CustomerFormComponent
  },
  {
    path: 'edit/:id',
    component: CustomerFormComponent
  },
  {
    path: ':id',
    component: CustomerDetailComponent
  }
];
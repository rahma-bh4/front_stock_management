// src/app/features/customers/services/loyalty.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Customer } from '../../customer.model';
import { LoyaltyActivity } from '../../loyalty-activity.model';


@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  private apiBaseUrl = environment.customerApi;

  constructor(private http: HttpClient) { }

  getLoyaltyInfo(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiBaseUrl}/${customerId}/loyalty`);
  }

  addLoyaltyPoints(customerId: number, activity: LoyaltyActivity): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiBaseUrl}/${customerId}/loyalty/points`, activity);
  }

  getLoyaltyActivities(customerId: number): Observable<LoyaltyActivity[]> {
    return this.http.get<LoyaltyActivity[]>(`${this.apiBaseUrl}/${customerId}/loyalty/activities`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';
import { Invoice } from '../models/invoice.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderApiUrl = environment.orderApi;
  private invoiceApiUrl = environment.invoiceApi;

  constructor(private http: HttpClient) { }

  // Order endpoints
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderApiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.orderApiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.orderApiUrl, order);
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.orderApiUrl}/${id}`, order);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.orderApiUrl}/${id}/status?status=${status}`, {});
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.orderApiUrl}/${id}`);
  }

  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.orderApiUrl}/customer/${customerId}`);
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.orderApiUrl}/status/${status}`);
  }

  getOrdersByDateRange(startDate: Date, endDate: Date): Observable<Order[]> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    return this.http.get<Order[]>(`${this.orderApiUrl}/date-range?startDate=${start}&endDate=${end}`);
  }

  // Invoice endpoints
  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.invoiceApiUrl}/${id}`);
  }

  getInvoiceByOrderId(orderId: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.invoiceApiUrl}/order/${orderId}`);
  }

  getInvoiceByInvoiceNumber(invoiceNumber: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.invoiceApiUrl}/number/${invoiceNumber}`);
  }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.invoiceApiUrl);
  }

  getInvoicesByDateRange(startDate: Date, endDate: Date): Observable<Invoice[]> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    return this.http.get<Invoice[]>(`${this.invoiceApiUrl}/date-range?startDate=${start}&endDate=${end}`);
  }

  updateInvoicePaymentStatus(id: number, paymentStatus: string): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.invoiceApiUrl}/${id}/payment-status?paymentStatus=${paymentStatus}`, {});
  }
}
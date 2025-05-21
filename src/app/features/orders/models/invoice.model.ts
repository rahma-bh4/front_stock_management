export interface Invoice {
  id?: number;
  invoiceNumber: string;
  orderId: number;
  issueDate: Date;
  dueDate?: Date;
  totalAmount: number;
  taxAmount?: number;
  paymentStatus: string;
}
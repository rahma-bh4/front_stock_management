// src/app/features/customers/models/loyalty-activity.model.ts
export interface LoyaltyActivity {
  id?: number;
  customerId: number;
  type: string;
  points: number;
  amount?: number;
  description: string;
  referenceId?: string;
  createdAt: Date;
}
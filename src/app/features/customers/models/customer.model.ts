export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;

  
  loyaltyPoints?: number;
  loyaltyTier?: string;
  tierUpdatedAt?: Date;
  lifetimePurchaseValue?: number;
  completedOrders?: number;
  discountPercentage?: number;
}
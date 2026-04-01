export interface CartItem {
  id: string;
  name: string;
  price: number;
  branchName: string;
  branchId: string;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string | null;
  branch_id: string;
  customer_name: string;
  customer_phone: string;
  items: CartItem[];
  total_price: number;
  status: OrderStatus;
  created_at: any;
  payment_method: 'advance' | 'full';
  payment_type: 'qr' | 'upi' | 'phonepe';
  payable_amount: number;
  transaction_id?: string;
  booking_details?: {
    people: string;
    tableType?: string;
  };
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  created_at: any;
}

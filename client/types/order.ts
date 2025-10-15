export interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dealId: string;
  dealTitle: string;
  dealDescription: string;
  originalPrice: number;
  discountPrice: number;
  category: "beauty" | "food" | "fitness" | "services" | "shopping" | "pizza" | "coffee";
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  orderDate: string;
  specialInstructions: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dealId: string;
  dealTitle: string;
  dealDescription: string;
  originalPrice: number;
  discountPrice: number;
  category: "beauty" | "food" | "fitness" | "services" | "shopping" | "pizza" | "coffee";
  specialInstructions?: string;
  quantity?: number;
}

export interface OrderStatusUpdate {
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
}

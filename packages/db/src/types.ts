export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: { Row: { id: string; name: string; created_at: string; updated_at: string }; Insert: Omit<{ id: string; name: string; created_at: string; updated_at: string }, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<{ id: string; name: string; created_at: string; updated_at: string }, 'id' | 'created_at' | 'updated_at'>>; Update: Partial<{ id: string; name: string; created_at: string; updated_at: string }> };
      restaurants: { Row: { id: string; org_id: string; name: string; slug: string; gstin: string | null; fssai_no: string | null; address: string | null; city: string | null; state: string | null; pincode: string | null; phone: string | null; email: string | null; logo_url: string | null; currency: string; timezone: string; is_active: boolean; created_at: string; updated_at: string }; Insert: Partial<{ id: string; currency: string; timezone: string; is_active: boolean; created_at: string; updated_at: string }> & { org_id: string; name: string; slug: string }; Update: Partial<{ id: string; org_id: string; name: string; slug: string; gstin: string | null; fssai_no: string | null; address: string | null; city: string | null; state: string | null; pincode: string | null; phone: string | null; email: string | null; logo_url: string | null; currency: string; timezone: string; is_active: boolean; created_at: string; updated_at: string }> };
      [key: string]: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
    };
    Views: { [key: string]: { Row: Record<string, unknown> } };
    Functions: { [key: string]: { Args: Record<string, unknown>; Returns: unknown } };
    Enums: {
      user_role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
      order_status: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
      item_status: 'queued' | 'cooking' | 'ready' | 'served' | 'cancelled';
      session_status: 'open' | 'bill_requested' | 'settled' | 'cancelled';
      payment_status: 'created' | 'pending' | 'success' | 'failed' | 'refunded' | 'partially_refunded';
      payment_method: 'upi' | 'card' | 'cash' | 'wallet' | 'netbanking' | 'aggregator';
      order_type: 'dine_in' | 'takeaway' | 'delivery';
      channel_type: 'dine_in' | 'takeaway' | 'own_web' | 'swiggy' | 'zomato' | 'other';
    };
  };
};

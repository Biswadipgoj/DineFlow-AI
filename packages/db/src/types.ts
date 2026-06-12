export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      restaurants: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          slug: string;
          gstin: string | null;
          fssai_no: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          pincode: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          currency: string;
          timezone: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          slug: string;
          gstin?: string | null;
          fssai_no?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          currency?: string;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          name?: string;
          slug?: string;
          gstin?: string | null;
          fssai_no?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          pincode?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          currency?: string;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurants_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      branches: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          address: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "branches_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          default_role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          default_role?: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          default_role?: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          branch_id: string | null;
          role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          restaurant_id: string;
          branch_id?: string | null;
          role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          restaurant_id?: string;
          branch_id?: string | null;
          role?: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memberships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "branches";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          id: string;
          restaurant_id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "settings_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          restaurant_id: string | null;
          actor_user_id: string | null;
          action: string;
          entity: string;
          entity_id: string | null;
          before_data: Json | null;
          after_data: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          actor_user_id?: string | null;
          action: string;
          entity: string;
          entity_id?: string | null;
          before_data?: Json | null;
          after_data?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string | null;
          actor_user_id?: string | null;
          action?: string;
          entity?: string;
          entity_id?: string | null;
          before_data?: Json | null;
          after_data?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey";
            columns: ["actor_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      plans: {
        Row: {
          id: string;
          code: string;
          name: string;
          price_paise: number;
          interval: string;
          features: Json;
          limits: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          price_paise: number;
          interval?: string;
          features?: Json;
          limits?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          price_paise?: number;
          interval?: string;
          features?: Json;
          limits?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          restaurant_id: string;
          plan_id: string;
          status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'paused';
          razorpay_subscription_id: string | null;
          trial_end: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          plan_id: string;
          status?: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'paused';
          razorpay_subscription_id?: string | null;
          trial_end?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          plan_id?: string;
          status?: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'paused';
          razorpay_subscription_id?: string | null;
          trial_end?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          id: string;
          restaurant_id: string;
          subscription_id: string | null;
          amount_paise: number;
          status: string;
          razorpay_invoice_id: string | null;
          issued_at: string;
          paid_at: string | null;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          subscription_id?: string | null;
          amount_paise: number;
          status?: string;
          razorpay_invoice_id?: string | null;
          issued_at?: string;
          paid_at?: string | null;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          subscription_id?: string | null;
          amount_paise?: number;
          status?: string;
          razorpay_invoice_id?: string | null;
          issued_at?: string;
          paid_at?: string | null;
          pdf_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price_paise: number;
          image_url: string | null;
          is_veg: boolean | null;
          hsn_sac: string | null;
          gst_rate: number;
          is_available: boolean;
          sort_order: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price_paise: number;
          image_url?: string | null;
          is_veg?: boolean | null;
          hsn_sac?: string | null;
          gst_rate?: number;
          is_available?: boolean;
          sort_order?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          price_paise?: number;
          image_url?: string | null;
          is_veg?: boolean | null;
          hsn_sac?: string | null;
          gst_rate?: number;
          is_available?: boolean;
          sort_order?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "menu_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_item_translations: {
        Row: {
          id: string;
          menu_item_id: string;
          lang: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          menu_item_id: string;
          lang: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          menu_item_id?: string;
          lang?: string;
          name?: string;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "menu_item_translations_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
        ];
      };
      modifier_groups: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          is_required: boolean;
          min_select: number;
          max_select: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          is_required?: boolean;
          min_select?: number;
          max_select?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          is_required?: boolean;
          min_select?: number;
          max_select?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modifier_groups_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      modifier_options: {
        Row: {
          id: string;
          modifier_group_id: string;
          name: string;
          price_delta_paise: number;
          is_available: boolean;
        };
        Insert: {
          id?: string;
          modifier_group_id: string;
          name: string;
          price_delta_paise?: number;
          is_available?: boolean;
        };
        Update: {
          id?: string;
          modifier_group_id?: string;
          name?: string;
          price_delta_paise?: number;
          is_available?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "modifier_options_modifier_group_id_fkey";
            columns: ["modifier_group_id"];
            isOneToOne: false;
            referencedRelation: "modifier_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_item_modifier_groups: {
        Row: {
          menu_item_id: string;
          modifier_group_id: string;
        };
        Insert: {
          menu_item_id: string;
          modifier_group_id: string;
        };
        Update: {
          menu_item_id?: string;
          modifier_group_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_item_modifier_groups_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_item_modifier_groups_modifier_group_id_fkey";
            columns: ["modifier_group_id"];
            isOneToOne: false;
            referencedRelation: "modifier_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      dining_tables: {
        Row: {
          id: string;
          restaurant_id: string;
          branch_id: string;
          label: string;
          capacity: number | null;
          area: string | null;
          qr_code: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          branch_id: string;
          label: string;
          capacity?: number | null;
          area?: string | null;
          qr_code?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          branch_id?: string;
          label?: string;
          capacity?: number | null;
          area?: string | null;
          qr_code?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dining_tables_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dining_tables_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "branches";
            referencedColumns: ["id"];
          },
        ];
      };
      table_sessions: {
        Row: {
          id: string;
          restaurant_id: string;
          branch_id: string;
          table_id: string;
          status: 'open' | 'bill_requested' | 'settled' | 'cancelled';
          guest_count: number | null;
          opened_by: string | null;
          opened_at: string;
          closed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          branch_id: string;
          table_id: string;
          status?: 'open' | 'bill_requested' | 'settled' | 'cancelled';
          guest_count?: number | null;
          opened_by?: string | null;
          opened_at?: string;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          branch_id?: string;
          table_id?: string;
          status?: 'open' | 'bill_requested' | 'settled' | 'cancelled';
          guest_count?: number | null;
          opened_by?: string | null;
          opened_at?: string;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "table_sessions_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "table_sessions_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "branches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "table_sessions_table_id_fkey";
            columns: ["table_id"];
            isOneToOne: false;
            referencedRelation: "dining_tables";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "table_sessions_opened_by_fkey";
            columns: ["opened_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          restaurant_id: string;
          branch_id: string;
          session_id: string | null;
          order_number: string;
          channel: 'dine_in' | 'takeaway' | 'own_web' | 'swiggy' | 'zomato' | 'other';
          order_type: 'dine_in' | 'takeaway' | 'delivery';
          status: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
          customer_id: string | null;
          waiter_id: string | null;
          subtotal_paise: number;
          discount_paise: number;
          tax_paise: number;
          service_charge_paise: number;
          total_paise: number;
          notes: string | null;
          external_ref: string | null;
          placed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          branch_id: string;
          session_id?: string | null;
          order_number: string;
          channel?: 'dine_in' | 'takeaway' | 'own_web' | 'swiggy' | 'zomato' | 'other';
          order_type?: 'dine_in' | 'takeaway' | 'delivery';
          status?: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
          customer_id?: string | null;
          waiter_id?: string | null;
          subtotal_paise?: number;
          discount_paise?: number;
          tax_paise?: number;
          service_charge_paise?: number;
          total_paise?: number;
          notes?: string | null;
          external_ref?: string | null;
          placed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          branch_id?: string;
          session_id?: string | null;
          order_number?: string;
          channel?: 'dine_in' | 'takeaway' | 'own_web' | 'swiggy' | 'zomato' | 'other';
          order_type?: 'dine_in' | 'takeaway' | 'delivery';
          status?: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
          customer_id?: string | null;
          waiter_id?: string | null;
          subtotal_paise?: number;
          discount_paise?: number;
          tax_paise?: number;
          service_charge_paise?: number;
          total_paise?: number;
          notes?: string | null;
          external_ref?: string | null;
          placed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "branches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "table_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_waiter_id_fkey";
            columns: ["waiter_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          name_snapshot: string;
          unit_price_paise: number;
          qty: number;
          modifiers: Json;
          item_total_paise: number;
          gst_rate: number;
          notes: string | null;
          status: 'queued' | 'cooking' | 'ready' | 'served' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          name_snapshot: string;
          unit_price_paise: number;
          qty?: number;
          modifiers?: Json;
          item_total_paise: number;
          gst_rate?: number;
          notes?: string | null;
          status?: 'queued' | 'cooking' | 'ready' | 'served' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          name_snapshot?: string;
          unit_price_paise?: number;
          qty?: number;
          modifiers?: Json;
          item_total_paise?: number;
          gst_rate?: number;
          notes?: string | null;
          status?: 'queued' | 'cooking' | 'ready' | 'served' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
        ];
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          from_status: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled' | null;
          to_status: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
          changed_by: string | null;
          note: string | null;
          changed_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          from_status?: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled' | null;
          to_status: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
          changed_by?: string | null;
          note?: string | null;
          changed_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          from_status?: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled' | null;
          to_status?: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
          changed_by?: string | null;
          note?: string | null;
          changed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_status_history_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      kots: {
        Row: {
          id: string;
          restaurant_id: string;
          order_id: string;
          kot_number: number;
          station: string | null;
          status: 'pending' | 'printing' | 'printed' | 'cancelled';
          printed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          order_id: string;
          kot_number: number;
          station?: string | null;
          status?: 'pending' | 'printing' | 'printed' | 'cancelled';
          printed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          order_id?: string;
          kot_number?: number;
          station?: string | null;
          status?: 'pending' | 'printing' | 'printed' | 'cancelled';
          printed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "kots_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "kots_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          restaurant_id: string;
          order_id: string | null;
          session_id: string | null;
          method: 'upi' | 'card' | 'cash' | 'wallet' | 'netbanking' | 'aggregator';
          amount_paise: number;
          tip_paise: number;
          status: 'created' | 'pending' | 'success' | 'failed' | 'refunded' | 'partially_refunded';
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          signature_verified: boolean;
          failure_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          order_id?: string | null;
          session_id?: string | null;
          method: 'upi' | 'card' | 'cash' | 'wallet' | 'netbanking' | 'aggregator';
          amount_paise: number;
          tip_paise?: number;
          status?: 'created' | 'pending' | 'success' | 'failed' | 'refunded' | 'partially_refunded';
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          signature_verified?: boolean;
          failure_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          order_id?: string | null;
          session_id?: string | null;
          method?: 'upi' | 'card' | 'cash' | 'wallet' | 'netbanking' | 'aggregator';
          amount_paise?: number;
          tip_paise?: number;
          status?: 'created' | 'pending' | 'success' | 'failed' | 'refunded' | 'partially_refunded';
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          signature_verified?: boolean;
          failure_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "table_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      refunds: {
        Row: {
          id: string;
          payment_id: string;
          amount_paise: number;
          reason: string | null;
          status: string;
          razorpay_refund_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          amount_paise: number;
          reason?: string | null;
          status?: string;
          razorpay_refund_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          amount_paise?: number;
          reason?: string | null;
          status?: string;
          razorpay_refund_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "refunds_payment_id_fkey";
            columns: ["payment_id"];
            isOneToOne: false;
            referencedRelation: "payments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "refunds_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      bills: {
        Row: {
          id: string;
          restaurant_id: string;
          session_id: string | null;
          order_id: string | null;
          invoice_number: string;
          subtotal_paise: number;
          discount_paise: number;
          cgst_paise: number;
          sgst_paise: number;
          igst_paise: number;
          service_charge_paise: number;
          total_paise: number;
          pdf_url: string | null;
          issued_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          session_id?: string | null;
          order_id?: string | null;
          invoice_number: string;
          subtotal_paise: number;
          discount_paise?: number;
          cgst_paise?: number;
          sgst_paise?: number;
          igst_paise?: number;
          service_charge_paise?: number;
          total_paise: number;
          pdf_url?: string | null;
          issued_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          session_id?: string | null;
          order_id?: string | null;
          invoice_number?: string;
          subtotal_paise?: number;
          discount_paise?: number;
          cgst_paise?: number;
          sgst_paise?: number;
          igst_paise?: number;
          service_charge_paise?: number;
          total_paise?: number;
          pdf_url?: string | null;
          issued_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bills_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bills_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "table_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bills_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      bill_splits: {
        Row: {
          id: string;
          bill_id: string;
          label: string;
          amount_paise: number;
          paid: boolean;
          payment_id: string | null;
        };
        Insert: {
          id?: string;
          bill_id: string;
          label: string;
          amount_paise: number;
          paid?: boolean;
          payment_id?: string | null;
        };
        Update: {
          id?: string;
          bill_id?: string;
          label?: string;
          amount_paise?: number;
          paid?: boolean;
          payment_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bill_splits_bill_id_fkey";
            columns: ["bill_id"];
            isOneToOne: false;
            referencedRelation: "bills";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bill_splits_payment_id_fkey";
            columns: ["payment_id"];
            isOneToOne: false;
            referencedRelation: "payments";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_items: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          unit: string;
          current_qty: number;
          reorder_level: number;
          expiry_date: string | null;
          cost_per_unit_paise: number | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          unit: string;
          current_qty?: number;
          reorder_level?: number;
          expiry_date?: string | null;
          cost_per_unit_paise?: number | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          unit?: string;
          current_qty?: number;
          reorder_level?: number;
          expiry_date?: string | null;
          cost_per_unit_paise?: number | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_items_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      recipes: {
        Row: {
          id: string;
          restaurant_id: string;
          menu_item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          menu_item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          menu_item_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recipes_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipes_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: true;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
        ];
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          inventory_item_id: string;
          qty_per_serving: number;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          inventory_item_id: string;
          qty_per_serving: number;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          inventory_item_id?: string;
          qty_per_serving?: number;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_ingredients_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
        ];
      };
      stock_movements: {
        Row: {
          id: string;
          restaurant_id: string;
          inventory_item_id: string;
          change_qty: number;
          reason: string;
          ref_id: string | null;
          note: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          inventory_item_id: string;
          change_qty: number;
          reason: string;
          ref_id?: string | null;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          inventory_item_id?: string;
          change_qty?: number;
          reason?: string;
          ref_id?: string | null;
          note?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stock_movements_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stock_movements_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stock_movements_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      suppliers: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          contact_name: string | null;
          phone: string | null;
          email: string | null;
          products: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          products?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          products?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "suppliers_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      purchase_orders: {
        Row: {
          id: string;
          restaurant_id: string;
          supplier_id: string;
          status: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
          notes: string | null;
          total_paise: number;
          ordered_at: string | null;
          received_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          supplier_id: string;
          status?: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
          notes?: string | null;
          total_paise?: number;
          ordered_at?: string | null;
          received_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          supplier_id?: string;
          status?: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
          notes?: string | null;
          total_paise?: number;
          ordered_at?: string | null;
          received_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "purchase_orders_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
        ];
      };
      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          inventory_item_id: string;
          qty: number;
          unit_price_paise: number;
          received_qty: number;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          inventory_item_id: string;
          qty: number;
          unit_price_paise: number;
          received_qty?: number;
        };
        Update: {
          id?: string;
          purchase_order_id?: string;
          inventory_item_id?: string;
          qty?: number;
          unit_price_paise?: number;
          received_qty?: number;
        };
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey";
            columns: ["purchase_order_id"];
            isOneToOne: false;
            referencedRelation: "purchase_orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchase_order_items_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
        ];
      };
      employees: {
        Row: {
          id: string;
          restaurant_id: string;
          user_id: string | null;
          name: string;
          role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          phone: string | null;
          salary_paise: number | null;
          salary_type: string;
          join_date: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          user_id?: string | null;
          name: string;
          role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          phone?: string | null;
          salary_paise?: number | null;
          salary_type?: string;
          join_date?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          user_id?: string | null;
          name?: string;
          role?: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
          phone?: string | null;
          salary_paise?: number | null;
          salary_type?: string;
          join_date?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "employees_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "employees_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      shifts: {
        Row: {
          id: string;
          restaurant_id: string;
          employee_id: string;
          start_at: string;
          end_at: string | null;
          role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer' | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          employee_id: string;
          start_at: string;
          end_at?: string | null;
          role?: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer' | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          employee_id?: string;
          start_at?: string;
          end_at?: string | null;
          role?: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer' | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shifts_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shifts_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance: {
        Row: {
          id: string;
          restaurant_id: string;
          employee_id: string;
          date: string;
          status: 'present' | 'absent' | 'half_day' | 'leave' | 'week_off';
          clock_in: string | null;
          clock_out: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          employee_id: string;
          date: string;
          status: 'present' | 'absent' | 'half_day' | 'leave' | 'week_off';
          clock_in?: string | null;
          clock_out?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          employee_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'half_day' | 'leave' | 'week_off';
          clock_in?: string | null;
          clock_out?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          id: string;
          restaurant_id: string;
          category: 'rent' | 'electricity' | 'gas' | 'salary' | 'supplies' | 'marketing' | 'repairs' | 'misc';
          amount_paise: number;
          note: string | null;
          spent_on: string;
          receipt_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category: 'rent' | 'electricity' | 'gas' | 'salary' | 'supplies' | 'marketing' | 'repairs' | 'misc';
          amount_paise: number;
          note?: string | null;
          spent_on: string;
          receipt_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category?: 'rent' | 'electricity' | 'gas' | 'salary' | 'supplies' | 'marketing' | 'repairs' | 'misc';
          amount_paise?: number;
          note?: string | null;
          spent_on?: string;
          receipt_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string | null;
          phone_encrypted: string | null;
          phone_hash: string | null;
          email: string | null;
          total_orders: number;
          total_spent_paise: number;
          last_order_at: string | null;
          consent_marketing: boolean;
          consent_given_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name?: string | null;
          phone_encrypted?: string | null;
          phone_hash?: string | null;
          email?: string | null;
          total_orders?: number;
          total_spent_paise?: number;
          last_order_at?: string | null;
          consent_marketing?: boolean;
          consent_given_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string | null;
          phone_encrypted?: string | null;
          phone_hash?: string | null;
          email?: string | null;
          total_orders?: number;
          total_spent_paise?: number;
          last_order_at?: string | null;
          consent_marketing?: boolean;
          consent_given_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      loyalty_points: {
        Row: {
          id: string;
          restaurant_id: string;
          customer_id: string;
          balance: number;
          ledger: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          customer_id: string;
          balance?: number;
          ledger?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          customer_id?: string;
          balance?: number;
          ledger?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loyalty_points_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loyalty_points_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      coupons: {
        Row: {
          id: string;
          restaurant_id: string;
          code: string;
          type: string;
          value_paise: number | null;
          value_percent: number | null;
          min_order_paise: number;
          max_uses: number | null;
          used_count: number;
          valid_from: string | null;
          valid_to: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          code: string;
          type: string;
          value_paise?: number | null;
          value_percent?: number | null;
          min_order_paise?: number;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string | null;
          valid_to?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          code?: string;
          type?: string;
          value_paise?: number | null;
          value_percent?: number | null;
          min_order_paise?: number;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string | null;
          valid_to?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coupons_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      marketing_campaigns: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          channel: string;
          template_name: string;
          template_params: Json | null;
          audience_filter: Json | null;
          scheduled_at: string | null;
          sent_at: string | null;
          status: string;
          sent_count: number;
          total_cost_paise: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          channel?: string;
          template_name: string;
          template_params?: Json | null;
          audience_filter?: Json | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          status?: string;
          sent_count?: number;
          total_cost_paise?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          channel?: string;
          template_name?: string;
          template_params?: Json | null;
          audience_filter?: Json | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          status?: string;
          sent_count?: number;
          total_cost_paise?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      message_logs: {
        Row: {
          id: string;
          restaurant_id: string;
          customer_id: string | null;
          campaign_id: string | null;
          channel: string;
          template_name: string | null;
          status: string;
          provider_msg_id: string | null;
          cost_paise: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          customer_id?: string | null;
          campaign_id?: string | null;
          channel: string;
          template_name?: string | null;
          status: string;
          provider_msg_id?: string | null;
          cost_paise?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          customer_id?: string | null;
          campaign_id?: string | null;
          channel?: string;
          template_name?: string | null;
          status?: string;
          provider_msg_id?: string | null;
          cost_paise?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_logs_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_logs_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_logs_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "marketing_campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_reports: {
        Row: {
          id: string;
          restaurant_id: string;
          type: string;
          period_start: string | null;
          period_end: string | null;
          payload: Json;
          model_used: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          type: string;
          period_start?: string | null;
          period_end?: string | null;
          payload: Json;
          model_used?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          type?: string;
          period_start?: string | null;
          period_end?: string | null;
          payload?: Json;
          model_used?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_reports_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      forecasts: {
        Row: {
          id: string;
          restaurant_id: string;
          target: string;
          forecast_date: string;
          predicted_value: number;
          confidence_low: number | null;
          confidence_high: number | null;
          method: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          target: string;
          forecast_date: string;
          predicted_value: number;
          confidence_low?: number | null;
          confidence_high?: number | null;
          method?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          target?: string;
          forecast_date?: string;
          predicted_value?: number;
          confidence_low?: number | null;
          confidence_high?: number | null;
          method?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "forecasts_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      integrations: {
        Row: {
          id: string;
          restaurant_id: string;
          provider: string;
          status: string;
          credentials: string | null;
          config: Json | null;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          provider: string;
          status?: string;
          credentials?: string | null;
          config?: Json | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          provider?: string;
          status?: string;
          credentials?: string | null;
          config?: Json | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "integrations_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      external_orders: {
        Row: {
          id: string;
          restaurant_id: string;
          provider: string;
          external_id: string;
          raw_payload: Json;
          mapped_order_id: string | null;
          status: string;
          received_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          provider: string;
          external_id: string;
          raw_payload: Json;
          mapped_order_id?: string | null;
          status?: string;
          received_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          provider?: string;
          external_id?: string;
          raw_payload?: Json;
          mapped_order_id?: string | null;
          status?: string;
          received_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "external_orders_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "external_orders_mapped_order_id_fkey";
            columns: ["mapped_order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_item_mappings: {
        Row: {
          id: string;
          restaurant_id: string;
          provider: string;
          external_item_id: string;
          menu_item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          provider: string;
          external_item_id: string;
          menu_item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          provider?: string;
          external_item_id?: string;
          menu_item_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_item_mappings_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_item_mappings_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
        ];
      };
      webhook_events: {
        Row: {
          id: string;
          source: string;
          event_type: string;
          idempotency_key: string;
          payload: Json;
          processed: boolean;
          processed_at: string | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          event_type: string;
          idempotency_key: string;
          payload: Json;
          processed?: boolean;
          processed_at?: string | null;
          error?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          event_type?: string;
          idempotency_key?: string;
          payload?: Json;
          processed?: boolean;
          processed_at?: string | null;
          error?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      devices: {
        Row: {
          id: string;
          restaurant_id: string;
          branch_id: string | null;
          type: string;
          name: string;
          config: Json | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          branch_id?: string | null;
          type: string;
          name: string;
          config?: Json | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          branch_id?: string | null;
          type?: string;
          name?: string;
          config?: Json | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "devices_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "devices_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "branches";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      daily_revenue: {
        Row: {
          restaurant_id: string | null;
          day: string | null;
          paid_orders: number | null;
          revenue_paise: number | null;
          avg_ticket_paise: number | null;
          cancelled_orders: number | null;
        };
        Relationships: [];
      };
      top_menu_items: {
        Row: {
          menu_item_id: string | null;
          name_snapshot: string | null;
          restaurant_id: string | null;
          order_count: number | null;
          total_qty: number | null;
          total_revenue_paise: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_restaurant_metrics: {
        Args: { p_restaurant_id: string; p_date: string };
        Returns: Json;
      };
      deduct_inventory_for_order: {
        Args: { p_order_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: 'super_admin' | 'owner' | 'manager' | 'cashier' | 'waiter' | 'chef' | 'customer';
      order_type: 'dine_in' | 'takeaway' | 'delivery';
      order_status: 'open' | 'placed' | 'in_kitchen' | 'ready' | 'served' | 'billed' | 'paid' | 'cancelled';
      item_status: 'queued' | 'cooking' | 'ready' | 'served' | 'cancelled';
      session_status: 'open' | 'bill_requested' | 'settled' | 'cancelled';
      payment_status: 'created' | 'pending' | 'success' | 'failed' | 'refunded' | 'partially_refunded';
      payment_method: 'upi' | 'card' | 'cash' | 'wallet' | 'netbanking' | 'aggregator';
      channel_type: 'dine_in' | 'takeaway' | 'own_web' | 'swiggy' | 'zomato' | 'other';
      sub_status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'paused';
      po_status: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
      expense_category: 'rent' | 'electricity' | 'gas' | 'salary' | 'supplies' | 'marketing' | 'repairs' | 'misc';
      attendance_status: 'present' | 'absent' | 'half_day' | 'leave' | 'week_off';
      kot_status: 'pending' | 'printing' | 'printed' | 'cancelled';
    };
    CompositeTypes: Record<string, never>;
  };
};

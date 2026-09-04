export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      comparison_items: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          position: number;
          side: string;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label: string;
          position?: number;
          side?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          position?: number;
          side?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      contact_requests: {
        Row: {
          budget: string | null;
          company: string | null;
          created_at: string;
          email: string;
          id: string;
          internal_notes: string | null;
          message: string;
          name: string;
          phone: string | null;
          project_type: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          internal_notes?: string | null;
          message: string;
          name: string;
          phone?: string | null;
          project_type?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          budget?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          internal_notes?: string | null;
          message?: string;
          name?: string;
          phone?: string | null;
          project_type?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faq_items: {
        Row: {
          answer: string;
          created_at: string;
          id: string;
          position: number;
          question: string;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          answer?: string;
          created_at?: string;
          id?: string;
          position?: number;
          question: string;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          answer?: string;
          created_at?: string;
          id?: string;
          position?: number;
          question?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          created_at: string;
          id: string;
          path: string;
          title: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          path: string;
          title?: string;
          url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          path?: string;
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          created_at: string;
          cta: string;
          featured: boolean;
          features: string[];
          id: string;
          name: string;
          position: number;
          price: string;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          cta?: string;
          featured?: boolean;
          features?: string[];
          id?: string;
          name: string;
          position?: number;
          price?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          cta?: string;
          featured?: boolean;
          features?: string[];
          id?: string;
          name?: string;
          position?: number;
          price?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      process_steps: {
        Row: {
          created_at: string;
          description: string;
          icon: string;
          id: string;
          position: number;
          step_number: string;
          title: string;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          position?: number;
          step_number?: string;
          title: string;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          position?: number;
          step_number?: string;
          title?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          id: string;
          image_alt: string;
          image_url: string;
          name: string;
          position: number;
          updated_at: string;
          url: string;
          visible: boolean;
        };
        Insert: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          image_alt?: string;
          image_url?: string;
          name: string;
          position?: number;
          updated_at?: string;
          url?: string;
          visible?: boolean;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          image_alt?: string;
          image_url?: string;
          name?: string;
          position?: number;
          updated_at?: string;
          url?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          description: string;
          icon: string;
          id: string;
          position: number;
          title: string;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          position?: number;
          title: string;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          position?: number;
          title?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      site_sections: {
        Row: {
          key: string;
          label: string;
          position: number;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          key: string;
          label: string;
          position?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          key?: string;
          label?: string;
          position?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      site_texts: {
        Row: {
          field_type: string;
          group_name: string;
          help: string | null;
          key: string;
          label: string;
          position: number;
          updated_at: string;
          value: string;
        };
        Insert: {
          field_type?: string;
          group_name?: string;
          help?: string | null;
          key: string;
          label: string;
          position?: number;
          updated_at?: string;
          value?: string;
        };
        Update: {
          field_type?: string;
          group_name?: string;
          help?: string | null;
          key?: string;
          label?: string;
          position?: number;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      stats: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          position: number;
          updated_at: string;
          value: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label?: string;
          position?: number;
          updated_at?: string;
          value: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          position?: number;
          updated_at?: string;
          value?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          author: string;
          created_at: string;
          id: string;
          position: number;
          quote: string;
          rating: number;
          role: string;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          author?: string;
          created_at?: string;
          id?: string;
          position?: number;
          quote: string;
          rating?: number;
          role?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          author?: string;
          created_at?: string;
          id?: string;
          position?: number;
          quote?: string;
          rating?: number;
          role?: string;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      why_points: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          position: number;
          updated_at: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label: string;
          position?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          position?: number;
          updated_at?: string;
          visible?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_admin: { Args: never; Returns: boolean };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const;

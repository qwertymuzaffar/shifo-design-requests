export interface InventoryCategory {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category_id?: number;
  description?: string;
  unit: string;
  reorder_level: number;
  unit_cost: number;
  supplier?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: InventoryCategory;
  stock?: InventoryStock[];
  total_quantity?: number;
}

export interface InventoryStock {
  id: number;
  item_id: number;
  quantity: number;
  location: string;
  expiry_date?: string;
  batch_number?: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: number;
  item_id: number;
  transaction_type: 'purchase' | 'usage' | 'adjustment' | 'disposal' | 'return';
  quantity: number;
  reference_id?: number;
  reference_type?: string;
  notes?: string;
  performed_by?: number;
  transaction_date: string;
  created_at: string;
  item?: InventoryItem;
  user?: any;
}

export interface InventoryAlert {
  id: number;
  item_id: number;
  alert_type: 'low_stock' | 'expiring_soon' | 'expired' | 'out_of_stock';
  message: string;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
  item?: InventoryItem;
}

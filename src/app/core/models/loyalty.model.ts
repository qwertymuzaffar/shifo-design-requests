export interface LoyaltyTier {
  id: number;
  name: string;
  required_points: number;
  discount_percentage: number;
  benefits: string[];
  is_active: boolean;
  created_at: string;
}

export interface PatientLoyalty {
  id: number;
  patient_id: number;
  tier_id?: number;
  total_points: number;
  available_points: number;
  lifetime_spending: number;
  created_at: string;
  updated_at: string;
  tier?: LoyaltyTier;
}

export interface LoyaltyTransaction {
  id: number;
  patient_loyalty_id: number;
  transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted' | 'bonus';
  points: number;
  reference_id?: number;
  reference_type?: string;
  description?: string;
  created_at: string;
}

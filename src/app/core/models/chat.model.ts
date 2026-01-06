export interface ChatConversation {
  id: number;
  patient_id?: number;
  staff_id?: number;
  status: 'active' | 'closed' | 'archived';
  last_message_at: string;
  created_at: string;
  updated_at: string;
  patient?: any;
  staff?: any;
  messages?: ChatMessage[];
  unread_count?: number;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_type: 'patient' | 'staff' | 'system';
  message: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender?: any;
}

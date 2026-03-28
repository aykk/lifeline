export interface TriggerRule {
  id: string;
  user_id: string;
  name: string;
  trigger_phrase: string;
  phone_number: string;
  message: string;
  created_at: string;
}

export interface CallLog {
  id: string;
  user_id: string;
  trigger_phrase: string;
  phone_number: string;
  message: string;
  success: boolean;
  created_at: string;
}

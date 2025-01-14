export interface Payment {
    _id: string;
    payee_first_name: string;
    payee_last_name: string;
    payee_payment_status: 'overdue' | 'pending' | 'due_now' | 'completed';
    payee_added_date_utc: number; // Unix timestamp
    payee_due_date: string; // 'YYYY-MM-DD'
    payee_address_line_1: string;
    payee_address_line_2: string;
    payee_city: string;
    payee_country: string;
    payee_province_or_state: string | null;
    payee_postal_code: string;
    payee_phone_number: string;
    payee_email: string;
    currency: string;
    discount_percent: number | null;
    tax_percent: number | null;
    due_date: string | null;
    due_amount: number;
    total_due?: number; // This will be calculated on the server
    evidence_file_url: string
    

  }
  
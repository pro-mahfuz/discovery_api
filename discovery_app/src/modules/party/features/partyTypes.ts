

export const partyTypeOptions = [
  { value: "customer", label: "Customer" },
  { value: "supplier", label: "Supplier" },
];

export  const statusOptions = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

export  const countries = [
  { code: "AE", label: "+971" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
];




export interface Party {
  id?: number;
  businessId?: number;
  type?: "customer" | "supplier" | "party"; // for reuse
  name: string;
  company?: string;             // optional for customers
  email?: string;
  countryCode: string;
  phoneCode: string;
  phoneNumber: string;
  address: string;
  city?: string;
  country?: string;  
  nationalId?: string;           // national ID
  tradeLicense?: string;        // for suppliers
  openingBalance?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer extends Party {
  type: 'customer';
  // customer-specific fields here
}

export interface Supplier extends Party {
  type: 'supplier';
  tradeLicense: string;
}

export interface PartyState {
  parties: Party[];
  suppliers: Supplier[];
  customers: Customer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

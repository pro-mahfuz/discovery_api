
export type OptionStringType = {
  label: string;
  value: string;
};

export type OptionBooleanType = {
  label: string;
  value: boolean;
};

export type OptionNumberType = {
  label: string;
  value: number;
};

export const RoleOptions = [
    { value: 1, label: "Admin" },
    { value: 2, label: "Manager" },
    { value: 3, label: "Sales" },
    { value: 4, label: "Purchase" },
];

export const StatusOptions: OptionBooleanType[] = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
];

export const CountryOptions = [
    { code: "AE", label: "+971" },
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
];

export const CurrencyOptions: OptionStringType[] = [
    { value: "AED", label: "AED" },
    { value: "BDT", label: "BDT" },
    { value: "USD", label: "USD" },
    { value: "CAD", label: "CAD" },
    { value: "EUR", label: "EUR" },
    { value: "SAR", label: "SAR" },
];


export const CategoryOptions: OptionNumberType[] = [
  { value: 1, label: "Fruit" },
  { value: 2, label: "Vegetable" },
];

export const ItemOptions = [
  { id: 1, value: "Orrange", categoryId: 1},
  { id: 2, value: "Carrot", categoryId: 2 },
];

export type InvoiceType = "purchase" | "sale" | "return" | "adjustment";

export const InvoiceTypeOptions: OptionStringType[] = [
  { value: "purchase", label: "Purchase" },
  { value: "sale", label: "Sale" },
  { value: "return", label: "Return" },
  { value: "adjustment", label: "Adjustment" }
];
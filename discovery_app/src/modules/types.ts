
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

export const MovementTypeOptions: OptionStringType[] = [
  { value: "in", label: "In" },
  { value: "out", label: "Out" },
  { value: "return", label: "Return" },
  { value: "damage", label: "Damaged" }
];

export const selectStyles = {
  control: (base: any, state: any) => ({
  ...base,
  borderColor: state.isFocused ? "#72a4f5ff" : "#d1d5db",
  boxShadow: state.isFocused ? "0 0 0 1px #8eb8fcff" : "none",
  padding: "0.25rem 0.5rem",
  borderRadius: "0.375rem",
  minHeight: "38px",
  fontSize: "0.875rem",
  "&:hover": {
      borderColor: "#3b82f6",
  },
  }),
  menu: (base: any) => ({
  ...base,
  zIndex: 20,
  }),
  option: (base: any, state: any) => ({
  ...base,
  backgroundColor: state.isFocused ? "#e0f2fe" : "white",
  color: "#1f2937",
  fontSize: "0.875rem",
  padding: "0.5rem 0.75rem",
  }),
};
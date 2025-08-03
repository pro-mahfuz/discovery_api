
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

export const StatusOptions = [
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


export const CategoryOptions: OptionNumberType[] = [
  { value: 1, label: "Fruit" },
  { value: 2, label: "Vegetable" },
];

export type InvoiceType = "purchase" | "sale";

export const InvoiceTypeOptions: OptionStringType[] = [
  { value: "purchase", label: "Purchase" },
  { value: "sale", label: "Sale" }
];
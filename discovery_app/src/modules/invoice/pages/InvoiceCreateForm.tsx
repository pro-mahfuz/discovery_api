import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";

import { Invoice, categoryOptions, invoiceTypeOptions, InvoiceType } from "../features/invoiceTypes";
import { create } from "../features/invoiceThunks";
import { AppDispatch } from "../../../store/store";
import { searchPartyByText } from "../../party/features/partySelectors";

export default function InvoiceCreateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<Invoice>({
    categoryId: 1,
    invoiceType: "purchase",
    partyId: 0,
    date: new Date().toISOString().split("T")[0],
    totalAmount: 0,
    note: "",
    items: [],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalAmount" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: Number(value) }));
  };

  const handleInvoiceTypeChange = (value: InvoiceType) => {
    setFormData((prev) => ({ ...prev, invoiceType: value }));
  };

  const [searchTerm, setSearchTerm] = useState("");
  const matchingParties = useSelector(searchPartyByText(searchTerm));
  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    console.log(value);
    setSearchTerm(value);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.categoryId) newErrors.categoryId = "Select Category";
    if (!formData.invoiceType.trim()) newErrors.invoiceType = "Select Invoice Type";
    if (!formData.partyId) newErrors.partyId = "Select Party";
    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (!formData.totalAmount) newErrors.totalAmount = "Amount is required";
    if (!formData.items || formData.items.length === 0) newErrors.items = "At least one item is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      await dispatch(create(formData));
      toast.success("Invoice created successfully!");
      navigate("/invoice/list");
    } catch (err) {
      toast.error("Failed to create invoice.");
      console.error("Submit error:", err);
    }
  };

  return (
    <div>
      <PageMeta title="Invoice Create" description="Form to create a new invoice" />
      <PageBreadcrumb pageTitle="Invoice Create" />

      <ComponentCard title="Fill up all fields to create a new invoice">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category */}
            <div>
              <Label>Select Category</Label>
              <Select
                options={categoryOptions}
                placeholder="Select category"
                value={String(formData.categoryId)}
                onChange={handleCategoryChange}
                className="dark:bg-dark-900"
              />
              {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
            </div>

            {/* Invoice Type */}
            <div>
              <Label>Select Invoice Type</Label>
              <Select
                options={invoiceTypeOptions}
                placeholder="Select invoice type"
                value={formData.invoiceType}
                onChange={handleInvoiceTypeChange}
                className="dark:bg-dark-900"
              />
              {errors.invoiceType && <p className="text-red-500 text-sm">{errors.invoiceType}</p>}
            </div>

            {/* Search Party */}
            <div>
              <Label>Search Party</Label>
              <input
                    type="text"
                    placeholder="Type to search party"
                    onKeyUp={handleSearchKeyUp}
                    className="border p-2 w-full rounded"
                />
            </div>

            {/* Party Dropdown */}
            <div>
              <Label>Select Party</Label>
              <Select
                options={matchingParties.map(p => ({
                    label: p.name,
                    value: String(p.id),
                }))}
                placeholder="Select party"
                value={String(formData.partyId)}
                onChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, partyId: Number(value) }))
                }
                className="dark:bg-dark-900"
              />
              {errors.partyId && <p className="text-red-500 text-sm">{errors.partyId}</p>}
            </div>

            {/* Date */}
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
            </div>

            {/* Total Amount */}
            <div>
              <Label>Total Amount</Label>
              <Input
                type="number"
                name="totalAmount"
                placeholder="Enter total amount"
                value={formData.totalAmount}
                onChange={handleChange}
              />
              {errors.totalAmount && <p className="text-red-500 text-sm">{errors.totalAmount}</p>}
            </div>

            {/* Note */}
            <div>
              <Label>Note</Label>
              <Input
                type="text"
                name="note"
                placeholder="Optional note"
                value={formData.note}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="success">Submit</Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

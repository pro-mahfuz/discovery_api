import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { ChangeEvent, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Select from "../../../components/form/Select.tsx";
import PhoneInput from "../../../components/form/group-input/PhoneInput.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { statusOptions, countries, Party } from "../features/partyTypes.ts";
import { createParty } from "../features/partyThunks.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { selectUser } from "../../auth/features/authSelectors.ts";

export default function PartyCreateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectUser);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<Party>({
    businessId: Number(authUser?.business?.id),
    type: 'party',
    name: '',
    email: '',
    countryCode: 'AE',
    phoneCode: '+971',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    nationalId: '',
    tradeLicense: '',
    openingBalance: 0,
    isActive: true,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "openingBalance" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleStatusChange = (value: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: value }));
  };

  const handlePhoneNumberChange = (countryCode: string, phoneCode: string, phoneNumber: string) => {
    setFormData((prev) => ({
      ...prev,
      countryCode,
      phoneCode,
      phoneNumber,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.type) newErrors.type = "Party type is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

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
      await dispatch(createParty(formData));
      toast.success("Party created successfully!");
      formData.type === 'supplier' ? navigate("/party/supplier/list") : navigate("/party/customer/list");
    } catch (err) {
      toast.error("Failed to create party.");
      console.error("Submit error:", err);
    }
  };

  return (
    <div>
      <PageMeta title="Supplier/Customer Create" description="Form to create new supplier or customer" />
      <PageBreadcrumb pageTitle="Supplier/Customer Create" />

      <ComponentCard title="Fill up all fields to create a new supplier or customer">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="md:col-span-1">
              <Label>Party Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="md:col-span-1">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <PhoneInput
                selectPosition="start"
                countries={countries}
                placeholder="50 000 0000"
                value={{
                  countryCode: formData.countryCode,
                  phoneCode: formData.phoneCode,
                  phoneNumber: formData.phoneNumber,
                }}
                onChange={handlePhoneNumberChange}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                placeholder="Full address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                placeholder="City name"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                placeholder="Country name"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>EID / Passport No</Label>
              <Input
                type="text"
                name="nationalId"
                placeholder="ID / Passport Number"
                value={formData.nationalId}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Trade License</Label>
              <Input
                type="text"
                name="tradeLicense"
                placeholder="Trade license number"
                value={formData.tradeLicense}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Opening Balance</Label>
              <Input
                type="number"
                name="openingBalance"
                placeholder="0.00"
                value={formData.openingBalance}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                options={statusOptions}
                placeholder="Select status"
                value={formData.isActive}
                onChange={handleStatusChange}
                className="dark:bg-dark-900"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="success">Submit</Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}




import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { ChangeEvent, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Select from "../../../components/form/Select.tsx";
import PhoneInput from "../../../components/form/group-input/PhoneInput.tsx";
import { EyeCloseIcon, EyeIcon } from "../../../icons/index.ts";
import Button from "../../../components/ui/button/Button.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUser } from "../features/index.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";

export default function UserForm() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        countryCode: "AE",
        phoneCode: "+971",
        phoneNumber: "",
        roleId: 0, // Assuming roleId is a number
        password: "",
        isActive: true,
    });

    const [showPassword, setShowPassword] = useState(false);

    const roleOptions = [
        { value: "1", label: "Admin" },
        { value: "2", label: "Manager" },
        { value: "3", label: "Sales" },
        { value: "4", label: "Purchase" },
    ];

    const statusOptions = [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
    ];

    const countries = [
        { code: "AE", label: "+971" },
        { code: "US", label: "+1" },
        { code: "GB", label: "+44" },
        { code: "CA", label: "+1" },
        { code: "AU", label: "+61" },
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleRoleChange = (roleId: string) => {
        setFormData((prev) => ({
            ...prev,
            roleId: Number(roleId), // Convert string to number
        }));
    };

    const handleStatusChange = (value: boolean) => {
        setFormData((prev) => ({
        ...prev,
        status: value,
        }));
    };

    const handlePhoneNumberChange = (countryCode: string, phoneCode: string, phoneNumber: string) => {
        setFormData((prev) => ({
            ...prev,
            countryCode: countryCode,
            phoneCode: phoneCode,
            phoneNumber: phoneNumber
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(createUser(formData));
            toast.success("User created successfully!");

            navigate("/user/list"); // Change route to your user list route
        } catch (err) {
            toast.error("Failed to create user.");
            console.error("Submit error:", err);
        }
    };

  return (
    <div>
      <PageMeta
        title="User Create"
        description="Form to create new user"
      />
      <PageBreadcrumb pageTitle="User Create" />

      <ComponentCard title="Fill up all fields to create a new user!">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>User Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter your username"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <PhoneInput
                selectPosition="start"
                countries={countries}
                placeholder="+1 (555) 000-0000"
                value={{
                  countryCode: formData.countryCode,
                  phoneCode: formData.phoneCode,
                  phoneNumber: formData.phoneNumber,
                }}
                onChange={handlePhoneNumberChange}
              />
            </div>

            <div>
              <Label>Select Role</Label>
              <Select
                options={roleOptions}
                placeholder="Select a role"
                onChange={handleRoleChange}
                className="dark:bg-dark-900"
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label>Select Status</Label>
              <Select
                options={statusOptions}
                placeholder="Select status"
                onChange={handleStatusChange}
                className="dark:bg-dark-900"
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

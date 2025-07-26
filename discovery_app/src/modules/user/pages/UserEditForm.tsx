import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { ChangeEvent, useState, useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Select from "../../../components/form/Select.tsx";
import PhoneInput from "../../../components/form/group-input/PhoneInput.tsx";
import { EyeCloseIcon, EyeIcon } from "../../../icons/index.ts";
import Button from "../../../components/ui/button/Button.tsx";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateUser, fetchUserById, selectAllUsers } from "../features/index.ts"; 
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";

export default function UserEditForm() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const users = useSelector(selectAllUsers);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        countryCode: "",
        phoneCode: "",
        phoneNumber: "",
        roleId: "", // Assuming roleId is a number
        password: "",
        isActive: false,
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

    useEffect(() => {
        const user = users.find((u) => u.id === Number(id));
        console.log("User found:", user);
        
        if (!user) {
            dispatch(fetchUserById(Number(id)));
        } else {
            setFormData({
                name: user.name,
                email: user.email,
                countryCode: user.countryCode,
                phoneCode: user.phoneCode,
                phoneNumber: user.phoneNumber,
                roleId: user?.Role?.id.toString() || "", // Convert number to string for Select
                password: "",
                isActive: !!user.isActive,
            });
        }
    }, [users, id, dispatch]);
    

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (roleId: string) => {
        setFormData((prev) => ({
            ...prev,
            roleId: roleId, // Convert string to number
        }));
    };

    const handleStatusChange = (value: boolean) => {
        setFormData((prev) => ({
        ...prev,
        isActive: value,
        }));
    };

    const handlePhoneNumberChange = (countryCode: string, phoneCode: string, phoneNumber: string) => {
        setFormData((prev) => ({
            ...prev,
            countryCode: countryCode,
            phoneCode: phoneCode,
            phoneNumber: phoneNumber,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await dispatch(updateUser({
                ...formData,
                id: Number(id),
                roleId: Number(formData.roleId), // Ensure roleId is a number
                 
            }));
            toast.success("User updated successfully!");

            // Redirect to user list after short delay
            navigate("/user/list"); // Change route to your user list route
        } catch (err) {
            toast.error("Failed to update user.");
            console.error("Submit error:", err);
        }
    };

  return (
    <div>
      <PageMeta
        title="User Edit"
        description="Form to update user"
      />
      <PageBreadcrumb pageTitle="User Edit" />

      <ComponentCard title="Edit all fields to update the user!">
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
                placeholder="(555) 000-0000"
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
                value={formData.roleId.toString()} // Convert number to string for Select
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
                  required={false} // Password is optional for update
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
                value={formData.isActive}
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

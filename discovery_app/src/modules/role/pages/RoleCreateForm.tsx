import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Checkbox from "../../../components/form/input/Checkbox.tsx";
import { toast } from "react-toastify";

import { createRole } from "../features/roleThunks.ts";
import { selectAllPermissions } from "../../permission/features/permissionSelectors.ts";
import { fetchPermission } from "../../permission/features/permissionThunks.ts";
import { AppDispatch } from "../../../store/store.ts";

export default function RoleCreateForm() {
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const permissions = useSelector(selectAllPermissions);

  const [formData, setFormData] = useState({
    roleId: Number(),
    name: "",
    permissionIds: [] as number[],
  });

  useEffect(() => {
    
    if (!permissions || permissions.length === 0) {
        dispatch(fetchPermission());
    }
    
  }, [permissions, dispatch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     try {
        await dispatch(createRole(formData));
        toast.success("Role updated successfully!");

        // Redirect to user list after short delay
        navigate("/role/list"); // Change route to your user list route
    } catch (err) {
        toast.error("Failed to update role.");
        console.error("Submit error:", err);
    }
  };

  return (
    <>
      <PageMeta title="Role Edit" description="Role Edit" />
      <PageBreadcrumb pageTitle="Role Edit" />

      <ComponentCard title="Fill up all fields to create a new role!">
        <form onSubmit={handleSubmit} className="space-y-5">
          
            <div className="md:w-1/2">
              <Label>Role Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter role name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-4 gap-2">
                {permissions.map((permission) => (
                  <Checkbox
                    key={permission.id}
                    id={`perm-${permission.id}`}
                    label={permission.name}
                    checked={formData.permissionIds.includes(Number(permission.id))}
                    onChange={() => handleCheckboxChange(Number(permission.id))}
                  />
                ))}
              </div>
            </div>
          

          <div className="flex justify-end">
            <Button variant="success">
              Submit
            </Button>
          </div>
        </form>
      </ComponentCard>

    </>
  );
}

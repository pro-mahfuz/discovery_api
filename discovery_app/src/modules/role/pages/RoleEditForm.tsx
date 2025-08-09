import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Checkbox from "../../../components/form/input/Checkbox.tsx";
import Select from "../../../components/form/Select.tsx";
import { toast } from "react-toastify";

import { fetchRoleById, updateRole } from "../features/roleThunks.ts";
import { selectAllRoles } from "../features/roleSelectors.ts";
import { selectUser } from "../../auth/features/authSelectors.ts";
import { selectAllPermissions } from "../../permission/features/permissionSelectors.ts";
import { fetchPermission } from "../../permission/features/permissionThunks.ts";
import { AppDispatch } from "../../../store/store.ts";
import { StatusOptions } from "../../types.ts";

export default function RoleEditForm() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const authUser = useSelector(selectUser);
  const roles = useSelector(selectAllRoles);
  const permissions = useSelector(selectAllPermissions);


  const [formData, setFormData] = useState({
    businessId: Number(authUser?.business?.id),
    roleId: 0,
    name: "",
    action: "",
    isActive: true,
    permissionIds: [] as number[],
  });

  

  useEffect(() => {    
    const role = roles.find((r) => r.id === Number(id));
    console.log("role Id- ", id);
    if (!role) {
        dispatch(fetchRoleById(Number(id)));
        console.log("Role found:", role);
    } else {
        setFormData({
            businessId: role.businessId,
            roleId: role.id,
            name: role.name,
            action: role.action,
            isActive: !!role.isActive,
            permissionIds: role.permissions?.map((p) => Number(p.id)) || [],
        });
    }

    if (!permissions || permissions.length === 0) {
        dispatch(fetchPermission());
    }
    
  }, [id, roles, permissions, dispatch]);

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

  const handleStatusChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     try {
        console.log(formData)
        await dispatch(updateRole(formData));
        toast.success("Role updated successfully!");

        navigate("/role/list");
    } catch (err) {
        toast.error("Failed to update role.");
        console.error("Submit error:", err);
    }
  };

  return (
    <>
      <PageMeta title="Role Edit" description="Role Edit" />
      <PageBreadcrumb pageTitle="Role Edit" />

      <ComponentCard title="Fill up all fields to edit role!">
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-2">
              <div>
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
                <Label>Select Status</Label>
                <Select
                  options={StatusOptions}
                  placeholder="Select status"
                  value={formData.isActive}
                  onChange={handleStatusChange}
                  className="dark:bg-dark-900"
                />
              </div>
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
            <Button type="submit" variant="success">
              Submit
            </Button>
          </div>
        </form>
      </ComponentCard>

    </>
  );
}

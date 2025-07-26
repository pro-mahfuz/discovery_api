import { Role, Permission } from "../../models/model.js";

export const getAllPermissions = async () => {
    const permissions = await Permission.findAll();
    if (!permissions || permissions.length === 0) throw { status: 400, message: "No roles found" };
    return permissions;
}

export const setPermissionsForRole = async ({ roleId, name, isActive, permissionIds }) => {
    if (!Array.isArray(permissionIds)) {
        throw { status: 400, message: "permissionIds[] are required" };
    }
    console.log("name", name);
    let role = await Role.findByPk(roleId);

    if (!role) {
        role = await Role.create({ name });
    }else {
        role = await role.update({ name, isActive });
    }

    const permissions = await Permission.findAll({
        where: { id: permissionIds },
    });

    const setPermissions = await role.setPermissions(permissions); // overwrite existing ones
    return getPermissionsForRole(role.id);
    
};

export const getPermissionsForRole = async (roleId) => {
    if (!roleId) throw { status: 400, message: "roleId is required" };

    const role = await Role.findByPk(roleId, {
        include: Permission,
    });

    if (!role) throw { status: 404, message: "Role not found" };

    return role; // returns an array of permissions
};
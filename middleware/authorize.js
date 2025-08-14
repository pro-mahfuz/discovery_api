import { Role, Permission } from "../models/model.js";
/**
 * Middleware to authorize user based on permissions.
 * It checks if the user has the required permission to access a route.
 *
 * @param {string} permissionName - The name of the permission to check.
 * @returns {function} - Express middleware function.
 */
export const authorize = (permissionAction) => {
  return async (req, res, next) => {
    try {
      const userRole = await Role.findByPk(req.user.roleId, {
        include: {
          model: Permission,
          through: { attributes: [] },  // exclude RolePermission fields
          as: "permissions" 
        },
      });

      const hasPermission = userRole?.permissions?.some(
        (perm) => perm.action === permissionAction
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("Authorization error:", err);
      res.status(500).json({ message: "Server error during authorization" });
    }
  };
};


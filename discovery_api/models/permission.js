export default (sequelize, DataTypes) => {
  const Permission = sequelize.define("Permission", {
    name: DataTypes.STRING,
    action: {
      type: DataTypes.STRING,
      //dunique: true,
      allowNull: false,
    },
  });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission, // ✅ Use actual model
      foreignKey: "permissionId",
      otherKey: "roleId"
    });
  };

  return Permission;
};
// This code defines a Permission model using Sequelize ORM.
// The Permission model has a single field, action, which is unique.
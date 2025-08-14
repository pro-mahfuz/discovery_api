export default (sequelize, DataTypes) => {
  const Permission = sequelize.define("Permission", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    action: {
      type: DataTypes.STRING,
      //dunique: true,
      allowNull: false,
    },
  }, {
    tableName: "permissions",
    timestamps: true, // createdAt & updatedAt
    underscored: false, // if you prefer snake_case in DB columns
  });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission, // 
      foreignKey: "permissionId",
      otherKey: "roleId"
    });
  };

  return Permission;
};
// This code defines a Permission model using Sequelize ORM.
// The Permission model has a single field, action, which is unique.
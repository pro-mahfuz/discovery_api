export default (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    businessId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    },
    name: {
      type: DataTypes.STRING,
      //unique: true,
      allowNull: false,
    },
    action: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });

  Role.associate = (models) => {
    // One Role has many Users
    Role.hasMany(models.User, { foreignKey: "roleId" });

    // Role ↔ Permission (many-to-many via RolePermission table)
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: "roleId",
      otherKey: "permissionId",
      as: "permissions",
    });

    Role.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Role;
};

// This code defines a Role model using Sequelize ORM.
// The Role model has a single field, name, which is unique.
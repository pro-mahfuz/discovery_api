export default (sequelize, DataTypes) => {
  const Warehouse = sequelize.define("Warehouse", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "warehouses",
    timestamps: true,
    underscored: false,
  });

  Warehouse.associate = (models) => {
    Warehouse.hasMany(models.Stock, {
      foreignKey: "warehouseId",
      as: "stock",
    });
  };

  return Warehouse;
};

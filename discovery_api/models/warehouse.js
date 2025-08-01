export default (sequelize, DataTypes) => {
  const Warehouse = sequelize.define("Warehouse", {
    businessId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    },
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

    Warehouse.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Warehouse;
};

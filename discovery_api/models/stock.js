export default (sequelize, DataTypes) => {
  const Stock = sequelize.define("Stock", {
    invoiceType: {
      type: DataTypes.STRING(20), // e.g. 'purchase', 'sale'
      allowNull: true,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    movementType: {
      type: DataTypes.ENUM('in', 'out', 'damaged'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Warehouses', // Ensure this matches the actual table name
        key: 'id',
      },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items', // Ensure this matches the actual table name
        key: 'id',
      },
    },
  }, {
    tableName: 'stocks',
    timestamps: true, // `created_at` is manually handled
    underscored: false,
  });

  Stock.associate = (models) => {
    Stock.belongsTo(models.Item, {
      foreignKey: 'itemId',
      as: 'item',
    });

    Stock.belongsTo(models.Warehouse, {
      foreignKey: 'warehouseId',
      as: 'warehouse',
    });
  };

  return Stock;
};

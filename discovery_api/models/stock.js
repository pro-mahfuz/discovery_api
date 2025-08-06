export default (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'businesses',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    invoiceType: {
      type: DataTypes.STRING(20), // 'purchase' or 'sale'
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stockUnit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    containerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'containers', // must match tableName exactly
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
    },
  }, {
    tableName: 'stocks',
    timestamps: true,
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

    Stock.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    Stock.belongsTo(models.Container, {
      foreignKey: 'containerId',
      as: 'container',
    });
  };

  return Stock;
};

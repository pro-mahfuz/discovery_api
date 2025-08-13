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
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'parties',
        key: 'id',
      },
    },
    movementType: {
      type: DataTypes.ENUM('stock_in', 'stock_out', 'damaged'),
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    bankId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'banks',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    containerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'containers', // must match tableName exactly
        key: 'id',
      }
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
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

    Stock.belongsTo(models.Invoice, {
      foreignKey: 'invoiceId',
      as: 'invoice',
    });

    Stock.belongsTo(models.Warehouse, {
      foreignKey: 'warehouseId',
      as: 'warehouse',
    });

    Stock.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      as: 'bank',
    });

    Stock.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    Stock.belongsTo(models.Container, {
      foreignKey: 'containerId',
      as: 'container',
    });

    Stock.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "createdByUser"
    });

    Stock.belongsTo(models.User, {
      foreignKey: "updatedBy",
      as: "updatedByUser"
    });

    Stock.belongsTo(models.User, {
      foreignKey: "deletedBy",
      as: "deletedByUser"
    });
  };

  return Stock;
};

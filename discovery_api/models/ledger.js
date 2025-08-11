export default (sequelize, DataTypes) => {
  const Ledger = sequelize.define("Ledger", {
    businessId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories', // Ensure this matches the actual table name
        key: 'id',
      },
    },
    transactionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['purchase', 'sale', 'saleReturn', 'stock_in', 'stock_out', 'payment_in', 'payment_out']],
      },
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Invoices',
        key: 'id'
      }
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Payments',
        key: 'id'
      }
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stocks',  // <-- Problem likely here
        key: 'id'
      }
    },
    bankId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'banks',  // <-- Problem likely here
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    debit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    credit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    debitQty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    creditQty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
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
  }, {
    tableName: "ledgers",
    timestamps: true, // createdAt & updatedAt
    underscored: false, // if you prefer snake_case in DB columns
  });

  Ledger.associate = (models) => {
    // Optional: If you have Party model
    Ledger.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Ledger.belongsTo(models.Party, {
      foreignKey: 'partyId',
      as: 'party',
    });

    Ledger.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });

    // Optional associations depending on transactionType
    Ledger.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
    Ledger.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
    Ledger.belongsTo(models.Stock, { foreignKey: 'stockId', as: 'stock' });

    Ledger.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "createdByUser"
    });

    Ledger.belongsTo(models.User, {
      foreignKey: "updatedBy",
      as: "updatedByUser"
    });

    Ledger.belongsTo(models.Bank, {
      foreignKey: "bankId",
      as: "bank"
    });
  };

  return Ledger;
};

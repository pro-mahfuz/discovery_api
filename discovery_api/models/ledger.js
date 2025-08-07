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
        isIn: [['purchase', 'sale', 'payment_in', 'payment_out', 'opening_balance', 'return']],
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
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    debit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    credit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    }
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
    Ledger.belongsTo(models.Invoice, { foreignKey: 'referenceId', as: 'invoice' });
    Ledger.belongsTo(models.Payment, { foreignKey: 'referenceId', as: 'payment' });
  };

  return Ledger;
};

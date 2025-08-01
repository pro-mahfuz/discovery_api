export default (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    businessId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories', // Ensure this matches the actual table name
        key: 'id',
      },
    },
    paymentType: {
      type: DataTypes.ENUM('payment_in', 'payment_out'),
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank'),
      allowNull: false,
    },
    paymentDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: "payments",
    timestamps: true, // createdAt & updatedAt
    underscored: false, // if you prefer snake_case in DB columns
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Category, {
      foreignKey: "partyId",
      as: "party",
    });

    Payment.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Payment.belongsTo(models.Invoice, {
      foreignKey: "invoiceId",
      as: "invoice",
    });

    Payment.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Payment;
};

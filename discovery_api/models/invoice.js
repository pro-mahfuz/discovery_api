export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
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
    invoiceType: {
      type: DataTypes.ENUM,
      values: ['purchase', 'sale'],
      allowNull: false,
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Parties', // Correct model name — assuming your Party table is named 'Parties'
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "invoices",
    timestamps: true, // createdAt & updatedAt
    underscored: false, // if you prefer snake_case in DB columns
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Invoice.belongsTo(models.Party, {
      foreignKey: 'partyId',
      as: 'party',
    });

    Invoice.hasMany(models.InvoiceItem, {
      foreignKey: 'invoiceId',
      as: 'items',
    });

    Invoice.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Invoice;
};

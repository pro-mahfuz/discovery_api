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
    invoiceRefId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceType: {
      type: DataTypes.ENUM,
      values: ['purchase', 'sale', 'saleReturn'],
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
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    isVat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    vatPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    grandTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
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

    Invoice.hasMany(models.Payment, {
      foreignKey: "invoiceId",
      as: "payments",
    });

    Invoice.hasMany(models.Stock, {
      foreignKey: "invoiceId",
      as: "stocks",
    });

    Invoice.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "createdByUser"
    });

    Invoice.belongsTo(models.User, {
      foreignKey: "updatedBy",
      as: "updatedByUser"
    });

    Invoice.belongsTo(models.User, {
      foreignKey: "deletedBy",
      as: "deletedByUser"
    });
  };

  return Invoice;
};

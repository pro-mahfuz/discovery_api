export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
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
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATE,
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
      onDelete: 'CASCADE',
    });
  };

  return Invoice;
};

export default (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define("InvoiceItem", {
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Invoices', // Ensure this matches your actual table name
        key: 'id',
      },
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items', // Ensure this matches your actual table name
        key: 'id',
      },
    },
    containerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Containers', // Ensure this matches your actual table name
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    subTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  }, {
    tableName: "invoiceitems",
    timestamps: true, // createdAt & updatedAt
    underscored: false, // if you prefer snake_case in DB columns
  });

  InvoiceItem.associate = (models) => {
    InvoiceItem.belongsTo(models.Invoice, {
      foreignKey: "invoiceId",
      as: "invoice",
    });
    InvoiceItem.belongsTo(models.Item, {
      foreignKey: "itemId",
      as: "item",
    });
    InvoiceItem.belongsTo(models.Container, {
      foreignKey: "containerId",
      as: "container",
    });
  };

  return InvoiceItem;
};

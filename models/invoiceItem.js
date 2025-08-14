// models/InvoiceItem.js
export default (sequelize, DataTypes) => {
  const InvoiceItem = sequelize.define("InvoiceItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    containerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },
    subTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },
  }, {
    tableName: "invoiceitems",
    timestamps: true,
    underscored: false,
  });

  InvoiceItem.associate = (models) => {
    InvoiceItem.belongsTo(models.Invoice, {
      foreignKey: "invoiceId",
      as: "invoice",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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

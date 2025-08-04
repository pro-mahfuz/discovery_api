export default (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
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
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "items",
    timestamps: true, // createdAt & updatedAt
    underscored: false, // set to true if using snake_case (e.g., created_at)
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category", // refers to related Category
    });

    Item.hasMany(models.InvoiceItem, {
      foreignKey: "itemId",
      as: "invoiceItems", // refers to related InvoiceItems
    });
  };

  return Item;
};

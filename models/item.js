export default (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "items",
    timestamps: true
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    
    Item.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Item;
};

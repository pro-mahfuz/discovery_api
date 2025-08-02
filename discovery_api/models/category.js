export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    businessId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: "categories",
    timestamps: true, // createdAt & updatedAt
    underscored: false, // set to true if using snake_case (e.g., created_at)
  });

  Category.associate = (models) => {
    Category.hasMany(models.Item, {
      foreignKey: "categoryId",
      as: "items", // refers to related Items
    });

    Category.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Category;
};

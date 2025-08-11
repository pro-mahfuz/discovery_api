export default (sequelize, DataTypes) => {
  const Bank = sequelize.define("Bank", {
    businessId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Businesses', // name of Target model
        key: 'id' // key in Target model that we're referencing
      }
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "banks",
    timestamps: true,
    underscored: false,
  });

  Bank.associate = (models) => {
    Bank.hasMany(models.Payment, {
      foreignKey: "bankId",
      as: "payment",
    });

    Bank.hasMany(models.Stock, {
      foreignKey: "bankId",
      as: "stock"
    });
  };

  return Bank;
};

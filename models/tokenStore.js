export default (sequelize, DataTypes) => {
  const TokenStore = sequelize.define("TokenStore", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      //unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  TokenStore.associate = (models) => {
    TokenStore.belongsTo(models.User, { foreignKey: "userId" });
  };

  return TokenStore;
};
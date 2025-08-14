export default (sequelize, DataTypes) => {
  const Business = sequelize.define("Business", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessName: { type: DataTypes.STRING, allowNull: false },
    businessLogo: { type: DataTypes.STRING },
    businessLicenseNo: { type: DataTypes.STRING },
    businessLicenseCopy: { type: DataTypes.STRING },
    ownerName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    countryCode: DataTypes.STRING,
    phoneCode: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    trnNo: DataTypes.STRING,
    vatPercentage: { type: DataTypes.FLOAT, defaultValue: 0 },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: "businesses",
    timestamps: true
  });

  Business.associate = (models) => {
    Business.hasMany(models.User, {
      foreignKey: "businessId",
      as: "users"
    });
    Business.hasMany(models.Role, {
      foreignKey: "businessId",
      as: "roles"
    });
  };

  return Business;
};

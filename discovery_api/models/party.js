export default (sequelize, DataTypes) => {
  const Party = sequelize.define("Party", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING, // You had `DataTypes.DATE`, which is incorrect for a name
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationalId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tradeLicense: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openingBalance: {
      type: DataTypes.FLOAT, // You had `DataTypes.Integer` (should be capital `INTEGER`)
      allowNull: true,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Party.associate = (models) => {
    // Example: Party.hasMany(models.Invoice);
  };

  return Party;
};

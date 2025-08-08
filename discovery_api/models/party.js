export default (sequelize, DataTypes) => {
  const Party = sequelize.define("Party", {
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Businesses',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
    trnNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openingBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  // Associations
  Party.associate = (models) => {
    Party.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business",
    });

    Party.hasMany(models.Payment, {
      foreignKey: "partyId",
      as: "payments", // changed 'party' to 'payments' for clarity
    });

    Party.hasMany(models.Invoice, {
      foreignKey: "partyId",
      as: "invoices", // changed 'invoice' to 'invoices' for clarity
    });
  };

  return Party;
};

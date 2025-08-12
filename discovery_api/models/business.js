export default (sequelize, DataTypes) => {
  const Business = sequelize.define("Business", 
    {
      businessName: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      businessLogo: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      businessLicenseNo: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      businessLicenseCopy: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      ownerName: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      email: { 
        type: DataTypes.STRING,
        //unique: true 
      },
      countryCode: DataTypes.STRING,
      phoneCode: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      trnNo: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      vatPercentage: { 
        type: DataTypes.FLOAT, 
        allowNull: true,
        defaultValue: 0
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
  );

  Business.associate = (models) => {
    Business.hasMany(models.User, {
      foreignKey: "businessId",
      as: "users"
    });
  };

  return Business;
};
/*  This code defines a User model using Sequelize ORM. 
    The User model has two fields: email and password, with email being unique. 
    It also establishes an association with a Role model, indicating that each user belongs to a role.
*/
/*  The User model is defined with Sequelize, which is an ORM for Node.js. 
    It includes fields for email and password, with email being unique. 
    The model also establishes a relationship with a Role model, indicating that each user belongs to a specific role.
*/
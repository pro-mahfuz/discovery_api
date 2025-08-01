export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", 
    {
      businessId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Businesses', // name of Target model
          key: 'id' // key in Target model that we're referencing
        }
      },
      name: DataTypes.STRING,
      email: { 
        type: DataTypes.STRING,
        //unique: true 
      },
      countryCode: DataTypes.STRING,
      phoneCode: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      password: DataTypes.STRING,
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Roles', // name of Target model
          key: 'id' // key in Target model that we're referencing
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      // Default scope: exclude password from all queries
      defaultScope: {
        attributes: { exclude: ["password"] },
      },

      // Optional: named scopes if you need the password explicitly
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: "userId",
      as: "profile"
    });
    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role"
    });
    User.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return User;
};
/*  This code defines a User model using Sequelize ORM. 
    The User model has two fields: email and password, with email being unique. 
    It also establishes an association with a Role model, indicating that each user belongs to a role.
*/
/*  The User model is defined with Sequelize, which is an ORM for Node.js. 
    It includes fields for email and password, with email being unique. 
    The model also establishes a relationship with a Role model, indicating that each user belongs to a specific role.
*/
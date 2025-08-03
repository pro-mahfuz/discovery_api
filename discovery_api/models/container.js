export default (sequelize, DataTypes) => {
  const Container = sequelize.define("Container", 
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      blNo: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      soNo: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      oceanVesselName: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      voyageNo: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      agentDetails: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
      placeOfReceipt: { 
        type: DataTypes.STRING,
        allowNull: true  
      },
      portOfLoading: { 
        type: DataTypes.STRING,
        allowNull: true  
      },
      portOfDischarge: { 
        type: DataTypes.STRING,
        allowNull: true  
      },
      placeOfDelivery: { 
        type: DataTypes.STRING,
        allowNull: true  
      },
      containerNo: { 
        type: DataTypes.STRING,
        allowNull: false  
      },
      sealNo: { 
        type: DataTypes.STRING,
        allowNull: true  
      },
      itemId: { 
        type: DataTypes.INTEGER,
        allowNull: false  
      },
      containerQuantity: { 
        type: DataTypes.INTEGER,
        allowNull: false  
      },
      containerUnit: { 
        type: DataTypes.STRING,
        allowNull: false  
      },
      stockQuantity: { 
        type: DataTypes.INTEGER,
        allowNull: false  
      },
      stockUnit: { 
        type: DataTypes.STRING,
        allowNull: false  
      },
    },
  );

  Container.associate = (models) => {
    Container.belongsTo(models.Item, {
      foreignKey: 'itemId',
      as: 'item',
    });
  };

  return Container;
};
/*  This code defines a User model using Sequelize ORM. 
    The User model has two fields: email and password, with email being unique. 
    It also establishes an association with a Role model, indicating that each user belongs to a role.
*/
/*  The User model is defined with Sequelize, which is an ORM for Node.js. 
    It includes fields for email and password, with email being unique. 
    The model also establishes a relationship with a Role model, indicating that each user belongs to a specific role.
*/
export default (sequelize, DataTypes) => {
  const Container = sequelize.define('Container', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    blNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oceanVesselName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    voyageNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agentDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeOfReceipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portOfLoading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portOfDischarge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeOfDelivery: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    containerNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sealNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'containers',
  });

  Container.associate = (models) => {

    Container.hasMany(models.Stock, {
      foreignKey: 'containerId',
      as: 'stocks'
    });

    Container.belongsTo(models.User, {
      foreignKey: 'createdUserId',
      as: 'createdBy',
    });

    Container.belongsTo(models.User, {
      foreignKey: 'updatedUserId',
      as: 'updatedBy',
    });
  };

  return Container;
};

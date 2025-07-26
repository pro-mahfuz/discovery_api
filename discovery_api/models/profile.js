export default (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    fullName: { type: DataTypes.STRING },
    birthDate: { type: DataTypes.DATE },
    gender: { type: DataTypes.STRING },
    nationality: { type: DataTypes.STRING },
    contactEmail: { type: DataTypes.STRING },
    countryCode: { type: DataTypes.STRING },
    phoneCode: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING },
    profilePicture: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };

  return Profile;
};

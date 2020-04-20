const recommendation = (sequelize, DataTypes) => {
  const Recommendation = sequelize.define(
    'Recommendation',
    {
      message: { type: DataTypes.STRING, allowNull: false },
      medicalRecord_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.DATE(6), allowNull: false, defaultValue: DataTypes.NOW },
    },
    { tableName: 'recommendation', timestamps: false }
  );

  Recommendation.add = async (input, user_id) => await Recommendation.create({ ...input, user_id });

  Recommendation.modify = async ({ id, ...rest }, user_id) =>
    await Recommendation.update({ ...rest, user_id }, { where: { id } });

  return Recommendation;
};

export default recommendation;

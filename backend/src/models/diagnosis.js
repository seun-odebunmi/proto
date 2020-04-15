const diagnosis = (sequelize, DataTypes) => {
  const Diagnosis = sequelize.define(
    'Diagnosis',
    {
      value: { type: DataTypes.STRING(500), allowNull: false }
    },
    { tableName: 'diagnosis', timestamps: false }
  );

  Diagnosis.getAll = async () => await Diagnosis.findAll({}).map(el => el.get({ plain: true }));

  return Diagnosis;
};

export default diagnosis;

const visualAcuity = (sequelize, DataTypes) => {
  const VisualAcuity = sequelize.define(
    'VisualAcuity',
    {
      value: { type: DataTypes.STRING(15), allowNull: false }
    },
    { tableName: 'visual_acuity' }
  );

  VisualAcuity.getVAValues = async () =>
    VisualAcuity.findAll({
      attributes: ['value']
    });

  return VisualAcuity;
};

export default visualAcuity;

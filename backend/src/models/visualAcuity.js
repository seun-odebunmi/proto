const visualAcuity = (sequelize, DataTypes) => {
  const VisualAcuity = sequelize.define(
    'VisualAcuity',
    {
      value: { type: DataTypes.STRING(15), allowNull: false }
    },
    { tableName: 'visual_acuity', timestamps: false }
  );

  VisualAcuity.getAll = async () => await VisualAcuity.findAll().map(el => el.get({ plain: true }));

  VisualAcuity.getVAValues = async () =>
    await VisualAcuity.findAll({
      attributes: ['value']
    }).map(el => el.get({ plain: true }));

  return VisualAcuity;
};

export default visualAcuity;

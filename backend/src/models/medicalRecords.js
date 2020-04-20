import moment from 'moment';

const medicalRecords = (sequelize, DataTypes) => {
  const { Diagnosis, VisualAcuity, Recommendation } = sequelize.models;
  const { Op } = DataTypes;

  const MedicalRecords = sequelize.define(
    'MedicalRecords',
    {
      Age: { type: DataTypes.INTEGER, allowNull: false },
      Gender: { type: DataTypes.INTEGER, allowNull: false },
      HistoryofPresentIllness: { type: DataTypes.STRING, allowNull: true },
      VA_OD: { type: DataTypes.INTEGER, allowNull: true },
      VA_OS: { type: DataTypes.INTEGER, allowNull: true },
      PH_OD: { type: DataTypes.INTEGER, allowNull: true },
      PH_OS: { type: DataTypes.INTEGER, allowNull: true },
      Glasses_OD: { type: DataTypes.INTEGER, allowNull: true },
      Glasses_OS: { type: DataTypes.INTEGER, allowNull: true },
      Diagnosis: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: true },
      date: { type: DataTypes.DATE(6), allowNull: true, defaultValue: DataTypes.NOW },
    },
    { tableName: 'medicalrecords', timestamps: false }
  );

  MedicalRecords.associate = (models) => {
    MedicalRecords.belongsTo(models.Diagnosis, { as: 'diagnosis', foreignKey: 'Diagnosis' });
    MedicalRecords.belongsTo(models.VisualAcuity, { as: 'vaod', foreignKey: 'VA_OD' });
    MedicalRecords.belongsTo(models.VisualAcuity, { as: 'vaos', foreignKey: 'VA_OS' });
    MedicalRecords.belongsTo(models.VisualAcuity, { as: 'phod', foreignKey: 'PH_OD' });
    MedicalRecords.belongsTo(models.VisualAcuity, { as: 'phos', foreignKey: 'PH_OS' });
    MedicalRecords.belongsTo(models.VisualAcuity, { as: 'glassesod', foreignKey: 'Glasses_OD' });
    MedicalRecords.belongsTo(models.VisualAcuity, { as: 'glassesos', foreignKey: 'Glasses_OD' });
    MedicalRecords.hasOne(models.Recommendation, {
      as: 'Recommendation',
      foreignKey: 'medicalRecord_id',
    });
  };

  MedicalRecords.getAll = async () =>
    await MedicalRecords.findAll().map((el) => el.get({ plain: true }));

  MedicalRecords.getByUserId = async ({ user_id, sortBy, page, size }) =>
    await MedicalRecords.findAll({
      include: [
        { model: Diagnosis, as: 'diagnosis' },
        { model: VisualAcuity, as: 'vaod' },
        { model: VisualAcuity, as: 'vaos' },
        { model: VisualAcuity, as: 'phod' },
        { model: VisualAcuity, as: 'phos' },
        { model: VisualAcuity, as: 'glassesod' },
        { model: VisualAcuity, as: 'glassesos' },
        { model: Recommendation, as: 'Recommendation' },
      ],
      ...(sortBy.length > 1 && { order: [[DataTypes.literal(sortBy[0]), sortBy[1]]] }),
      ...(page && { offset: +page }),
      ...(size && { limit: +size }),
      where: {
        user_id: { ...(!user_id && { [Op.not]: null }), ...(user_id && { [Op.eq]: user_id }) },
      },
    })
      .map((el) => el.get({ plain: true }))
      .then((result) =>
        result.map((d) => ({
          ...d,
          diagnosis: { ...d.diagnosis, value: d.diagnosis.value.split('-').join(' ') },
          date: moment.parseZone(new Date(d.date)).format('DD-MM-YYYY HH:mm:ss'),
        }))
      );

  MedicalRecords.createRecord = async (input) => await MedicalRecords.create(input);

  return MedicalRecords;
};

export default medicalRecords;

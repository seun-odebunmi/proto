const medicalRecords = (sequelize, DataTypes) => {
  const MedicalRecords = sequelize.define(
    'MedicalRecords',
    {
      Age: { type: DataTypes.INTEGER, allowNull: false },
      Gender: { type: DataTypes.INTEGER, allowNull: false },
      HistoryofPresentIllness: { type: DataTypes.STRING, allowNull: false },
      VA_OD: { type: DataTypes.INTEGER, allowNull: true },
      VA_OS: { type: DataTypes.INTEGER, allowNull: true },
      PH_OD: { type: DataTypes.INTEGER, allowNull: true },
      PH_OS: { type: DataTypes.INTEGER, allowNull: true },
      Glasses_OD: { type: DataTypes.INTEGER, allowNull: true },
      Glasses_OS: { type: DataTypes.INTEGER, allowNull: true },
      Diagnosis: { type: DataTypes.INTEGER, allowNull: false }
    },
    { tableName: 'medicalrecords', timestamps: false }
  );

  MedicalRecords.getAll = async () =>
    await MedicalRecords.findAll().map(el => el.get({ plain: true }));

  return MedicalRecords;
};

export default medicalRecords;

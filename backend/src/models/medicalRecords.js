const medicalRecords = (sequelize, DataTypes) => {
  const MedicalRecords = sequelize.define(
    'MedicalRecords',
    {
      Age: { type: DataTypes.INTEGER, allowNull: false },
      Gender: { type: DataTypes.STRING(1), allowNull: false },
      HistoryofPresentIllness: { type: DataTypes.STRING, allowNull: false },
      VA_OD: { type: DataTypes.STRING(25), allowNull: false },
      VA_OS: { type: DataTypes.STRING(25), allowNull: false },
      PH_OD: { type: DataTypes.STRING(18), allowNull: false },
      PH_OS: { type: DataTypes.STRING(18), allowNull: false },
      Glasses_OD: { type: DataTypes.STRING(7), allowNull: false },
      Glasses_OS: { type: DataTypes.STRING(7), allowNull: false },
      ExternalExam: { type: DataTypes.STRING(34), allowNull: false },
      Diagnosis: { type: DataTypes.STRING, allowNull: false }
    },
    { tableName: 'medicalrecords' }
  );

  // MedicalRecords.createObject = (code, longUrl) =>
  //   Url.findOrCreate({
  //     where: { code, longUrl },
  //     defaults: { code, longUrl }
  //   });

  // MedicalRecords.getLongUrl = async code => Url.findOne({ where: { code } });

  // MedicalRecords.getUrls = async () => Url.findAll();

  return MedicalRecords;
};

export default medicalRecords;

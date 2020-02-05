const url = (sequelize, DataTypes) => {
  const Url = sequelize.define(
    'Url',
    {
      code: { type: DataTypes.STRING(6), unique: true },
      longUrl: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      }
    },
    { tableName: 'url' }
  );

  Url.createObject = (code, longUrl) =>
    Url.findOrCreate({
      where: { code, longUrl },
      defaults: { code, longUrl }
    });

  Url.getLongUrl = async code => Url.findOne({ where: { code } });

  Url.getUrls = async () => Url.findAll();

  return Url;
};

export default url;

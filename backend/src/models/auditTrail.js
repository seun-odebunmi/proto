import { handleError } from '../helpers';
import { UTILS } from '../constants';

const auditTrail = (sequelize, DataTypes) => {
  const Op = DataTypes.Op;

  const AuditTrail = sequelize.define(
    'AuditTrail',
    {
      auditType: DataTypes.INTEGER,
      createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      details: DataTypes.STRING,
      sourceAccount: DataTypes.STRING,
      userIp: DataTypes.STRING,
      actionOn: DataTypes.STRING,
      actionBy: DataTypes.STRING,
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      reasonForAction: DataTypes.STRING
    },
    { tableName: 'audittrails' }
  );

  AuditTrail.associate = models => {
    AuditTrail.belongsTo(models.Users, {
      as: 'user',
      foreignKey: 'portalUser_id'
    });
    AuditTrail.belongsTo(models.Institutions, {
      as: 'institution',
      foreignKey: 'institution_id'
    });
  };

  AuditTrail.fetchAuditTrail = async input => {
    try {
      const {
        pageNumber = 1,
        pageSize = 1000,
        startDate,
        endDate,
        sourceAccount,
        actionOn,
        actionBy,
        auditType,
        institution_id
      } = input;
      const offset = (pageNumber - 1) * pageSize;

      return await AuditTrail.findAndCountAll({
        where: {
          ...(sourceAccount && { sourceAccount }),
          ...(actionOn && { actionOn }),
          ...(actionBy && { actionBy }),
          ...(institution_id && { institution_id }),
          ...(auditType && { auditType }),
          ...(startDate &&
            endDate && {
              createDate: {
                [Op.gte]: UTILS.formatDate(startDate),
                [Op.lte]: UTILS.formatDate(endDate)
              }
            })
        },
        offset,
        limit: pageSize
      });
    } catch (err) {
      handleError(err);
    }
  };

  AuditTrail.createAuditTrail = async auditObj => {
    try {
      return await AuditTrail.create({ ...auditObj });
    } catch (err) {
      handleError(err);
    }
  };

  return AuditTrail;
};

export default auditTrail;

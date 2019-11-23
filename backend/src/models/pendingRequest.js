import { UTILS } from '../constants';
import { handleError } from '../helpers';

const pendingRequests = (sequelize, DataTypes) => {
  const Op = DataTypes.Op;
  const { AuditTrail } = sequelize.models;

  const PendingRequests = sequelize.define(
    'PendingRequests',
    {
      actionOn: DataTypes.STRING,
      additionalInfo: DataTypes.TEXT,
      approvedDate: DataTypes.DATE,
      authorizer: DataTypes.STRING,
      authorizerEmail: DataTypes.STRING,
      branch_id: DataTypes.BIGINT,
      description: DataTypes.STRING,
      requestDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      requestKey: DataTypes.STRING,
      requestType: DataTypes.INTEGER,
      requestor: DataTypes.STRING,
      requestorEmail: DataTypes.STRING,
      status: DataTypes.INTEGER,
      portalAction: { type: DataTypes.INTEGER, defaultValue: 1 },
      institution_id: DataTypes.BIGINT
    },
    { tableName: 'pendingrequests' }
  );

  PendingRequests.associate = models => {
    PendingRequests.belongsTo(models.Branches, {
      as: 'branch',
      foreignKey: 'branch_id'
    });
  };

  PendingRequests.fetchPendingRequests = async (input, { user }) => {
    try {
      const { branch_id, institution_id } = user;
      const {
        pageNumber = 1,
        pageSize = 1000,
        startDate,
        endDate,
        requestType
      } = input;
      const offset = (pageNumber - 1) * pageSize;

      return await PendingRequests.findAndCountAll({
        where: {
          institution_id,
          ...(branch_id && { branch_id }),
          ...(requestType && { requestType }),
          ...(startDate &&
            endDate && {
              requestDate: {
                [Op.gte]: UTILS.formatDate(startDate),
                [Op.lte]: UTILS.formatDate(endDate)
              }
            }),
          status: 0
        },
        offset,
        limit: pageSize
      });
    } catch (err) {
      handleError(err);
    }
  };

  PendingRequests.fetchPendingRequestsById = async id => {
    try {
      return await PendingRequests.findOne({
        where: { id }
      });
    } catch (err) {
      handleError(err);
    }
  };

  PendingRequests.fetchRequestTypes = async () => {
    try {
      return UTILS.requests
        .map((req, index) => ({
          key: index,
          value: req.key
        }))
        .sort((a, b) => a.value.localeCompare(b.value));
    } catch (err) {
      handleError(err);
    }
  };

  PendingRequests.approvePendingRequest = async ({ requestId }, token) => {
    try {
      const { user, userIp } = token;
      const { id, username, emailAddress, institution, institution_id } = user;

      const { dataValues } = await PendingRequests.fetchPendingRequestsById(
        requestId
      );

      const { requestType, additionalInfo, actionOn, description } = dataValues;
      const { model, action } = UTILS.requests[requestType];
      const input = JSON.parse(additionalInfo);

      return await sequelize
        .transaction(t => {
          return sequelize.models[model][action](input).then(() => {
            return PendingRequests.update(
              {
                status: 1,
                approvedDate: DataTypes.literal('CURRENT_TIMESTAMP'),
                authorizer: username,
                authorizerEmail: emailAddress
              },
              { where: { id: requestId, status: 0 } }
            ).then(() => {
              const actionDetail = `APPROVED: ${description}; APPROVED BY: ${username} FROM: ${
                institution.name
              }`;
              const auditObj = {
                userIp,
                portalUser_id: id,
                actionOn,
                actionBy: username,
                status: 1,
                institution_id: input.institution_id || institution_id,
                details: actionDetail,
                auditType: requestType
              };

              return AuditTrail.createAuditTrail(auditObj);
            });
          });
        })
        .then(() => {
          return {
            success: true,
            description: 'Request Approved Successfully!'
          };
        })
        .catch(err => {
          throw new Error(err);
        });
    } catch (err) {
      handleError(err);
    }
  };

  PendingRequests.declinePendingRequest = async ({ requestId }, token) => {
    try {
      const { user, userIp } = token;
      const { id, username, emailAddress, institution, institution_id } = user;

      const { dataValues } = await PendingRequests.fetchPendingRequestsById(
        requestId
      );

      const { requestType, additionalInfo, actionOn, description } = dataValues;
      const input = JSON.parse(additionalInfo);

      return await sequelize
        .transaction(t => {
          return PendingRequests.update(
            {
              status: 2,
              approvedDate: DataTypes.literal('CURRENT_TIMESTAMP'),
              authorizer: username,
              authorizerEmail: emailAddress
            },
            { where: { id: requestId } }
          ).then(() => {
            const actionDetail = `DECLINED: ${description}; DECLINED BY: ${username} FROM: ${
              institution.name
            }`;
            const auditObj = {
              userIp,
              portalUser_id: id,
              actionOn,
              actionBy: username,
              status: 2,
              institution_id: input.institution_id || institution_id,
              details: actionDetail,
              auditType: requestType
            };

            return AuditTrail.createAuditTrail(auditObj);
          });
        })
        .then(() => {
          return {
            success: true,
            description: 'Request Declined Successfully!'
          };
        })
        .catch(err => {
          throw new Error(err);
        });
    } catch (err) {
      handleError(err);
    }
  };

  PendingRequests.createRequest = async (
    token,
    requestType,
    body,
    actionOn,
    actionDetail,
    institutionOn
  ) => {
    try {
      const additionalInfo = JSON.stringify(body);
      const { id, username, emailAddress, branch_id, role } = token.user;
      const { institution_id } = role;
      const requestKey = `${UTILS.requests[requestType].key}_${actionOn}`;

      const result = await PendingRequests.findOrCreate({
        where: {
          requestKey,
          requestType,
          status: 0,
          institution_id,
          ...(branch_id && { branch_id })
        },
        defaults: {
          actionOn,
          description: actionDetail,
          additionalInfo,
          requestor: username,
          requestorEmail: emailAddress
        }
      }).then(([res, created]) => created);

      if (result) {
        const auditObj = {
          userIp: token.userIp,
          portalUser_id: id,
          actionOn,
          actionBy: username,
          status: 0,
          institution_id: institutionOn,
          details: actionDetail,
          auditType: requestType
        };

        await AuditTrail.createAuditTrail(auditObj);

        return {
          success: true,
          description: 'Request Submitted Successfully!'
        };
      } else {
        throw new Error('Request already submitted!');
      }
    } catch (err) {
      handleError(err);
    }
  };

  return PendingRequests;
};

export default pendingRequests;

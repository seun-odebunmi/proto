import { UTILS } from '../constants';
import { handleError } from '../helpers';

const roles = (sequelize, DataTypes) => {
  const Op = DataTypes.Op;
  const { Institutions, Countries, PendingRequests } = sequelize.models;

  const Roles = sequelize.define(
    'Roles',
    {
      dateCreated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      dateUpdated: DataTypes.DATE,
      description: DataTypes.STRING,
      name: DataTypes.STRING,
      institution_id: DataTypes.BIGINT
    },
    { tableName: 'roles' }
  );

  Roles.associate = models => {
    Roles.belongsTo(models.Institutions, {
      as: 'institution',
      foreignKey: 'institution_id'
    });
  };

  Roles.fetchRoles = async input => {
    try {
      const { pageNumber = 1, pageSize = 1000, institution_id } = input;
      const offset = (pageNumber - 1) * pageSize;

      return await Roles.findAndCountAll({
        where: { ...(institution_id && { institution_id }) },
        offset,
        limit: pageSize,
        include: [
          {
            model: Institutions,
            as: 'institution',
            include: [{ model: Countries, as: 'country' }]
          }
        ]
      });
    } catch (err) {
      handleError(err);
    }
  };

  Roles.fetchRoleById = async id => {
    try {
      return await Roles.findOne({
        where: { id },
        include: [
          {
            model: Institutions,
            as: 'institution'
          }
        ]
      });
    } catch (err) {
      handleError(err);
    }
  };

  Roles.checkRoleExists = async ({ name, institution_id, id }) => {
    try {
      return await Roles.findOne({
        where: {
          name,
          institution_id,
          ...(id && { id: { [Op.ne]: id } })
        }
      });
    } catch (err) {
      handleError(err);
    }
  };

  Roles.createRoleInit = async (input, token) => {
    try {
      const { name, institution_id } = input;
      const inst = await Institutions.fetchInstitutionById(institution_id).then(
        res => res.dataValues
      );
      const roleExists = await Roles.checkRoleExists(input);
      const actionDetail = `Create role request - [${JSON.stringify(
        input
      )}] for: ${inst.name}, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      if (roleExists) {
        return {
          success: false,
          description: 'Role already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        25,
        input,
        `${name}_${institution_id}`,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Roles.createRole = async input => {
    try {
      const roleExists = await Roles.checkRoleExists(input);

      if (roleExists) {
        throw new Error('Role already exists!');
      }

      return await Roles.create({ ...input });
    } catch (err) {
      handleError(err);
    }
  };

  Roles.updateRoleInit = async (input, token) => {
    try {
      const { name, institution_id, id } = input;
      let role = await Roles.fetchRoleById(id).then(res => res.dataValues);
      const prevRoleVal = UTILS.filterObjKeys(input, role);
      const roleExists = await Roles.checkRoleExists(input);
      const actionDetail = `Update role request - from: [${JSON.stringify(
        prevRoleVal
      )}] to: [${JSON.stringify(input)}] for: ${
        role.institution.name
      }, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      if (roleExists) {
        return {
          success: false,
          description: 'Role already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        26,
        input,
        `${name}_${institution_id}`,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Roles.updateRole = async input => {
    try {
      const { id } = input;
      const roleExists = await Roles.checkRoleExists(input);

      if (roleExists) {
        throw new Error('Role already exists!');
      }

      return await Roles.update({ ...input }, { where: { id } });
    } catch (err) {
      handleError(err);
    }
  };

  return Roles;
};

export default roles;

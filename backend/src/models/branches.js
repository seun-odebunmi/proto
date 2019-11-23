import { UTILS } from '../constants';
import { handleError } from '../helpers';

const branches = (sequelize, DataTypes) => {
  const Op = DataTypes.Op;
  const { PendingRequests, Countries, Institutions } = sequelize.models;

  const Branches = sequelize.define(
    'Branches',
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      activeStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
      institution_id: DataTypes.BIGINT
    },
    { tableName: 'branches' }
  );

  Branches.associate = models => {
    Branches.belongsTo(models.Institutions, {
      as: 'institution',
      foreignKey: 'institution_id'
    });
  };

  Branches.fetchBranches = async input => {
    try {
      const {
        pageNumber = 1,
        pageSize = 1000,
        activeStatus,
        institution_id
      } = input;
      const offset = (pageNumber - 1) * pageSize;

      return await Branches.findAndCountAll({
        where: {
          ...(activeStatus && { activeStatus }),
          ...(institution_id && { institution_id })
        },
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

  Branches.fetchBranchById = async id => {
    try {
      return await Branches.findOne({
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

  Branches.checkBranchExists = async ({ name, code, institution_id, id }) => {
    try {
      return await Branches.findOne({
        where: {
          institution_id,
          [Op.or]: [{ name }, { code }],
          ...(id && { id: { [Op.ne]: id } })
        }
      });
    } catch (err) {
      handleError(err);
    }
  };

  Branches.createBranchInit = async (input, token) => {
    try {
      const { name, institution_id } = input;
      const inst = await Institutions.fetchInstitutionById(institution_id).then(
        res => res.dataValues
      );
      const branchExists = await Branches.checkBranchExists(input);
      const actionDetail = `Create branch request - [${JSON.stringify(
        input
      )}] for: ${inst.name}, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      if (branchExists) {
        return {
          success: false,
          description: 'Branch already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        37,
        input,
        `${name}_${institution_id}`,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Branches.createBranch = async input => {
    try {
      const branchExists = await Branches.checkBranchExists(input);

      if (branchExists) {
        throw new Error('Branch already exists!');
      }

      return await Branches.create({ ...input });
    } catch (err) {
      handleError(err);
    }
  };

  Branches.updateBranchInit = async (input, token) => {
    try {
      const { name, institution_id, id } = input;
      let branch = await Branches.fetchBranchById(id).then(
        res => res.dataValues
      );
      const prevBranchVal = UTILS.filterObjKeys(input, branch);
      const branchExists = await Branches.checkBranchExists(input);
      const actionDetail = `Update branch request - from: [${JSON.stringify(
        prevBranchVal
      )}] to: [${JSON.stringify(input)}] for: ${
        branch.institution.name
      }, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      if (branchExists) {
        return {
          success: false,
          description: 'Branch already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        38,
        input,
        `${name}_${institution_id}`,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Branches.updateBranch = async input => {
    try {
      const { id } = input;
      const branchExists = await Branches.checkBranchExists(input);

      if (branchExists) {
        throw new Error('Branch already exists!');
      }

      return await Branches.update({ ...input }, { where: { id } });
    } catch (err) {
      handleError(err);
    }
  };

  Branches.activateBranchInit = async (input, token) => {
    try {
      const { name, institution_id } = await Branches.fetchBranchById(
        input.id
      ).then(res => res.dataValues);
      const inst = await Institutions.fetchInstitutionById(institution_id).then(
        res => res.dataValues
      );
      const body = { ...input, institution_id };
      const actionDetail = `Activate branch request - [${name}] for: ${
        inst.name
      }, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      return await PendingRequests.createRequest(
        token,
        45,
        body,
        name,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Branches.activateBranch = async ({ id }) => {
    try {
      return await Branches.update({ activeStatus: 1 }, { where: { id } });
    } catch (err) {
      handleError(err);
    }
  };

  Branches.deactivateBranchInit = async (input, token) => {
    try {
      const { name, institution_id } = await Branches.fetchBranchById(
        input.id
      ).then(res => res.dataValues);
      const inst = await Institutions.fetchInstitutionById(institution_id).then(
        res => res.dataValues
      );
      const body = { ...input, institution_id };
      const actionDetail = `Deactivate branch request - [${name}] for: ${
        inst.name
      }, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      return await PendingRequests.createRequest(
        token,
        46,
        body,
        name,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Branches.deactivateBranch = async ({ id }) => {
    try {
      return await Branches.update({ activeStatus: 0 }, { where: { id } });
    } catch (err) {
      handleError(err);
    }
  };

  return Branches;
};

export default branches;

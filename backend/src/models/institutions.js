import fs from 'fs';
import { fileProcess, tempLogoDir, logoDir, handleError } from '../helpers';
import { UTILS } from '../constants';

const institutions = (sequelize, DataTypes) => {
  const Op = DataTypes.Op;
  const { PendingRequests, Countries } = sequelize.models;

  const Institutions = sequelize.define(
    'Institutions',
    {
      name: { type: DataTypes.STRING, unique: true },
      code: { type: DataTypes.STRING, unique: true },
      accentColor: DataTypes.STRING,
      logo: DataTypes.STRING,
      isISW: { type: DataTypes.BOOLEAN, defaultValue: false },
      country_id: DataTypes.BIGINT
    },
    { tableName: 'institution' }
  );

  Institutions.associate = models => {
    Institutions.belongsTo(models.Countries, {
      as: 'country',
      foreignKey: 'country_id'
    });
  };

  Institutions.fetchInstitutions = async input => {
    try {
      const { pageNumber = 1, pageSize = 1000, country_id } = input;
      const offset = (pageNumber - 1) * pageSize;

      return await Institutions.findAndCountAll({
        where: { ...(country_id && { country_id }) },
        offset,
        limit: pageSize,
        include: [{ model: Countries, as: 'country' }]
      });
    } catch (err) {
      handleError(err);
    }
  };

  Institutions.fetchInstitutionById = async id => {
    try {
      return await Institutions.findOne({ where: { id: id } });
    } catch (err) {
      handleError(err);
    }
  };

  Institutions.checkInstExists = async ({ name, code, country_id, id }) => {
    try {
      return await Institutions.findOne({
        where: {
          [Op.or]: [{ name }, { code }],
          country_id,
          ...(id && { id: { [Op.ne]: id } })
        }
      });
    } catch (err) {
      handleError(err);
    }
  };

  Institutions.createInstitutionInit = async (input, token) => {
    try {
      const { name, code, logo, country_id } = input;
      const instExists = await Institutions.checkInstExists(input);

      if (instExists) {
        return {
          success: false,
          description: 'Institution already exists!'
        };
      }

      const { data, type } = fileProcess(logo);
      const dir = tempLogoDir();

      const filePath = `${dir}/${name}${country_id}.${type}`;
      fs.writeFileSync(filePath, data, 'base64');
      const body = { ...input, logo: filePath };
      const actionDetail = `Create institution request - [${JSON.stringify(
        body
      )}], initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      return await PendingRequests.createRequest(
        token,
        53,
        body,
        `${code}_${country_id}`,
        actionDetail,
        token.user.institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Institutions.createInstitution = async input => {
    try {
      const { name, logo, country_id } = input;
      const instExists = await Institutions.checkInstExists(input);

      if (instExists) {
        throw new Error('Institution already exists!');
      }

      const file = `data:image/png;base64,${fs.readFileSync(logo, 'base64')}`;
      const { data, type } = fileProcess(file);
      const filePath = `${logoDir}/${name}${country_id}.${type}`;
      const body = { ...input, logo: filePath };

      fs.unlinkSync(logo);
      fs.writeFileSync(filePath, data, 'base64');

      return await Institutions.create({ ...body });
    } catch (err) {
      handleError(err);
    }
  };

  Institutions.updateInstitutionInit = async (input, token) => {
    try {
      const { name, id, code, logo, country_id } = input;
      let institution = await Institutions.fetchInstitutionById(id).then(
        res => res.dataValues
      );
      const prevInstitutionVal = UTILS.filterObjKeys(input, institution);
      const instExists = await Institutions.checkInstExists(input);

      if (instExists) {
        return {
          success: false,
          description: 'Institution already exists!'
        };
      }

      const { data, type } = fileProcess(logo);
      const dir = tempLogoDir();

      const filePath = `${dir}/${name}${country_id}.${type}`;
      fs.writeFileSync(filePath, data, 'base64');
      const body = { ...input, logo: filePath };
      const actionDetail = `Update institution request - from: [${JSON.stringify(
        prevInstitutionVal
      )}] to: [${JSON.stringify(body)}], initiated by: ${
        token.user.username
      } from: ${token.user.institution.name}`;

      return await PendingRequests.createRequest(
        token,
        54,
        body,
        `${code}_${country_id}`,
        actionDetail,
        token.user.institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Institutions.updateInstitution = async input => {
    try {
      const { id, name, logo, country_id } = input;
      const instExists = await Institutions.checkInstExists(input);

      if (instExists) {
        throw new Error('Institution already exists!');
      }

      const file = `data:image/png;base64,${fs.readFileSync(logo, 'base64')}`;
      const { data, type } = fileProcess(file);
      const filePath = `${logoDir}/${name}${country_id}.${type}`;
      const body = { ...input, logo: filePath };

      fs.unlinkSync(logo);
      fs.writeFileSync(filePath, data, 'base64');

      return await Institutions.update(
        {
          ...body
        },
        { where: { id } }
      );
    } catch (err) {
      handleError(err);
    }
  };

  return Institutions;
};

export default institutions;

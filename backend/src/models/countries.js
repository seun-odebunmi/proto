import { handleError } from '../helpers';
import { UTILS } from '../constants';

const countries = (sequelize, DataTypes) => {
  const Op = DataTypes.Op;
  const { PendingRequests } = sequelize.models;

  const Countries = sequelize.define(
    'Countries',
    {
      name: { type: DataTypes.STRING, unique: true },
      code: { type: DataTypes.STRING, unique: true },
      active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    { tableName: 'countrypartner' }
  );

  Countries.fetchCountries = async input => {
    try {
      const { pageNumber = 1, pageSize = 1000, name, active } = input;
      const offset = (pageNumber - 1) * pageSize;

      return await Countries.findAndCountAll({
        where: { ...(name && { name }), ...(active && { active }) },
        offset,
        limit: pageSize
      });
    } catch (err) {
      handleError(err);
    }
  };

  Countries.fetchCountryById = async id => {
    try {
      return await Countries.findOne({ where: { id: id } });
    } catch (err) {
      handleError(err);
    }
  };

  Countries.checkCountryExists = async ({ name, code, id }) => {
    try {
      return await Countries.findOne({
        where: {
          [Op.or]: [{ name }, { code }],
          ...(id && { id: { [Op.ne]: id } })
        }
      });
    } catch (err) {
      handleError(err);
    }
  };

  Countries.createCountryInit = async (input, token) => {
    try {
      const { name } = input;
      const countryExists = await Countries.checkCountryExists(input);
      const actionDetail = `Create country request - [${JSON.stringify(
        input
      )}], initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      if (countryExists) {
        return {
          success: false,
          description: 'Country already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        55,
        input,
        name,
        actionDetail,
        token.user.institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Countries.createCountry = async input => {
    try {
      const countryExists = await Countries.checkCountryExists(input);

      if (countryExists) {
        throw new Error('Country already exists!');
      }

      return await Countries.create({ ...input });
    } catch (err) {
      handleError(err);
    }
  };

  Countries.updateCountryInit = async (input, token) => {
    try {
      const { name, id } = input;
      let country = await Countries.fetchCountryById(id).then(
        res => res.dataValues
      );
      const prevCountryVal = UTILS.filterObjKeys(input, country);
      const countryExists = await Countries.checkCountryExists(input);
      const actionDetail = `Update country request - from: [${JSON.stringify(
        prevCountryVal
      )}] to: [${JSON.stringify(input)}], initiated by: ${
        token.user.username
      } from: ${token.user.institution.name}`;

      if (countryExists) {
        return {
          success: false,
          description: 'Country already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        56,
        input,
        name,
        actionDetail,
        token.user.institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Countries.updateCountry = async input => {
    try {
      const { id } = input;
      const countryExists = await Countries.checkCountryExists(input);

      if (countryExists) {
        throw new Error('Country already exists!');
      }

      return await Countries.update(
        {
          ...input
        },
        { where: { id } }
      );
    } catch (err) {
      handleError(err);
    }
  };

  return Countries;
};

export default countries;

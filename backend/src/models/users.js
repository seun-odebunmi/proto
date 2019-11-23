import {
  generateSalt,
  hashPassword,
  generatePassword,
  sign,
  handleError,
  sendEmail
} from '../helpers';
import { UTILS } from '../constants';

const users = (sequelize, DataTypes) => {
  const Op = DataTypes.Op;
  const {
    Session,
    Roles,
    Institutions,
    Branches,
    RoleFunctions,
    Countries,
    PendingRequests,
    AuditTrail
  } = sequelize.models;

  const Users = sequelize.define(
    'Users',
    {
      emailAddress: { type: DataTypes.STRING, unique: true },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      mobileNumber: DataTypes.STRING,
      username: { type: DataTypes.STRING, unique: true },
      status: { type: DataTypes.BOOLEAN, defaultValue: true },
      deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      firstLogin: { type: DataTypes.BOOLEAN, defaultValue: true },
      branch_id: DataTypes.BIGINT,
      role_id: DataTypes.BIGINT,
      institution_id: DataTypes.BIGINT,
      createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      createBy_id: DataTypes.BIGINT,
      checker: { type: DataTypes.BOOLEAN, defaultValue: false },
      secret: DataTypes.STRING,
      salt: DataTypes.STRING
    },
    { tableName: 'portalusers' }
  );

  Users.associate = models => {
    Users.belongsTo(models.Roles, { as: 'role', foreignKey: 'role_id' });
    Users.belongsTo(models.Branches, {
      as: 'branch',
      foreignKey: 'branch_id'
    });
    Users.belongsTo(models.Institutions, {
      as: 'institution',
      foreignKey: 'institution_id'
    });
  };

  Users.login = async ({ email, password }, { userIp }) => {
    try {
      let userData = await Users.fetchUserByEmail(email).then(
        res => res.dataValues
      );

      if (userData) {
        const { salt, secret, status, ...rest } = userData;
        const hashedPassword = hashPassword(password, salt);
        const verticalMenuItems = await RoleFunctions.fetchRoleFunctions(rest);

        if (hashedPassword === secret) {
          if (!status) {
            throw new Error('Your account has not been enabled!');
          }

          const ssk = generateSalt();
          const payload = {
            user: { ...rest },
            ssk
          };

          await Session.delete(payload.user.id);
          const createSession = await Session.store(payload);

          if (createSession) {
            const token = sign(payload);

            const actionDetail = `Login request - ${rest.username} from: ${
              rest.institution.name
            }`;
            const auditObj = {
              userIp,
              portalUser_id: rest.id,
              actionOn: rest.username,
              actionBy: rest.username,
              status: 1,
              institution_id: rest.institution_id,
              details: actionDetail,
              auditType: 42
            };

            await AuditTrail.createAuditTrail(auditObj);

            return { token, user: payload.user, verticalMenuItems };
          }
        }

        throw new Error('Invalid Login credentials!');
      }

      throw new Error('Invalid Login credentials!');
    } catch (err) {
      handleError(err);
    }
  };

  Users.changePassword = async (
    input,
    { user: { id, username, institution }, userIp }
  ) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = input;
      const user = await Users.fetchUserById(id).then(res => res.dataValues);
      const { salt, secret } = user;
      const oldSecret = hashPassword(oldPassword, salt);
      const newSecret = hashPassword(newPassword, salt);

      if (oldSecret === secret) {
        if (newPassword !== confirmPassword) {
          throw new Error('Please confirm your password properly!');
        }

        const result = await Users.update(
          { secret: newSecret, firstLogin: false },
          { where: { id } }
        );

        if (result) {
          const actionDetail = `Change password request - ${username} from: ${
            institution.name
          }`;
          const auditObj = {
            userIp,
            portalUser_id: id,
            actionOn: username,
            actionBy: username,
            status: 1,
            institution_id: institution.id,
            details: actionDetail,
            auditType: 40
          };

          await AuditTrail.createAuditTrail(auditObj);

          return {
            success: true,
            description: 'Password Changed Successfully!'
          };
        }

        throw new Error('Password could not be changed!');
      }

      throw new Error('You did not enter the correct old password!');
    } catch (err) {
      handleError(err);
    }
  };

  Users.resetPassword = async ({ email }, { userIp }) => {
    try {
      const result = await Users.fetchUserByEmail(email).then(
        res => res.dataValues
      );

      if (result) {
        const { id, salt, emailAddress, username, institution } = result;
        const password = generatePassword();
        const newSecret = hashPassword(password, salt);

        await Users.update(
          { secret: newSecret, firstLogin: true },
          { where: { id } }
        );

        const actionDetail = `Reset password request - ${username} from: ${
          institution.name
        }`;
        const auditObj = {
          userIp,
          portalUser_id: id,
          actionOn: username,
          actionBy: username,
          status: 1,
          institution_id: institution.id,
          details: actionDetail,
          auditType: 33
        };

        await AuditTrail.createAuditTrail(auditObj);

        const config = {
          to: emailAddress,
          subject: 'Support Portal Password Reset',
          text: `A password reset request was initiated. Your new password is ${password}`
        };

        console.log(await sendEmail(config));

        return {
          success: true,
          description:
            'Password Reset Successful! A new password has been sent to your registered email'
        };
      }

      throw new Error('User does not exist!');
    } catch (err) {
      handleError(err);
    }
  };

  Users.fetchUsers = async input => {
    try {
      const {
        pageNumber = 1,
        pageSize = 1000,
        username,
        institution_id
      } = input;
      const offset = (pageNumber - 1) * pageSize;

      return await Users.findAndCountAll({
        where: {
          ...(username && { username }),
          ...(institution_id && { institution_id })
        },
        offset,
        limit: pageSize,
        include: [
          { model: Roles, as: 'role' },
          { model: Branches, as: 'branch' },
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

  Users.fetchUserById = async id => {
    try {
      return await Users.findOne({
        where: { id },
        include: [
          { model: Roles, as: 'role' },
          { model: Branches, as: 'branch' },
          { model: Institutions, as: 'institution' }
        ]
      });
    } catch (err) {
      handleError(err);
    }
  };

  Users.fetchUserByEmail = async emailAddress => {
    try {
      return await Users.findOne({
        where: { emailAddress },
        include: [
          { model: Roles, as: 'role' },
          { model: Branches, as: 'branch' },
          { model: Institutions, as: 'institution' }
        ]
      });
    } catch (err) {
      handleError(err);
    }
  };

  Users.checkUserExists = async ({ username, emailAddress, id }) => {
    try {
      return await Users.findOne({
        where: {
          [Op.or]: [{ username }, { emailAddress }],
          ...(id && { id: { [Op.ne]: id } })
        }
      });
    } catch (err) {
      handleError(err);
    }
  };

  Users.createUserInit = async (input, token) => {
    try {
      const { username, institution_id } = input;
      const body = { ...input, createBy_id: token.user.id };
      const inst = await Institutions.fetchInstitutionById(institution_id).then(
        res => res.dataValues
      );
      const userExists = await Users.checkUserExists(input);
      const actionDetail = `Create user request - [${JSON.stringify(
        body
      )}] for: ${inst.name}, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      if (userExists) {
        return {
          success: false,
          description: 'User already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        5,
        body,
        username,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Users.createUser = async input => {
    try {
      const password = generatePassword();
      const salt = generateSalt();
      const secret = hashPassword(password, salt);
      const userExists = await Users.checkUserExists(input);

      if (userExists) {
        throw new Error('User already exists!');
      }

      const result = await Users.create({ ...input, salt, secret });

      if (result) {
        const config = {
          to: input.emailAddress,
          subject: 'Support Portal Account Creation',
          text: `An account has been created for you. Your password is ${password}`
        };

        console.log(await sendEmail(config));
        return result;
      }
    } catch (err) {
      handleError(err);
    }
  };

  Users.updateUserInit = async (input, token) => {
    try {
      const { username, id, institution_id } = input;
      let user = await Users.fetchUserById(id).then(res => res.dataValues);
      const prevUserVal = UTILS.filterObjKeys(input, user);
      const userExists = await Users.checkUserExists(input);
      const actionDetail = `Update user request - from: [${JSON.stringify(
        prevUserVal
      )}] to: [${JSON.stringify(input)}] for: ${
        user.institution.name
      }, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      if (userExists) {
        return {
          success: false,
          description: 'User already exists!'
        };
      }

      return await PendingRequests.createRequest(
        token,
        6,
        input,
        username,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Users.updateUser = async input => {
    try {
      const { id } = input;
      const userExists = await Users.checkUserExists(input);

      if (userExists) {
        throw new Error('User already exists!');
      }

      return await Users.update({ ...input }, { where: { id } });
    } catch (err) {
      handleError(err);
    }
  };

  Users.activateUserInit = async (input, token) => {
    try {
      const { username, institution_id } = await Users.fetchUserById(
        input.id
      ).then(res => res.dataValues);
      const inst = await Institutions.fetchInstitutionById(institution_id).then(
        res => res.dataValues
      );
      const body = { ...input, institution_id };
      const actionDetail = `Activate user request - [${username}] for: ${
        inst.name
      }, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      return await PendingRequests.createRequest(
        token,
        7,
        body,
        username,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Users.activateUser = async ({ id }) => {
    try {
      return await Users.update({ status: 1 }, { where: { id } });
    } catch (err) {
      handleError(err);
    }
  };

  Users.deactivateUserInit = async (input, token) => {
    try {
      const { username, institution_id } = await Users.fetchUserById(
        input.id
      ).then(res => res.dataValues);
      const inst = await Institutions.fetchInstitutionById(institution_id).then(
        res => res.dataValues
      );
      const body = { ...input, institution_id };
      const actionDetail = `Deactivate user request - [${username}] for: ${
        inst.name
      }, initiated by: ${token.user.username} from: ${
        token.user.institution.name
      }`;

      return await PendingRequests.createRequest(
        token,
        8,
        body,
        username,
        actionDetail,
        institution_id
      );
    } catch (err) {
      handleError(err);
    }
  };

  Users.deactivateUser = async ({ id }) => {
    try {
      return await Users.update({ status: 0 }, { where: { id } });
    } catch (err) {
      handleError(err);
    }
  };

  return Users;
};

export default users;

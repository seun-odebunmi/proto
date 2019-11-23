import { AuthenticationError } from 'apollo-server-express';
import { decode, verify } from '../helpers';

const session = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      sessionKey: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { notEmpty: true }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      lastActivityDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    { tableName: 'portalsessions' }
  );

  Session.associate = models => {
    Session.belongsTo(models.Users, { foreignKey: 'user_id' });
  };

  Session.store = async ({ user: { id }, ssk }) => {
    try {
      return await Session.create({
        sessionKey: ssk,
        user_id: id,
        startDate: DataTypes.literal('CURRENT_TIMESTAMP')
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  Session.delete = async user_id => {
    try {
      let sessionRes = await Session.destroy({ where: { user_id } });

      return sessionRes;
    } catch (err) {
      throw new Error(err);
    }
  };

  Session.verifyToken = async req => {
    const token = req.headers.sessionid || null;

    if (token) {
      try {
        if (verify(token)) {
          const { payload } = decode(token);
          const verifySession = await Session.verify(payload.ssk);

          if (verifySession) {
            await Session.updateLastActivity(payload.ssk);

            return { ...payload };
          }

          throw new Error('Cannot verify session');
        }

        throw new Error('Cannot verify token');
      } catch (err) {
        console.log(err);
        throw new AuthenticationError('Session has expired! Sign in again');
      }
    }
  };

  Session.verify = async ssk => {
    try {
      let sessionRes = await Session.findOne({
        where: { sessionKey: ssk }
      });
      return sessionRes;
    } catch (err) {
      throw new Error(err);
    }
  };

  Session.updateLastActivity = async ssk => {
    try {
      let sessionRes = await Session.update(
        { lastActivityDate: DataTypes.literal('CURRENT_TIMESTAMP') },
        { where: { sessionKey: ssk } }
      );
      return sessionRes;
    } catch (err) {
      throw new Error(err);
    }
  };

  return Session;
};

export default session;

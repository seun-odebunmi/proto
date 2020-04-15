import { generateSalt, hashPassword, sign, verify, decode } from '../helpers';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false },
      secret: DataTypes.STRING,
      salt: DataTypes.STRING,
      age: { type: DataTypes.INTEGER, allowNull: false },
      gender: { type: DataTypes.INTEGER, allowNull: false },
      userType_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      medicalRecord_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: 'user', timestamps: false }
  );

  User.fetchUserByUsername = async (username) => {
    try {
      return await User.findOne({
        where: { username },
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  User.checkUserExists = async ({ username }) => {
    try {
      return await User.findOne({
        where: { username },
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  User.login = async ({ username, password }) => {
    try {
      let userData = await User.fetchUserByUsername(username).then((d) => d.dataValues);

      if (userData != null) {
        const { salt, secret, ...rest } = userData;
        const hashedPassword = hashPassword(password, salt);

        if (hashedPassword === secret) {
          const ssk = generateSalt();
          const payload = {
            user: { ...rest },
            ssk,
          };
          const token = sign(payload);

          return { token, user: payload.user };
        }

        throw new Error('Invalid Login credentials!');
      }

      throw new Error('Invalid Login credentials!');
    } catch (err) {
      throw new Error(err);
    }
  };

  User.createUser = async (input) => {
    try {
      const salt = generateSalt();
      const secret = hashPassword(input.password, salt);
      const userExists = await User.checkUserExists(input);

      if (userExists) {
        throw new Error('User already exists!');
      }

      return await User.create({ ...input, salt, secret });
    } catch (err) {
      throw new Error(err);
    }
  };

  User.getAll = async () => await User.findAll({}).map((el) => el.get({ plain: true }));

  return User;
};

export default user;

const roleFunctions = (sequelize, DataTypes) => {
  const { Menus } = sequelize.models;

  const RoleFunctions = sequelize.define(
    'RoleFunctions',
    {
      menu_id: DataTypes.BIGINT,
      role_id: DataTypes.BIGINT
    },
    { tableName: 'rolefunctions' }
  );

  RoleFunctions.associate = models => {
    RoleFunctions.belongsTo(models.Roles, {
      as: 'role',
      foreignKey: 'role_id'
    });
    RoleFunctions.belongsTo(models.Menus, {
      as: 'menu',
      foreignKey: 'menu_id'
    });
  };

  RoleFunctions.fetchRoleFunctions = async ({ role_id }) => {
    try {
      return await RoleFunctions.findAll({
        where: { role_id },
        include: [{ model: Menus, as: 'menu' }]
      });
    } catch (err) {
      console.log(err);
      throw new Error('Role Functions not found!');
    }
  };

  RoleFunctions.createRoleFunction = async ({ role_id, menu_ids }) => {
    try {
      if (menu_ids.length === 0) {
        throw new Error('Menu list cannot be empty!');
      }

      const body = menu_ids.map(menu_id => ({ role_id, menu_id }));
      const result = await RoleFunctions.destroy({ where: { role_id } }).then(
        () => RoleFunctions.bulkCreate(body)
      );

      if (result) {
        return {
          success: true,
          description: 'Submitted Successfully!'
        };
      }
    } catch (err) {
      console.log(err);
      throw new Error('Could not create Role Functions!');
    }
  };

  return RoleFunctions;
};

export default roleFunctions;

const menus = (sequelize, DataTypes) => {
  const Menus = sequelize.define(
    'Menus',
    {
      hasSubMenu: DataTypes.BOOLEAN,
      href: DataTypes.STRING,
      icon: DataTypes.STRING,
      routerLink: DataTypes.STRING,
      target: DataTypes.STRING,
      title: DataTypes.STRING,
      parent_id: DataTypes.BIGINT,
      isISW: DataTypes.BOOLEAN
    },
    { tableName: 'menus' }
  );

  Menus.fetchMenus = async isISW => {
    try {
      return await Menus.findAll({ where: { ...(!isISW && { isISW }) } });
    } catch (err) {
      console.log(err);
      throw new Error('Menus not found!');
    }
  };

  return Menus;
};

export default menus;

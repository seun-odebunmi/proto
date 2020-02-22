export const subRoutines = (models, bot) => {
  bot.setSubroutine('loadVAValues', (rs, args) => {
    var vaType = args[0];

    return new Promise((resolve, reject) => {
      models.VisualAcuity.getVAValues().then(result => {
        const value = result.map(value => ({ ...value.dataValues, key: vaType }));

        rs.setUservar(rs.currentUser(), 'vaValues', value).then(data => {
          resolve('done');
        });
      });
    });
  });

  bot.setSubroutine('resetVAValues', (rs, args) => {
    return new Promise((resolve, reject) => {
      rs.setUservar(rs.currentUser(), 'vaValues', undefined).then(data => {
        resolve('');
      });
    });
  });
};

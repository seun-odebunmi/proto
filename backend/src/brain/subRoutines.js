import fs from 'fs';

export const subRoutines = (models, bot) => {
  bot.setSubroutine('loadVAValues', (rs, args) => {
    var key = args[0];

    return new Promise((resolve, reject) => {
      models.VisualAcuity.getVAValues().then(result => {
        const value = result.map(value => ({ ...value, key }));

        rs.setUservar(rs.currentUser(), 'taOptions', value).then(() => resolve('done'));
      });
    });
  });

  bot.setSubroutine('resetVAValues', (rs, args) => {
    return new Promise((resolve, reject) => {
      rs.setUservar(rs.currentUser(), 'taOptions', undefined).then(() => resolve(''));
    });
  });

  bot.setSubroutine('loadQAResponse', (rs, args) => {
    const key = `${args[0]} ${args[1] || ''}`;

    return new Promise((resolve, reject) => {
      const value = [
        { value: 'yes', key },
        { value: 'no', key: `do not ${key}` }
      ];

      rs.setUservar(rs.currentUser(), 'taOptions', value).then(() => resolve('done'));
    });
  });

  bot.setSubroutine('loadVAScale', (rs, args) => {
    return new Promise((resolve, reject) => {
      fs.readFile('./src/assets/visualAcuityScale.PNG', 'base64', (err, data) => {
        if (err) {
          throw err;
        }

        rs.setUservar(rs.currentUser(), 'file', data).then(() => resolve(''));
      });
    });
  });

  bot.setSubroutine('resetVAScale', (rs, args) => {
    return new Promise((resolve, reject) => {
      rs.setUservar(rs.currentUser(), 'file', undefined).then(() => resolve(''));
    });
  });
};

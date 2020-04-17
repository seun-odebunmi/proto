import fs from 'fs';
const tf = require('@tensorflow/tfjs-node');
const ml = require('../tensor');

export const subRoutines = (models, bot) => {
  bot.setSubroutine('loadVAValues', (rs, args) => {
    var key = args[0];

    return new Promise((resolve, reject) => {
      models.VisualAcuity.getVAValues().then((result) => {
        const value = result.map((value) => ({ ...value, key }));

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
        { value: 'no', key: `do not ${key}` },
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

  bot.setSubroutine('makePrediction', async (rs, args) => {
    const classes = await models.Diagnosis.getAll();
    const va = await models.VisualAcuity.getAll();
    const user = await rs.getUservar(rs.currentUser(), 'user');
    const inputVa = args.map((a) => {
      const value = va.find((v) => v.value === a);
      return value != undefined ? value.id : null;
    });
    const input = tf.tensor2d([user.age, user.gender, ...inputVa], [1, 8]);
    // const input = tf.tensor2d([20, 2, 6, 6, 1, 1, 3, 3], [1, 8]);

    return new Promise((resolve, reject) => {
      ml.run()
        .then(({ model }) => {
          const predictionWithArgMax = model.predict(input).argMax(-1).dataSync();
          const prediction = classes
            .find((c) => c.id === predictionWithArgMax[0])
            .value.split('-')
            .join(' ');
          resolve(prediction);
        })
        .catch((err) => reject(''));
    });
  });
};

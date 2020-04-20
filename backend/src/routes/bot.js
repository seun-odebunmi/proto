import auth from '../middleware/auth';
const { validationResult } = require('express-validator');

const botRoute = (router, models, bot) => {
  router.get('/botInit/', auth, (request, response, next) => {
    const {
      user,
      headers: { authorization },
    } = request;
    const uniqueId = authorization.slice(-20);
    const taOptions = [
      { value: 'yes', key: 'begin' },
      { value: 'no', key: 'do not begin' },
    ];
    bot.setUservar(`${user.username}${uniqueId}`, 'user', user);

    response.json({ msg: `Hello ${user.name}, would you like to begin your session ?`, taOptions });
  });

  router.post('/botReply/', auth, (request, response, next) => {
    const {
      user,
      body,
      headers: { authorization },
    } = request;
    const uniqueId = authorization.slice(-20);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    bot
      .reply(`${user.username}${uniqueId}`, body.msg, false)
      .then(async (reply) => {
        let file = await bot.getUservar(`${user.username}${uniqueId}`, 'file');
        let taOptions = await bot.getUservar(`${user.username}${uniqueId}`, 'taOptions');
        taOptions = taOptions == 'undefined' ? [] : taOptions;
        file = file == 'undefined' ? '' : file;
        // bot.getUservars(`${user.username}${uniqueId}`).then((data) => console.log('userVars', data));

        response.json({ msg: reply, taOptions, file });
      })
      .catch((err) => next(err));
  });
};

export default botRoute;

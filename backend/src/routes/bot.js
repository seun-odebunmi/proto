import auth from '../middleware/auth';
const { validationResult } = require('express-validator');

const botRoute = (router, models, bot) => {
  router.get('/botInit/', auth, (request, response, next) => {
    const { user } = request;
    bot.setUservar(user.username, 'user', user);

    response.json({ msg: `Hello ${user.name}, would you like to begin your session ?` });
  });

  router.post('/botReply/', auth, (request, response, next) => {
    const { user, body } = request;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    bot
      .reply(user.username, body.msg, false)
      .then(async (reply) => {
        let file = await bot.getUservar(user.username, 'file');
        let taOptions = await bot.getUservar(user.username, 'taOptions');
        taOptions = taOptions == 'undefined' ? [] : taOptions;
        file = file == 'undefined' ? '' : file;
        // bot.getUservars(user.username).then((data) => console.log('userVars', data));

        response.json({ msg: reply, taOptions, file });
      })
      .catch((err) => next(err));
  });
};

export default botRoute;

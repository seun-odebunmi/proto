const { check, validationResult } = require('express-validator');
import { ENDPOINT } from '../config/config';

const botRoute = (router, models, bot) => {
  router.get('/botInit/', (request, response, next) => {
    const { headers } = request;

    response.json({ data: { msg: `Hello ${headers.user}, how can I be of service today ?` } });
  });

  router.post('/botReply/', (request, response, next) => {
    const { headers, body } = request;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    bot
      .reply(headers.user, body.msg, false)
      .then(async reply => {
        const vaValues = await bot.getUservar(headers.user, 'vaValues');
        // bot.getUservars(headers.user).then(data => console.log('userVars', data));

        response.json({
          data: { msg: reply, taOptions: vaValues === 'undefined' ? [] : vaValues }
        });
      })
      .catch(err =>
        res.json({
          status: 'error',
          error: err
        })
      );
  });

  // router.get('/urls/', (request, response, next) => {
  //   models.Url.getUrls()
  //     .then(result => {
  //       if (result !== null) {
  //         response.json({
  //           data: result.map(res => ({
  //             longUrl: res.longUrl,
  //             shortUrl: `${ENDPOINT}/url/${res.code}`
  //           }))
  //         });
  //       } else {
  //         response.json({
  //           data: { urls: 'Not Found!' }
  //         });
  //       }
  //     })
  //     .catch(next);
  // });
  // router.get('/url/:code', (request, response, next) => {
  //   const { code } = request.params;
  //   models.Url.getLongUrl(code)
  //     .then(result => {
  //       if (result !== null) {
  //         response.redirect(result.longUrl);
  //       } else {
  //         response.redirect(ENDPOINT);
  //       }
  //     })
  //     .catch(next);
  // });
};

export default botRoute;

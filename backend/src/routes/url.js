const { check, validationResult } = require('express-validator');
import { createShortUrlAndInsert } from '../helpers';
import { ENDPOINT } from '../config/config';

const urlRoute = (router, models) => {
  router.get('/urls/', (request, response, next) => {
    models.Url.getUrls()
      .then(result => {
        if (result !== null) {
          response.json({
            data: result.map(res => ({
              longUrl: res.longUrl,
              shortUrl: `${ENDPOINT}/url/${res.code}`
            }))
          });
        } else {
          response.json({
            data: { urls: 'Not Found!' }
          });
        }
      })
      .catch(next);
  });

  router.get('/url/:code', (request, response, next) => {
    const { code } = request.params;

    models.Url.getLongUrl(code)
      .then(result => {
        if (result !== null) {
          response.redirect(result.longUrl);
        } else {
          response.redirect(ENDPOINT);
        }
      })
      .catch(next);
  });

  router.post(
    '/shorten',
    [check('url').isLength({ max: 2000 }), check('url').isURL()],
    (request, response, next) => {
      const { url } = request.body;
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
      }

      createShortUrlAndInsert(url)
        .then(result => {
          response.json({
            data: { longUrl: result.longUrl, shortUrl: `${ENDPOINT}/url/${result.code}` }
          });
        })
        .catch(next);
    }
  );
};

export default urlRoute;

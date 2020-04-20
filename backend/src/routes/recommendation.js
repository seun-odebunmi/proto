import auth from '../middleware/auth';
const { validationResult } = require('express-validator');

const recommendationRoute = (router, models) => {
  router.put('/recommendation', auth, (request, response, next) => {
    const { user, body } = request;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    try {
      if (body.id) {
        models.Recommendation.modify(body, user.id).then(() =>
          response.json({ msg: 'Updated successfully' })
        );
      } else {
        models.Recommendation.add(body, user.id).then(() =>
          response.json({ msg: 'Created successfully' })
        );
      }
    } catch (err) {
      next(err);
    }
  });
};

export default recommendationRoute;

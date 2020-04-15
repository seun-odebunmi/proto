const { validationResult } = require('express-validator');

const userRoute = (router, models) => {
  router.post('/login/', (request, response, next) => {
    const { body } = request;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    models.User.login(body)
      .then((res) => response.json(res))
      .catch((err) => next(err));
  });

  router.post('/register/', (request, response, next) => {
    const { body } = request;
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.array() });
    }

    models.User.createUser(body)
      .then((res) => response.json(res))
      .catch((err) => next(err));
  });
};

export default userRoute;

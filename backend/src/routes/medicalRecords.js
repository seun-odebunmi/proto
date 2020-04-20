import auth from '../middleware/auth';

const medicalRecordsRoute = (router, models) => {
  router.get('/medical-records', auth, (request, response, next) => {
    const { user, query } = request;
    const { page, size, sort } = query;
    const sortBy = sort ? sort.split(',') : [];
    const params = { user_id: user.id, page, size, sortBy };

    models.MedicalRecords.getByUserId(params)
      .then((result) => response.json(result))
      .catch((err) => next(err));
  });

  router.get('/patient/medical-records', auth, (request, response, next) => {
    const { query } = request;
    const { page, size, sort } = query;
    const sortBy = sort ? sort.split(',') : [];
    const params = { page, size, sortBy };

    models.MedicalRecords.getByUserId(params)
      .then((result) => response.json(result))
      .catch((err) => next(err));
  });
};

export default medicalRecordsRoute;

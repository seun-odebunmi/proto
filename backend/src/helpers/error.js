export const error = error => {
  const message = error.message
    .replace('SequelizeValidationError: ', '')
    .replace('Validation error: ', '')
    .replace('Context creation failed: ', '');

  return {
    ...error,
    message
  };
};

export const handleError = err => {
  if (err.name === 'Error') {
    throw new Error(err.message);
  }

  console.log(err);
  throw new Error('Request processing error!');
};

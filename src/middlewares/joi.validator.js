const { badRequest } = require("@hapi/boom");

const ValidateJoiSchema = (schema, param) => (req, res, next) => {
  const values = req[param];

  const { error } = schema.validate(values, { abortEarly: false });
  if (error) next(badRequest(error));

  return next();
};

module.exports = ValidateJoiSchema;

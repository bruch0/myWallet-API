import Joi from 'joi';

const validateTransactionObject = (value, description, type) => {
  const objectRules = Joi.object({
    value: Joi.string()
        .required(),
    description: Joi.string()
        .required(),
    type: Joi.string()
        .required(),
  });

  const objectHasMissingProperties = objectRules.validate(
      {
        value,
        description,
        type,
      }).error;

  return objectHasMissingProperties;
};

const validateTransactionMarketRules = (value, description, type) => {
  const marketRules = Joi.object({
    value: Joi.string()
        .required()
        .min(1),
    description: Joi.string()
        .required()
        .min(5),
    type: Joi.string()
        .required(),
  });

  const objectFailedMarketRules = marketRules.validate(
      {
        value,
        description,
        type,
      }).error;

  return objectFailedMarketRules;
};

const validateSignUpObject = (name, email, password) => {
  const objectRules = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .required(),
    password: Joi.string()
        .required(),
  });

  const objectHasMissingProperties = objectRules.validate(
      {
        name,
        email,
        password,
      }).error;

  return objectHasMissingProperties;
};

const validateSignUpMarketRules = (name, email, password) => {
  // eslint-disable-next-line max-len
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const marketRules = Joi.object({
    name: Joi.string()
        .required()
        .min(1),
    email: Joi.string()
        .required()
        .min(1)
        .pattern(regexEmail),
    password: Joi.string()
        .min(5)
        .required(),
  });

  const objectFailedMarketRules = marketRules.validate(
      {
        name,
        email,
        password,
      }).error;

  return objectFailedMarketRules;
};

const validateSignIn = (email, password) => {
  // eslint-disable-next-line max-len
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const marketRules = Joi.object({
    email: Joi.string()
        .required()
        .pattern(regexEmail),
    password: Joi.string()
        .min(5)
        .required(),
  });

  const objectFailedMarketRules = marketRules.validate(
      {
        email,
        password,
      }).error;

  return objectFailedMarketRules;
};

export {
  validateTransactionObject,
  validateTransactionMarketRules,
  validateSignUpObject,
  validateSignUpMarketRules,
  validateSignIn,
};

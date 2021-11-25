import joi from 'joi';

const signUp = joi.object({
  name: joi.string().required().min(3),
  email: joi
    .string()
    .required()
    .min(5)
    .pattern(/[a-zA-Z0-9]+@+[a-zA-Z0-9]+\.+[a-zA-Z0-9]/),
  password: joi.string().required().min(8),
});

const signIn = joi.object({
  email: joi
    .string()
    .required()
    .min(5)
    .pattern(/[a-zA-Z0-9]+@+[a-zA-Z0-9]+\.+[a-zA-Z0-9]/),
  password: joi.string().required().min(8),
});

export { signUp, signIn };

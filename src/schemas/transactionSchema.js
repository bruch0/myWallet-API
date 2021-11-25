import joi from 'joi';

const registerTransaction = joi.object({
  value: joi.string().required().min(1),
  description: joi.string().required().min(5),
  type: joi.string().required().valid('input', 'output'),
});

export { registerTransaction };

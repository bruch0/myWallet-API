import connection from '../database.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const signUp = async (req, res) => {
  let {
    name,
    email,
    password,
  } = req.body;
  // eslint-disable-next-line max-len
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regexHTML = /(<([^>]+)>)/ig;
  const objectRules = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .required(),
    password: Joi.string()
        .required(),
  });

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

  const objectHasMissingProperties = objectRules.validate(
      {
        name,
        email,
        password,
      }).error;
  if (!objectHasMissingProperties) {
    name = name.replace(regexHTML, '');
    email = email.replace(regexHTML, '');
    password = password.replace(regexHTML, '');

    const objectFailedMarketRules = marketRules.validate(
        {
          name,
          email,
          password,
        }).error;
    if (!objectFailedMarketRules) {
      try {
        const result = await connection.query(`
        SELECT * 
            FROM users 
            WHERE email = $1`, [email]);
        const emailAlreadyRegistered = result.rows[0] !== undefined;
        if (!emailAlreadyRegistered) {
          const hash = bcrypt.hashSync(password, 10);
          await connection.query(`
          INSERT INTO 
              users (name, email, password) 
            VALUES ($1, $2, $3)`, [name, email, hash]);
          res.sendStatus(201);
        } else {
          res.sendStatus(409);
        }
      } catch {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};

export {
  signUp,
};

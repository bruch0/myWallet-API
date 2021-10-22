import connection from '../database.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';

const signIn = async (req, res) => {
  // eslint-disable-next-line max-len
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const {email, password} = req.body;

  const marketRules = Joi.object({
    email: Joi.string()
        .required()
        .pattern(regexEmail),
    password: Joi.string()
        .min(5)
        .required(),
  });

  const objectFailedMarketRules = marketRules.validate({email, password}).error;
  if (!objectFailedMarketRules) {
    try {
      const emailRegistered = await connection.query(`
      SELECT * 
          FROM users 
        WHERE email = $1`, [email]);
      if (emailRegistered.rowCount !== 0) {
        const user = emailRegistered.rows[0].name;
        const hash = emailRegistered.rows[0].password;
        const isValidPassword = bcrypt.compareSync(password, hash);

        if (isValidPassword) {
          const result = await connection.query(`
          SELECT * 
              FROM sessions 
            WHERE userId = $1`, [emailRegistered.rows[0].id]);

          if (result.rowCount === 0) {
            const token = uuid();
            await connection.query(`
            INSERT INTO 
                sessions (token, userId) 
                VALUES ($1, $2)`, [token, emailRegistered.rows[0].id]);
            res.status(200).send({token});
          } else {
            res.status(200).send({token: result.rows[0].token, user});
          }
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(404);
      }
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
};

export {
  signIn,
};

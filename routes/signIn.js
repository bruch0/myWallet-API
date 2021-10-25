import connection from '../database/database.js';
import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import {validateSignIn} from '../functions/joiValidations.js';

const signIn = async (req, res) => {
  const {email, password} = req.body;

  const objectFailedMarketRules = validateSignIn(
      email,
      password,
  );
  if (objectFailedMarketRules) {
    res.sendStatus(400);
    return;
  }
  try {
    const emailRegistered = await connection.query(`
      SELECT * 
        FROM users 
        WHERE email = $1`, [email]);

    if (emailRegistered.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    const user = emailRegistered.rows[0].name;
    console.log(user);
    const hash = emailRegistered.rows[0].password;
    const isValidPassword = bcrypt.compareSync(password, hash);

    if (!isValidPassword) {
      res.sendStatus(401);
      return;
    }

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
      res.status(200).send({token, user});
    } else {
      res.status(200).send({token: result.rows[0].token, user});
    }
  } catch {
    res.sendStatus(500);
  }
};

export {
  signIn,
};

import connection from '../database/database.js';
import bcrypt from 'bcrypt';
import {
  validateSignUpMarketRules,
  validateSignUpObject,
} from '../functions/joiValidations.js';

const signUp = async (req, res) => {
  let {
    name,
    email,
    password,
  } = req.body;
  const regexHTML = /(<([^>]+)>)/ig;

  const objectHasMissingProperties = validateSignUpObject(
      name, email, password,
  );
  if (objectHasMissingProperties) {
    res.sendStatus(400);
    return;
  }

  name = name.replace(regexHTML, '');
  email = email.replace(regexHTML, '');
  password = password.replace(regexHTML, '');

  const objectFailedMarketRules = validateSignUpMarketRules(
      name, email, password,
  );
  if (objectFailedMarketRules) {
    res.sendStatus(400);
    return;
  }
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
};

export {
  signUp,
};

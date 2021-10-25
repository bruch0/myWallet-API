import connection from '../database/database.js';
import dayjs from 'dayjs';
import {
  validateTransactionObject,
  validateTransactionMarketRules,
} from '../functions/joiValidations.js';

const getTransactions = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const result = await connection.query(`
    SELECT * 
        FROM sessions
        WHERE token = $1`, [token]);
    const accountNotLogged = result.rows[0] === undefined;
    if (!accountNotLogged) {
      const userId = result.rows[0].userid;
      const transactions = await connection.query(`
      SELECT * 
        FROM transactions 
        WHERE userid = $1`, [userId]);
      res.status(200).send(transactions.rows);
    } else {
      res.sendStatus(409);
    }
  } catch {
    res.sendStatus(500);
  }
};

const postTransaction = async (req, res) => {
  let {value, description, type} = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const regexHTML = /(<([^>]+)>)/ig;
  if (!token) {
    res.sendStatus(401);
    return;
  }

  const objectHasMissingProperties = validateTransactionObject(
      value,
      description,
      type);
  if (objectHasMissingProperties) {
    res.sendStatus(400);
    return;
  }

  value = value.replace(regexHTML, '');
  description = description.replace(regexHTML, '');
  type = type.replace(regexHTML, '');
  const objectFailedMarketRules = validateTransactionMarketRules(
      value, description, type,
  );

  if (objectFailedMarketRules) {
    res.sendStatus(400);
    return;
  }

  try {
    const date = dayjs(Date.now()).format('DD/MM');
    const result = await connection.query(`
        SELECT * 
            FROM sessions
            WHERE token = $1`, [token]);
    if (result.rowCount !== 0) {
      const userId = result.rows[0].userid;
      await connection.query(`
          INSERT INTO 
                transactions (date, description, value, type, userId) 
                VALUES ($1, $2, $3, $4, $5)`,
      [date, description, value, type, userId]);
      res.sendStatus(201);
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(500);
  }
};

export {
  getTransactions,
  postTransaction,
};

import connection from '../database/database.js';

const getTransactions = async ({ userId }) => {
  const transactions = await connection.query(
    'SELECT * FROM transactions WHERE user_id = $1',
    [userId]
  );

  return transactions.rows;
};

const registerTransaction = async ({
  date,
  description,
  value,
  type,
  userId,
}) => {
  await connection.query(
    'INSERT INTO transactions (date, description, value, type, user_id) VALUES ($1, $2, $3, $4, $5)',
    [date, description, value, type, userId]
  );
};

export { getTransactions, registerTransaction };

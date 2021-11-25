import connection from '../database/database.js';

const checkSessionById = async ({ userId }) => {
  const sessionsExists = await connection.query(
    'SELECT * FROM sessions WHERE user_id = $1 LIMIT 1',
    [userId]
  );

  if (sessionsExists.rowCount) return { token: sessionsExists.rows[0].token };

  return 0;
};

const checkSessionByToken = async ({ token }) => {
  const validSession = await connection.query(
    'SELECT * FROM sessions WHERE token = $1 LIMIT 1',
    [token]
  );

  if (validSession.rowCount) return { userId: validSession.rows[0].user_id };

  return 0;
};

const createSession = async ({ userId, token }) => {
  await connection.query(
    'INSERT INTO sessions (token, user_id) VALUES ($1, $2)',
    [token, userId]
  );

  return 1;
};

export { checkSessionById, checkSessionByToken, createSession };

import connection from '../database/database.js';

const findByEmail = async ({ email, boolean }) => {
  const user = await connection.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return boolean ? Boolean(user.rowCount) : user.rows;
};

const signUp = async ({ name, email, hashedPassword }) => {
  await connection.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
    [name, email, hashedPassword]
  );

  return true;
};

export { findByEmail, signUp };

import { v4 as uuid } from 'uuid';
import connection from '../../src/database/database';
import createUser from './createUser';

const createSession = async () => {
  const { userId } = await createUser();

  const token = uuid();

  const session = await connection.query(
    'INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING token',
    [userId, token]
  );

  return { token: session.rows[0].token };
};

export default createSession;

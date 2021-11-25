import faker from 'faker';
import { hashSync } from 'bcrypt';

import connection from '../../src/database/database';

const createUser = async () => {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const hashedPassword = hashSync(password, 12);

  const user = await connection.query(
    'INSERT INTO USERS (name, email, password) VALUES ($1, $2, $3) RETURNING id',
    [name, email, hashedPassword]
  );

  return { email, password, userId: user.rows[0].id };
};

export default createUser;
